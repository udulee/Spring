package lk.ijse.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Table(name = "customer")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
@Entity
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private String cId;
    private String cName;
    private String cAddress;
    private String cPhone;


}