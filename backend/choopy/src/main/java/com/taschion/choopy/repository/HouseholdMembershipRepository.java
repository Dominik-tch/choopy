package com.taschion.choopy.repository;

import com.taschion.choopy.model.HouseholdMembership;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HouseholdMembershipRepository extends JpaRepository<HouseholdMembership, Long> {
    boolean existsByHouseholdIdAndMemberUsername(Long householdId, String username);
}
