package lk.ijse.backend.service.impl;

import jakarta.transaction.Transactional;
import lk.ijse.backend.dto.OrderDTO;
import lk.ijse.backend.entity.Item;
import lk.ijse.backend.entity.Order;
import lk.ijse.backend.exception.CustomException;
import lk.ijse.backend.repository.CustomerRepository;
import lk.ijse.backend.repository.ItemRepository;
import lk.ijse.backend.repository.OrderRepository;
import lk.ijse.backend.service.custom.OrderService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final ItemRepository itemRepository;
    private final CustomerRepository customerRepository;
    private final ModelMapper modelMapper;

    // FIX: customerId in OrderDTO is String, but Customer entity uses Integer PK
    //         Parse it safely before calling existsById
    private Integer parseIntId(String id, String label) {
        try {
            return Integer.valueOf(id.trim());
        } catch (NumberFormatException e) {
            throw new CustomException("Invalid " + label + " format: '" + id + "' — must be a number");
        }
    }

    // Item lookup helper
    private Item findItem(String itemId) {
        Integer id = parseIntId(itemId, "Item ID");
        return itemRepository.findById(id)
                .orElseThrow(() -> new CustomException("Item not found with ID: " + itemId));
    }
    //  SAVE ORDER
    @Transactional
    @Override
    public void saveOrder(OrderDTO orderDTO) {

        // 1. Validate customer exists (cId is Integer in Customer entity)
        Integer custId = parseIntId(orderDTO.getCustomerId(), "Customer ID");
        if (!customerRepository.existsById(custId)) {
            throw new CustomException("Customer not found with ID: " + orderDTO.getCustomerId());
        }

        // 2. Validate item exists and get live data from DB
        Item item = findItem(orderDTO.getItemId());

        // 3. Check stock
        if (item.getItemQuantity() < orderDTO.getQuantity()) {
            throw new CustomException(
                    "Insufficient stock! Available: " + item.getItemQuantity()
                            + ", Requested: " + orderDTO.getQuantity());
        }

        // 4. Build Order entity manually — do NOT use ModelMapper here
        //    because orderId MUST be null for @GeneratedValue(IDENTITY) to work
        Order order = new Order();
        order.setOrderId(null);                         // DB auto-generates
        order.setCustomerId(orderDTO.getCustomerId());
        order.setItemId(orderDTO.getItemId());
        order.setItemName(item.getItemName());          // Always use DB name, not client value
        order.setQuantity(orderDTO.getQuantity());
        order.setPrice(orderDTO.getPrice());
        order.setTotalPrice(orderDTO.getPrice() * orderDTO.getQuantity());
        // orderDate → set automatically by @CreationTimestamp

        // 5. Save — JPA returns entity with generated ID
        orderRepository.save(order);

        // 6. Deduct stock
        item.setItemQuantity(item.getItemQuantity() - orderDTO.getQuantity());
        itemRepository.save(item);
    }
    //  GET ALL ORDERS
    @Override
    public List<OrderDTO> getAllOrders() {
        return orderRepository.findAll()
                .stream()
                .map(order -> modelMapper.map(order, OrderDTO.class))
                .collect(Collectors.toList());
    }
    //  GET ORDER BY ID
    @Override
    public OrderDTO getOrderById(Integer id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new CustomException("Order not found with ID: " + id));
        return modelMapper.map(order, OrderDTO.class);
    }
    //  UPDATE ORDER
    @Transactional
    @Override
    public void updateOrder(Integer id, OrderDTO orderDTO) {

        // 1. Find existing order
        Order existingOrder = orderRepository.findById(id)
                .orElseThrow(() -> new CustomException("Order not found with ID: " + id));

        // 2. Restore stock of the old item before changing anything
        Item oldItem = findItem(existingOrder.getItemId());
        oldItem.setItemQuantity(oldItem.getItemQuantity() + existingOrder.getQuantity());
        itemRepository.save(oldItem);

        // 3. Validate new item + check stock
        Item newItem = findItem(orderDTO.getItemId());
        if (newItem.getItemQuantity() < orderDTO.getQuantity()) {
            // Rollback the stock restore we just did
            oldItem.setItemQuantity(oldItem.getItemQuantity() - existingOrder.getQuantity());
            itemRepository.save(oldItem);
            throw new CustomException(
                    "Insufficient stock! Available: " + newItem.getItemQuantity()
                            + ", Requested: " + orderDTO.getQuantity());
        }

        // 4. Update order fields (keep same orderId + orderDate)
        existingOrder.setCustomerId(orderDTO.getCustomerId());
        existingOrder.setItemId(orderDTO.getItemId());
        existingOrder.setItemName(newItem.getItemName());  // use DB name
        existingOrder.setQuantity(orderDTO.getQuantity());
        existingOrder.setPrice(orderDTO.getPrice());
        existingOrder.setTotalPrice(orderDTO.getPrice() * orderDTO.getQuantity());

        orderRepository.save(existingOrder);

        // 5. Deduct new stock
        newItem.setItemQuantity(newItem.getItemQuantity() - orderDTO.getQuantity());
        itemRepository.save(newItem);
    }

    //  DELETE ORDER
    @Transactional
    @Override
    public void deleteOrder(Integer id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new CustomException("Order not found with ID: " + id));

        // Restore item stock
        Item item = findItem(order.getItemId());
        item.setItemQuantity(item.getItemQuantity() + order.getQuantity());
        itemRepository.save(item);

        orderRepository.deleteById(id);
    }
    //  GET ORDERS BY CUSTOMER
    @Override
    public List<OrderDTO> getOrdersByCustomer(String customerId) {
        return orderRepository.findOrderHistoryByCustomer(customerId)
                .stream()
                .map(order -> modelMapper.map(order, OrderDTO.class))
                .collect(Collectors.toList());
    }
    //  GET ORDER HISTORY (newest first)
    @Override
    public List<OrderDTO> getOrderHistory() {
        return orderRepository.findAllByOrderByOrderDateDesc()
                .stream()
                .map(order -> modelMapper.map(order, OrderDTO.class))
                .collect(Collectors.toList());
    }
}