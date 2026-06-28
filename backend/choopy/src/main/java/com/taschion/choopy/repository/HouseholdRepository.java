package com.taschion.choopy.repository;

import com.taschion.choopy.model.Household;
import org.springframework.data.jpa.mapping.JpaPersistentProperty;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HouseholdRepository extends JpaRepository<Household, Long> {
    Household findByInviteCode(String inviteCode);
}
