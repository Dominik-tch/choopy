package com.taschion.choopy.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "household_memberships", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"household_id", "member_id"})
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HouseholdMembership {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "household_id", nullable = false)
    Household household;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "member_id", nullable = false)
    User member;

    private String role;

    @Column(nullable = false)
    @Builder.Default
    private Integer score = 0;
}
