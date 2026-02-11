package lk.ijse.backend.dto;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
public class ItemDTO {
    private String itemId;
    private String itemName;
    private double itemPrice;
    private int itemQuantity;
    private double itemCost;
    private String itemDescription;
}