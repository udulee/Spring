package lk.ijse.backend.service.custom;

import lk.ijse.backend.dto.ItemDTO;

import java.util.List;

public interface ItemService {
    void saveItem(ItemDTO itemDTO);
    List<ItemDTO> getAllItems();
    ItemDTO getItemById(String id);
    void updateItem(String id, ItemDTO itemDTO);
    void deleteItem(String id);

    ItemDTO getItemById(Integer id);

    void updateItem(Integer id, ItemDTO itemDTO);

    void deleteItem(Integer id);
}
