package lk.ijse.backend.service.impl;

import lk.ijse.backend.dto.ItemDTO;
import lk.ijse.backend.entity.Item;
import lk.ijse.backend.repository.ItemRepository;
import lk.ijse.backend.service.custom.ItemService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ItemServiceImpl implements ItemService {

    private final ItemRepository itemRepository;
    private final ModelMapper modelMapper;

    @Override
    public void saveItem(ItemDTO itemDTO) {
        // AUTO-CALCULATE COST
        itemDTO.setItemCost(itemDTO.getItemPrice() * itemDTO.getItemQuantity());

        Item item = modelMapper.map(itemDTO, Item.class);
        itemRepository.save(item);
    }

    @Override
    public List<ItemDTO> getAllItems() {
        return itemRepository.findAll().stream()
                .map(item -> modelMapper.map(item, ItemDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public ItemDTO getItemById(String id) {
        return null;
    }

    @Override
    public void updateItem(String id, ItemDTO itemDTO) {

    }

    @Override
    public void deleteItem(String id) {
    }


    @Override
    public ItemDTO getItemById(Integer id) {
        Item item = itemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Item not found with id: " + id));
        return modelMapper.map(item, ItemDTO.class);
    }

    @Override
    public void updateItem(Integer id, ItemDTO itemDTO) {
        if (!itemRepository.existsById(id)) {
            throw new RuntimeException("Item not found with id: " + id);
        }

        // AUTO-CALCULATE COST
        itemDTO.setItemCost(itemDTO.getItemPrice() * itemDTO.getItemQuantity());
        itemDTO.setItemId(id);

        Item item = modelMapper.map(itemDTO, Item.class);
        itemRepository.save(item);
    }

    @Override
    public void deleteItem(Integer id) {
        if (!itemRepository.existsById(id)) {
            throw new RuntimeException("Item not found with id: " + id);
        }
        itemRepository.deleteById(id);
    }
}
