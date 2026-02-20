package lk.ijse._3_security_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ApIResponse {
    private int code;
    private String message;
    private Object data;
}
