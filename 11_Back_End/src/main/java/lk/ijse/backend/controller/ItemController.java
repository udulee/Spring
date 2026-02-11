package lk.ijse.backend.controller;

import lk.ijse.backend.dto.ItemDTO;
import lk.ijse.backend.service.custom.ItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/v1/item")
@RequiredArgsConstructor
@CrossOrigin
public class ItemController {

    private final ItemService itemService;

    // POST endpoint to save item
    @PostMapping
    public ResponseEntity<String> saveItem(@RequestBody ItemDTO itemDTO) {
        itemService.saveItem(itemDTO);
        return ResponseEntity.ok("Item saved successfully");
    }

    // GET endpoint to retrieve all items
    @GetMapping
    public ResponseEntity<List<ItemDTO>> getAllItems() {
        List<ItemDTO> items = itemService.getAllItems();
        return ResponseEntity.ok(items);
    }

    // GET endpoint to retrieve an item by ID
    @GetMapping("/{id}")
    public ResponseEntity<ItemDTO> getItemById(@PathVariable String id) {
        ItemDTO item = itemService.getItemById(id);
        return ResponseEntity.ok(item);
    }

    // PUT endpoint to update item
    @PutMapping("/{id}")
    public ResponseEntity<String> updateItem(@PathVariable String id, @RequestBody ItemDTO itemDTO) {
        itemService.updateItem(id, itemDTO);
        return ResponseEntity.ok("Item updated successfully");
    }

    // DELETE endpoint to delete item
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteItem(@PathVariable String id) {
        itemService.deleteItem(id);
        return ResponseEntity.ok("Item deleted successfully");
    }
}

