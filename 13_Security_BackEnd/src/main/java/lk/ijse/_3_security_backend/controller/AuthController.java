package lk.ijse._3_security_backend.controller;

import lk.ijse._3_security_backend.dto.AuthDTO;
import lk.ijse._3_security_backend.dto.RegisterDTO;
import lk.ijse._3_security_backend.service.AuthService;
import lk.ijse.backend.util.APIResponse;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.Response;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/v1/auth")
@CrossOrigin
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;
    @PostMapping("register")
    public ResponseEntity<APIResponse> registerUser(@RequestBody RegisterDTO registerDTO) {
        return ResponseEntity.ok(new APIResponse
                (200,"OK",authService.register(registerDTO)));
    }
    @PostMapping("login")
    public ResponseEntity<APIResponse> loginUser(@RequestBody AuthDTO authDTO) {
        return ResponseEntity.ok(new APIResponse(
                200,"OK",authService.authenticate(authDTO)
        ));
    }

}
