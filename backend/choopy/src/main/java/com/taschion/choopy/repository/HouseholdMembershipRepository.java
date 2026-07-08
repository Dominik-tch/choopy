package com.taschion.choopy.repository;

import com.taschion.choopy.dto.MemberResponse;
import com.taschion.choopy.model.Household;
import com.taschion.choopy.model.HouseholdMembership;
import com.taschion.choopy.model.User;
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

    @Query("""
        SELECT new com.taschion.choopy.dto.MemberResponse(
            m.member.id,
            m.member.username,
            m.score
        )
        FROM HouseholdMembership m
        WHERE m.household.id = :householdId
    """)
        List<MemberResponse> findMemberResponsesByHouseholdId(@Param("householdId") Long householdId);
}
