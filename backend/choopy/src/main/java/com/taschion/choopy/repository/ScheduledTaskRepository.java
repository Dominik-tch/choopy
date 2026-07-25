package com.taschion.choopy.repository;

import com.taschion.choopy.model.ScheduledTask;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ScheduledTaskRepository extends JpaRepository<ScheduledTask, Long> {
    List<ScheduledTask> findByHouseholdId(Long householdId);
    boolean existsByTitleAndHouseholdId(String title, Long householdId);
}