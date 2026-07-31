package com.taschion.choopy.repository;

import com.taschion.choopy.model.Household;
import com.taschion.choopy.model.ScheduledTask;
import com.taschion.choopy.model.Task;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface TaskRepository extends JpaRepository<Task, Long> {
    boolean existsByTitleAndHouseholdId(String title, Long householdId);
    boolean existsByGeneratedByAndCreationDateGreaterThanEqual(ScheduledTask generatedBy, LocalDateTime startOfDay);
    boolean existsByGeneratedByAndCompletedByIsNull(ScheduledTask generatedBy);
    List<Task> findByHouseholdId(Long householdId);
    List<Task> findByHouseholdIdAndCompletedByIsNullOrderByCreationDateDesc(Long householdId);
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
        ORDER BY t.completionDate DESC
    """)
    List<Task> findTasksToConfirmByUserId(@Param("userId") Long userId);

    @Query("""
        SELECT COUNT(t)
        FROM Task t
        JOIN HouseholdMembership m
            ON m.household = t.household
        WHERE m.member.id = :userId
          AND t.completedBy IS NOT NULL
          AND t.confirmedBy IS NULL
          AND t.completedBy.id <> :userId
    """)
    long getTasksToConfirmCount(@Param("userId") Long userId);

    @Query("""
        SELECT t FROM Task t
        WHERE t.id IN (
            SELECT MAX(t2.id) FROM Task t2
            WHERE t2.household.id = :householdId
            GROUP BY t2.title
        )
        ORDER BY t.creationDate DESC
    """)
    List<Task> findRecentDistinctTasks(@Param("householdId") Long householdId, Pageable pageable);

    @Modifying
    @Query("""
        UPDATE Task t
        SET t.title = :title,
            t.description = :description,
            t.category = :category,
            t.duration = :duration,
            t.points = :points
        WHERE t.generatedBy.id = :schedulerId
    """)
    void updateAllTasksFromScheduler(
            @Param("schedulerId") Long schedulerId,
            @Param("title") String title,
            @Param("description") String description,
            @Param("category") String category,
            @Param("duration") Integer duration,
            @Param("points") Integer points
    );

    @Query("""
        SELECT COUNT(t) > 0 
        FROM Task t 
        WHERE t.title = :title 
          AND t.household.id = :householdId 
          AND (t.generatedBy IS NULL OR t.generatedBy.id <> :schedulerId)
    """)
    boolean existsConflictingTaskByTitle(
            @Param("title") String title,
            @Param("householdId") Long householdId,
            @Param("schedulerId") Long schedulerId
    );

    List<Task> findByHouseholdIdAndCompletedById(Long householdId, Long id);
}