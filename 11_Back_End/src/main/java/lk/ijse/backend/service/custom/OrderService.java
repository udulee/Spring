package lk.ijse.backend.service.custom;

import lk.ijse.backend.dto.OrderDTO;

import java.util.List;

public interface OrderService {

    // Save a new order
    void saveOrder(OrderDTO orderDTO);

    // Get all orders
    List<OrderDTO> getAllOrders();

    // Get an order by auto-generated integer ID
    OrderDTO getOrderById(Integer id);

    // Update an order by ID
    void updateOrder(Integer id, OrderDTO orderDTO);

    // Delete an order by ID
    void deleteOrder(Integer id);

    // Get orders by customer ID
    List<OrderDTO> getOrdersByCustomer(String customerId);

    // Get all order history (newest first)
    List<OrderDTO> getOrderHistory();
}
