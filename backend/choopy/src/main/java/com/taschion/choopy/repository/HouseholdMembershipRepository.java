package com.taschion.choopy.repository;

import com.taschion.choopy.model.Household;
import com.taschion.choopy.model.HouseholdMembership;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface HouseholdMembershipRepository extends JpaRepository<HouseholdMembership, Long> {
    boolean existsByHouseholdIdAndMemberUsername(Long householdId, String username);

    @Query("""
        SELECT m.household
        FROM HouseholdMembership m
        WHERE m.member.id = :userId
    """)
    List<Household> findHouseholdsByUserId(@Param("userId") Long userId);

    @Query("""
        SELECT COUNT(m)
        FROM HouseholdMembership m
        WHERE m.household.id = :householdId
        """)
    int getMemberCount(@Param("householdId") Long householdId);
}
