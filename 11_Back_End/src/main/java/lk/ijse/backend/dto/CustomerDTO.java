package lk.ijse.backend.dto;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter@Setter@NoArgsConstructor@AllArgsConstructor
public class CustomerDTO {

    //    @NotNull(message = "Customer ID is required")
    private Integer cId;

    @NotBlank(message = "Customer name is mandatory")
    private String cName;

    @NotBlank(message = "Address is mandatory")
    @Size(min = 10, message = "Address must be at least 10 chars")
    private String cAddress;

    private String cPhone;
}