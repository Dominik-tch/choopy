package com.taschion.choopy.service;

import com.taschion.choopy.dto.ShoppingItemRequest;
import com.taschion.choopy.dto.ShoppingItemResponse;
import com.taschion.choopy.exception.MembershipNotFoundException;
import com.taschion.choopy.exception.ShoppingItemNotFoundException;
import com.taschion.choopy.model.Household;
import com.taschion.choopy.model.ShoppingItem;
import com.taschion.choopy.model.User;
import com.taschion.choopy.repository.HouseholdMembershipRepository;
import com.taschion.choopy.repository.HouseholdRepository;
import com.taschion.choopy.repository.ShoppingItemRepository;
import com.taschion.choopy.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ShoppingService {

    private final ShoppingItemRepository shoppingRepo;
    private final HouseholdRepository householdRepo;
    private final UserRepository userRepo;
    private final HouseholdMembershipRepository houseMemberRepo;


    public List<ShoppingItemResponse> getItemsForHousehold(Long householdId, String username) {
        checkMembership(householdId, username);
        return shoppingRepo.findByHouseholdIdOrderByCreationDateDesc(householdId)
                .stream()
                .map(ShoppingItemResponse::fromEntity)
                .toList();
    }

    public ShoppingItemResponse createItem(ShoppingItemRequest request, String username) {
        checkMembership(request.householdId(), username);

        Household household = householdRepo.findById(request.householdId())
                .orElseThrow(() -> new RuntimeException("Household not found"));
        User writer = userRepo.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        ShoppingItem item = ShoppingItem.builder()
                .content(request.content())
                .household(household)
                .writer(writer)
                .done(false)
                .creationDate(LocalDateTime.now())
                .build();

        ShoppingItem savedItem = shoppingRepo.save(item);
        return ShoppingItemResponse.fromEntity(savedItem);
    }

    @Transactional
    public ShoppingItemResponse updateItem(ShoppingItemRequest request, Long itemId, String username) {
        checkMembership(request.householdId(), username);
        ShoppingItem item = shoppingRepo.findById(itemId)
                .orElseThrow(() -> new ShoppingItemNotFoundException("Item not found"));
        item.setContent(request.content());
        return ShoppingItemResponse.fromEntity(item);
    }

    @Transactional
    public void toggleItem(Long itemId, String username) {
        ShoppingItem item = shoppingRepo.findById(itemId)
                .orElseThrow(() -> new ShoppingItemNotFoundException("Item not found"));

        checkMembership(item.getHousehold().getId(), username);

        item.setDone(!item.isDone());
        shoppingRepo.save(item);
    }

    public void deleteItem(Long itemId, String username) {
        ShoppingItem item = shoppingRepo.findById(itemId)
                .orElseThrow(() -> new ShoppingItemNotFoundException("Item not found"));

        checkMembership(item.getHousehold().getId(), username);

        shoppingRepo.delete(item);
    }

    private void checkMembership(Long householdId, String username) {
        boolean isMember = houseMemberRepo.existsByHouseholdIdAndMemberUsername(householdId, username);
        if (!isMember) {
            throw new MembershipNotFoundException("Access denied: You are not a member of this household!");
        }
    }
}