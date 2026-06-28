package com.taschion.choopy.controller;

import com.taschion.choopy.model.Household;
import com.taschion.choopy.model.HouseholdMembership;
import com.taschion.choopy.model.Task;
import com.taschion.choopy.service.HouseholdMembershipService;
import com.taschion.choopy.service.HouseholdService;
import com.taschion.choopy.service.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/households")
@RequiredArgsConstructor
public class HouseholdController {
    private final TaskService taskService;
    private final HouseholdService householdService;
    private final HouseholdMembershipService membershipService;

    @PostMapping()
    ResponseEntity<Household> createHousehold(@RequestBody Household household, Authentication authentication) {
        String username = authentication.getName();
        return ResponseEntity.ok(householdService.createHousehold(household, username));
    }

    @GetMapping("/{id}/tasks")
    ResponseEntity<List<Task>> getHouseholdTasks(@PathVariable Long id, Authentication authentication) {
        String userName = authentication.getName();
        return ResponseEntity.ok(householdService.getTasksForHousehold(id, userName));
    }

    @PostMapping("/join")
    public ResponseEntity<HouseholdMembership> joinHousehold(
            @RequestBody Map<String, String> requestBody,
            Authentication authentication
    ) {
        String username = authentication.getName();
        String inviteCode = requestBody.get("inviteCode");
        HouseholdMembership newMembership = membershipService.joinWithCode(inviteCode, username);

        return ResponseEntity.ok(newMembership);
    }
}
