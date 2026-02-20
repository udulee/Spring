package lk.ijse.backend.controller;

import jakarta.validation.Valid;
import lk.ijse.backend.dto.CustomerDTO;
import lk.ijse.backend.service.custom.CustomerService;
import lk.ijse.backend.util.APIResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/customer")
@RequiredArgsConstructor
@CrossOrigin
public class CustomerController {

    private final CustomerService customerService;

    @PostMapping
    public ResponseEntity<APIResponse<String>> save(@Valid @RequestBody CustomerDTO dto) {
        dto.setCId(null); // Force ID to null so Hibernate knows it's a NEW record
        customerService.saveCustomer(dto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new APIResponse<>(201, "Saved Successfully", null));
    }

    @GetMapping
    public ResponseEntity<APIResponse<List<CustomerDTO>>> getAll() {
        return ResponseEntity.ok(new APIResponse<>(200, "Success", customerService.getAllCustomers()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<APIResponse<String>> update(@PathVariable Integer id, @Valid @RequestBody CustomerDTO dto) {
        // Ensure the ID from the URL is the one being updated
        customerService.updateCustomer(id, dto);
        return ResponseEntity.ok(new APIResponse<>(200, "Updated Successfully", null));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<APIResponse<String>> delete(@PathVariable Integer id) {
        customerService.deleteCustomer(id);
        return ResponseEntity.ok(new APIResponse<>(200, "Deleted", null));
    }
}