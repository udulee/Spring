package lk.ijse.backend.controller;


import lk.ijse.backend.dto.OrderDTO;
import lk.ijse.backend.service.custom.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/v1/order")
@RequiredArgsConstructor
@CrossOrigin
public class PlaceOrderController {

    private final OrderService orderService;

    // POST - Save new order
    @PostMapping
    public ResponseEntity<String> saveOrder(@RequestBody OrderDTO orderDTO) {
        orderService.saveOrder(orderDTO);
        return ResponseEntity.ok("Order placed successfully");
    }

    // GET - Get all orders
    @GetMapping
    public ResponseEntity<List<OrderDTO>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    // GET - Get order by ID
    @GetMapping("/{id}")
    public ResponseEntity<OrderDTO> getOrderById(@PathVariable String id) {
        return ResponseEntity.ok(orderService.getOrderById(id));
    }

    // PUT - Update order
    @PutMapping("/{id}")
    public ResponseEntity<String> updateOrder(@PathVariable String id, @RequestBody OrderDTO orderDTO) {
        orderService.updateOrder(id, orderDTO);
        return ResponseEntity.ok("Order updated successfully");
    }

    // DELETE - Delete order
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteOrder(@PathVariable String id) {
        orderService.deleteOrder(id);
        return ResponseEntity.ok("Order deleted successfully");
    }

    // GET - Order history (newest first)
    @GetMapping("/history")
    public ResponseEntity<List<OrderDTO>> getOrderHistory() {
        return ResponseEntity.ok(orderService.getOrderHistory());
    }

    // GET - Orders by customer ID
    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<OrderDTO>> getOrdersByCustomer(@PathVariable String customerId) {
        return ResponseEntity.ok(orderService.getOrdersByCustomer(customerId));
    }
}
