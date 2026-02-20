package lk.ijse.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "customer")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Customer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "c_id")
    private Integer cId;

    @Column(name = "c_name")
    private String cName;

    @Column(name = "c_address")
    private String cAddress;

    @Column(name = "c_phone")
    private String cPhone;
}