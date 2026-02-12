package lk.ijse.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderDTO {
    private String orderId;
    private String customerId;
    private String itemId;
    private String itemName;
    private int quantity;
    private double price;
    private double totalPrice;
    private LocalDateTime orderDate;
}