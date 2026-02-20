package lk.ijse.backend.controller;

import jakarta.validation.Valid;
import lk.ijse.backend.dto.OrderDTO;
import lk.ijse.backend.service.custom.OrderService;
import lk.ijse.backend.util.APIResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.util.List;
@RestController
@RequestMapping("/api/v1/order")
@RequiredArgsConstructor
@CrossOrigin
public class PlaceOrderController {

    private final OrderService orderService;

    // POST - Save new order (ID is auto-generated)
    @PostMapping
    public ResponseEntity<APIResponse<Void>> saveOrder(@Valid @RequestBody OrderDTO orderDTO) {
        orderDTO.setOrderId(null); // Force null so DB generates it
        orderService.saveOrder(orderDTO);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new APIResponse<>(201, "Order Saved Successfully", null));
    }

    // GET - Get all orders
    @GetMapping
    public ResponseEntity<APIResponse<List<OrderDTO>>> getAllOrders() {
        List<OrderDTO> orders = orderService.getAllOrders();
        return ResponseEntity.ok(new APIResponse<>(200, "Success", orders));
    }

    // GET - Get order by ID
    @GetMapping("/{id}")
    public ResponseEntity<APIResponse<OrderDTO>> getOrderById(@PathVariable Integer id) {
        OrderDTO order = orderService.getOrderById(id);
        return ResponseEntity.ok(new APIResponse<>(200, "Success", order));
    }

    // PUT - Update order
    @PutMapping("/{id}")
    public ResponseEntity<APIResponse<Void>> updateOrder(
            @PathVariable Integer id,
            @Valid @RequestBody OrderDTO orderDTO) {
        orderService.updateOrder(id, orderDTO);
        return ResponseEntity.ok(new APIResponse<>(200, "Order Updated Successfully", null));
    }

    // DELETE - Delete order
    @DeleteMapping("/{id}")
    public ResponseEntity<APIResponse<Void>> deleteOrder(@PathVariable Integer id) {
        orderService.deleteOrder(id);
        return ResponseEntity.ok(new APIResponse<>(200, "Order Deleted Successfully", null));
    }

    // GET - Order history (newest first)
    @GetMapping("/history")
    public ResponseEntity<APIResponse<List<OrderDTO>>> getOrderHistory() {
        List<OrderDTO> history = orderService.getOrderHistory();
        return ResponseEntity.ok(new APIResponse<>(200, "Success", history));
    }

    // GET - Orders by customer ID
    @GetMapping("/customer/{customerId}")
    public ResponseEntity<APIResponse<List<OrderDTO>>> getOrdersByCustomer(
            @PathVariable String customerId) {
        List<OrderDTO> orders = orderService.getOrdersByCustomer(customerId);
        return ResponseEntity.ok(new APIResponse<>(200, "Success", orders));
    }
}