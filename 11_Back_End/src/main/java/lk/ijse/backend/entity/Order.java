package lk.ijse.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "orders")   // "order" is a reserved SQL keyword, so we use "orders"
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Order {

    @Id
    @Column(name = "order_id", length = 15)
    private String orderId;

    @Column(name = "customer_id", length = 10, nullable = false)
    private String customerId;

    @Column(name = "item_id", length = 10, nullable = false)
    private String itemId;

    @Column(name = "item_name", length = 100, nullable = false)
    private String itemName;

    @Column(name = "quantity", nullable = false)
    private int quantity;

    @Column(name = "price", nullable = false)
    private double price;

    @Column(name = "total_price", nullable = false)
    private double totalPrice;

    @CreationTimestamp
    @Column(name = "order_date", updatable = false)
    private LocalDateTime orderDate;

    // Convenience constructor without orderDate (auto-generated)
    public Order(String orderId, String customerId, String itemId,
                 String itemName, int quantity, double price, double totalPrice) {
        this.orderId = orderId;
        this.customerId = customerId;
        this.itemId = itemId;
        this.itemName = itemName;
        this.quantity = quantity;
        this.price = price;
        this.totalPrice = totalPrice;
    }
}
