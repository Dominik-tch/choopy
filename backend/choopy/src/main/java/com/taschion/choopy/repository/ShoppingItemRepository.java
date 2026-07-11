package com.taschion.choopy.repository;

import com.taschion.choopy.model.ShoppingItem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ShoppingItemRepository extends JpaRepository<ShoppingItem, Long> {

    List<ShoppingItem> findByHouseholdIdOrderByCreationDateDesc(Long householdId);
}