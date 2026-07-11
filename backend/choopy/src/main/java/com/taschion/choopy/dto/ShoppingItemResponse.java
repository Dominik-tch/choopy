package com.taschion.choopy.dto;

import com.taschion.choopy.model.ShoppingItem;

import java.time.LocalDateTime;

public record ShoppingItemResponse(
        Long id,
        String content,
        boolean done,
        LocalDateTime creationDate,
        String writerUsername
) {

    public static ShoppingItemResponse fromEntity(ShoppingItem item) {
        return new ShoppingItemResponse(
                item.getId(),
                item.getContent(),
                item.isDone(),
                item.getCreationDate(),
                item.getWriter() != null ? item.getWriter().getUsername() : "Unknown"
        );
    }
}