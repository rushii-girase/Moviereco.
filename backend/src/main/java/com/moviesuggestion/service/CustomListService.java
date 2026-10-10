package com.moviesuggestion.service;

import com.moviesuggestion.dto.CustomListDto;
import com.moviesuggestion.dto.ListItemDto;
import com.moviesuggestion.entity.CustomList;
import com.moviesuggestion.entity.ListItem;
import com.moviesuggestion.entity.User;
import com.moviesuggestion.repository.CustomListRepository;
import com.moviesuggestion.repository.ListItemRepository;
import com.moviesuggestion.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class CustomListService {

    private final CustomListRepository listRepository;
    private final ListItemRepository itemRepository;
    private final UserRepository userRepository;

    public CustomListService(CustomListRepository listRepository, ListItemRepository itemRepository, UserRepository userRepository) {
        this.listRepository = listRepository;
        this.itemRepository = itemRepository;
        this.userRepository = userRepository;
    }

    public CustomList createList(Long userId, CustomListDto dto) {
        if (listRepository.existsByUserIdAndName(userId, dto.getName())) {
            throw new RuntimeException("List with this name already exists");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        CustomList list = CustomList.builder()
                .user(user)
                .name(dto.getName())
                .description(dto.getDescription())
                .isPublic(dto.getIsPublic() != null && dto.getIsPublic())
                .shareCode(UUID.randomUUID().toString())
                .build();

        return listRepository.save(list);
    }

    public List<CustomList> getUserLists(Long userId) {
        return listRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public CustomList getListById(Long listId, Long userId) {
        return listRepository.findByIdAndUserId(listId, userId)
                .orElseThrow(() -> new RuntimeException("List not found"));
    }

    public CustomList getSharedList(String shareCode) {
        CustomList list = listRepository.findByShareCode(shareCode)
                .orElseThrow(() -> new RuntimeException("Shared list not found"));
        if (!list.getIsPublic()) {
            throw new RuntimeException("This list is not public");
        }
        return list;
    }

    public CustomList updateList(Long listId, Long userId, CustomListDto dto) {
        CustomList list = getListById(listId, userId);
        list.setName(dto.getName());
        list.setDescription(dto.getDescription());
        if (dto.getIsPublic() != null) {
            list.setIsPublic(dto.getIsPublic());
        }
        return listRepository.save(list);
    }

    @Transactional
    public void deleteList(Long listId, Long userId) {
        CustomList list = getListById(listId, userId);
        listRepository.delete(list);
    }

    public ListItem addItemToList(Long listId, Long userId, ListItemDto dto) {
        CustomList list = getListById(listId, userId);

        if (itemRepository.existsByCustomListIdAndTmdbIdAndMediaType(listId, dto.getTmdbId(), dto.getMediaType())) {
            throw new RuntimeException("Item already in list");
        }

        ListItem item = ListItem.builder()
                .customList(list)
                .tmdbId(dto.getTmdbId())
                .mediaType(dto.getMediaType() != null ? dto.getMediaType() : "movie")
                .title(dto.getTitle())
                .posterPath(dto.getPosterPath())
                .sortOrder(dto.getSortOrder() != null ? dto.getSortOrder() : 0)
                .build();

        return itemRepository.save(item);
    }

    @Transactional
    public void removeItemFromList(Long listId, Long userId, Integer tmdbId, String mediaType) {
        getListById(listId, userId); // verify ownership
        itemRepository.deleteByCustomListIdAndTmdbIdAndMediaType(listId, tmdbId, mediaType);
    }

    public List<ListItem> getListItems(Long listId) {
        return itemRepository.findByCustomListIdOrderBySortOrderAsc(listId);
    }
}
