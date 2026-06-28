package com.taschion.choopy.repository;

import com.taschion.choopy.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByHouseholdId(Long householdId);
}
