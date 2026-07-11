package com.taschion.choopy.repository;

import com.taschion.choopy.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByHouseholdId(Long householdId);
    List<Task> findByHouseholdIdAndCompletedByIsNull(Long householdId);
    List<Task> findByHouseholdIdAndCompletedByIsNotNullOrderByCompletionDateDesc(Long householdId);
    List<Task> findByHouseholdIdAndCompletedByIdOrderByCompletionDateDesc(Long householdId, Long completedById);
}
