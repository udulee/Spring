package lk.ijse.backend.service.impl;

import jakarta.transaction.Transactional;
import lk.ijse.backend.dto.OrderDTO;
import lk.ijse.backend.entity.Item;
import lk.ijse.backend.entity.Order;
import lk.ijse.backend.repository.CustomerRepository;
import lk.ijse.backend.repository.ItemRepository;
import lk.ijse.backend.repository.OrderRepository;
import lk.ijse.backend.service.custom.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final ItemRepository itemRepository;
    private final CustomerRepository customerRepository;

    // @Transactional ensures ALL operations succeed or ALL rollback
    @Transactional
    @Override
    public void saveOrder(OrderDTO orderDTO) {

        // Step 1: Validate customer exists
        if (!customerRepository.existsById(orderDTO.getCustomerId())) {
            throw new RuntimeException("Customer not found: " + orderDTO.getCustomerId());
        }

        // Step 2: Validate item exists and has enough stock
        Item item = itemRepository.findById(orderDTO.getItemId())
                .orElseThrow(() -> new RuntimeException("Item not found: " + orderDTO.getItemId()));

        // Step 3: Check stock availability
        if (item.getItemQuantity() < orderDTO.getQuantity()) {
            throw new RuntimeException(
                    "Insufficient stock! Available: " + item.getItemQuantity()
                            + ", Requested: " + orderDTO.getQuantity()
            );
        }

        // Step 4: Calculate total price
        double totalPrice = orderDTO.getPrice() * orderDTO.getQuantity();
        orderDTO.setTotalPrice(totalPrice);

        // Step 5: Save order
        Order order = new Order(
                orderDTO.getOrderId(),
                orderDTO.getCustomerId(),
                orderDTO.getItemId(),
                orderDTO.getItemName(),
                orderDTO.getQuantity(),
                orderDTO.getPrice(),
                totalPrice
        );
        orderRepository.save(order);

        // Step 6: Reduce item stock (deduct ordered quantity)
        item.setItemQuantity(item.getItemQuantity() - orderDTO.getQuantity());
        itemRepository.save(item);

        // If any step above throws exception → @Transactional rolls back ALL changes
    }

    @Override
    public List<OrderDTO> getAllOrders() {
        return orderRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public OrderDTO getOrderById(String id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found: " + id));
        return toDTO(order);
    }

    @Transactional
    @Override
    public void updateOrder(String id, OrderDTO orderDTO) {
        // Get original order to restore stock
        Order originalOrder = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found: " + id));

        // Step 1: Restore original item stock
        Item originalItem = itemRepository.findById(originalOrder.getItemId())
                .orElseThrow(() -> new RuntimeException("Item not found: " + originalOrder.getItemId()));
        originalItem.setItemQuantity(originalItem.getItemQuantity() + originalOrder.getQuantity());
        itemRepository.save(originalItem);

        // Step 2: Validate new item stock
        Item newItem = itemRepository.findById(orderDTO.getItemId())
                .orElseThrow(() -> new RuntimeException("Item not found: " + orderDTO.getItemId()));

        if (newItem.getItemQuantity() < orderDTO.getQuantity()) {
            throw new RuntimeException(
                    "Insufficient stock! Available: " + newItem.getItemQuantity()
                            + ", Requested: " + orderDTO.getQuantity()
            );
        }

        // Step 3: Update the order
        double totalPrice = orderDTO.getPrice() * orderDTO.getQuantity();
        Order updatedOrder = new Order(
                orderDTO.getOrderId(),
                orderDTO.getCustomerId(),
                orderDTO.getItemId(),
                orderDTO.getItemName(),
                orderDTO.getQuantity(),
                orderDTO.getPrice(),
                totalPrice
        );
        orderRepository.save(updatedOrder);

        // Step 4: Deduct new stock
        newItem.setItemQuantity(newItem.getItemQuantity() - orderDTO.getQuantity());
        itemRepository.save(newItem);
    }

    @Transactional
    @Override
    public void deleteOrder(String id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found: " + id));

        // Restore item stock when order is deleted
        Item item = itemRepository.findById(order.getItemId())
                .orElseThrow(() -> new RuntimeException("Item not found: " + order.getItemId()));
        item.setItemQuantity(item.getItemQuantity() + order.getQuantity());
        itemRepository.save(item);

        orderRepository.deleteById(id);
    }

    @Override
    public List<OrderDTO> getOrdersByCustomer(String customerId) {
        return orderRepository.findOrderHistoryByCustomer(customerId)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<OrderDTO> getOrderHistory() {
        return orderRepository.findAllByOrderByOrderDateDesc()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    // Helper method: Convert Order entity → OrderDTO
    private OrderDTO toDTO(Order order) {
        return new OrderDTO(
                order.getOrderId(),
                order.getCustomerId(),
                order.getItemId(),
                order.getItemName(),
                order.getQuantity(),
                order.getPrice(),
                order.getTotalPrice(),
                order.getOrderDate()
        );
    }
}
