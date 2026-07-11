package com.taschion.choopy.dto;


public record ShoppingItemRequest(
        Long householdId,
        String content
) {
}