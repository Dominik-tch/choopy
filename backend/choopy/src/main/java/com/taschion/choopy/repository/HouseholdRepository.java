package com.taschion.choopy.repository;

import com.taschion.choopy.model.Household;
import org.springframework.data.jpa.mapping.JpaPersistentProperty;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface HouseholdRepository extends JpaRepository<Household, Long> {
    Optional<Household> findByInviteCode(String inviteCode);
}
