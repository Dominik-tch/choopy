package com.taschion.choopy.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "scheduled_task")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ScheduledTask {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;
    private String category;
    private Integer duration;
    private Integer points;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "household_id", nullable = false)
    private Household household;

    @Column(name = "scheduled_days", nullable = false)
    private String scheduledDays;
}

