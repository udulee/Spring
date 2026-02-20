package lk.ijse.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.*;

@Entity
@Table(name = "item")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
public class Item {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "item_id")
    private Integer itemId;

    @Column(name = "item_name", nullable = false)
    private String itemName;

    @Column(name = "item_price", nullable = false)
    private double itemPrice;

    @Column(name = "item_quantity", nullable = false)
    private int itemQuantity;

    @Column(name = "item_cost", nullable = false)
    private double itemCost;

    @Column(name = "item_description")
    private String itemDescription;
}
