package com.taschion.choopy.repository;

import com.taschion.choopy.model.Household;
import com.taschion.choopy.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByHouseholdId(Long householdId);
    List<Task> findByHouseholdIdAndCompletedByIsNull(Long householdId);
    List<Task> findByHouseholdIdAndCompletedByIsNotNullOrderByCompletionDateDesc(Long householdId);
    List<Task> findByHouseholdIdAndCompletedByIdOrderByCompletionDateDesc(Long householdId, Long completedById);

    @Query("""
        SELECT t
        FROM Task t
        JOIN HouseholdMembership m
            ON m.household = t.household
        WHERE m.member.id = :userId
          AND t.completedBy IS NOT NULL
          AND t.confirmedBy IS NULL
          AND t.completedBy.id <> :userId
    """)
    List<Task> findTasksToConfirmByUserId(@Param("userId") Long userId);
}