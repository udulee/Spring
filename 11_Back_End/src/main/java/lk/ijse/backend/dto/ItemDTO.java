package lk.ijse.backend.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
public class ItemDTO {
    private Integer itemId;  // Changed from String

    @NotBlank(message = "Item name is mandatory")
    private String itemName;

    @NotNull(message = "Item price is required")
    @Min(value = 0, message = "Price cannot be negative")
    private Double itemPrice;

    @NotNull(message = "Item quantity is required")
    @Min(value = 0, message = "Quantity cannot be negative")
    private Integer itemQuantity;

    private Double itemCost;  // Auto-calculated, no validation needed

    @Size(max = 255, message = "Description too long")
    private String itemDescription;
}