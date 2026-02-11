package lk.ijse.backend.service.impl;

import lk.ijse.backend.dto.ItemDTO;
import lk.ijse.backend.entity.Item;
import lk.ijse.backend.repository.ItemRepository;
import lk.ijse.backend.service.custom.ItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ItemServiceImpl implements ItemService {

    private final  ItemRepository itemRepository;

    @Override
    public void saveItem(ItemDTO itemDTO) {
        Item item = new Item(
                itemDTO.getItemId(),
                itemDTO.getItemName(),
                itemDTO.getItemPrice(),
                itemDTO.getItemQuantity(),
                itemDTO.getItemCost(),
                itemDTO.getItemDescription()
        );
        itemRepository.save(item);
    }

    @Override
    public List<ItemDTO> getAllItems() {
        return itemRepository.findAll().stream()
                .map(item -> new ItemDTO(
                        item.getItemId(),
                        item.getItemName(),
                        item.getItemPrice(),
                        item.getItemQuantity(),
                        item.getItemCost(),
                        item.getItemDescription()
                ))
                .collect(Collectors.toList());
    }

    @Override
    public ItemDTO getItemById(String id) {
        Item item = itemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Item not found with id: " + id));

        return new ItemDTO(
                item.getItemId(),
                item.getItemName(),
                item.getItemPrice(),
                item.getItemQuantity(),
                item.getItemCost(),
                item.getItemDescription()
        );
    }

    @Override
    public void updateItem(String id, ItemDTO itemDTO) {
        if (!itemRepository.existsById(id)) {
            throw new RuntimeException("Item not found with id: " + id);
        }

        Item item = new Item(
                itemDTO.getItemId(),
                itemDTO.getItemName(),
                itemDTO.getItemPrice(),
                itemDTO.getItemQuantity(),
                itemDTO.getItemCost(),
                itemDTO.getItemDescription()
        );
        itemRepository.save(item);
    }

    @Override
    public void deleteItem(String id) {
        if (!itemRepository.existsById(id)) {
            throw new RuntimeException("Item not found with id: " + id);
        }
        itemRepository.deleteById(id);
    }
}
