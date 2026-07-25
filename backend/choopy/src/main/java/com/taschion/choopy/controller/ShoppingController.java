package com.taschion.choopy.controller;

import com.taschion.choopy.dto.ShoppingItemRequest;
import com.taschion.choopy.dto.ShoppingItemResponse;
import com.taschion.choopy.service.ShoppingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/shopping")
@RequiredArgsConstructor
public class ShoppingController {

    private final ShoppingService shoppingService;

    @GetMapping("/household/{householdId}")
    public ResponseEntity<List<ShoppingItemResponse>> getItems(@PathVariable Long householdId, Authentication authentication) {
        return ResponseEntity.ok(shoppingService.getItemsForHousehold(householdId, authentication.getName()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ShoppingItemResponse> updateItem(@RequestBody ShoppingItemRequest request, @PathVariable Long id, Authentication authentication) {
        return ResponseEntity.ok(shoppingService.updateItem(request, id, authentication.getName()));
    }

    @PostMapping
    public ResponseEntity<ShoppingItemResponse> createItem(@RequestBody ShoppingItemRequest request, Authentication authentication) {
        return ResponseEntity.ok(shoppingService.createItem(request, authentication.getName()));
    }

    @PatchMapping("/{id}/toggle")
    public ResponseEntity<Void> toggleItem(@PathVariable Long id, Authentication authentication) {
        shoppingService.toggleItem(id, authentication.getName());
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteItem(@PathVariable Long id, Authentication authentication) {
        shoppingService.deleteItem(id, authentication.getName());
        return ResponseEntity.ok().build();
    }
}