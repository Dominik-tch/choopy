package com.taschion.choopy.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "tasks")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @CreationTimestamp
    @Column(name = "creation_date", updatable = false)
    private LocalDateTime creationDate;

    private String category;
    private String title;
    private String description;
    private Integer duration;
    private Integer points;
    private LocalDateTime completionDate;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "household_id", nullable = false)
    private Household household;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "creator_id")
    private User creator;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "assigned_to_id")
    private User assignedTo;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "completed_by_id")
    private User completedBy;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "confirmed_by_id")
    private User confirmedBy;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "scheduled_task_id")
    private ScheduledTask generatedBy;
}
