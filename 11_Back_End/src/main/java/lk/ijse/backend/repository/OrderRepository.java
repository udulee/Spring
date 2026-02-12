package lk.ijse.backend.repository;

import lk.ijse.backend.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, String> {

    // Find all orders by customer ID
    List<Order> findByCustomerId(String customerId);

    // Find all orders by item ID
    List<Order> findByItemId(String itemId);

    // Find orders ordered by date descending (newest first) - for order history
    List<Order> findAllByOrderByOrderDateDesc();

    // Custom query: find orders by customer with total > amount
    @Query("SELECT o FROM Order o WHERE o.customerId = :customerId ORDER BY o.orderDate DESC")
    List<Order> findOrderHistoryByCustomer(@Param("customerId") String customerId);

    // Check if customer exists in orders
    boolean existsByCustomerId(String customerId);

    // Check if item exists in orders
    boolean existsByItemId(String itemId);
}
