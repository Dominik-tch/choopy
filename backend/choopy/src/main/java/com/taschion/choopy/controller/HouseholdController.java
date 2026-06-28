package com.taschion.choopy.controller;

import com.taschion.choopy.dto.HouseholdMembershipResponse;
import com.taschion.choopy.dto.HouseholdRequest;
import com.taschion.choopy.dto.HouseholdResponse;
import com.taschion.choopy.dto.TaskResponse;
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
    ResponseEntity<HouseholdResponse> createHousehold(@RequestBody HouseholdRequest household, Authentication authentication) {
        String username = authentication.getName();
        return ResponseEntity.ok(householdService.createHousehold(household, username));
    }

    @GetMapping("/{id}/tasks")
    ResponseEntity<List<TaskResponse>> getHouseholdTasks(@PathVariable Long id, Authentication authentication) {
        String userName = authentication.getName();
        return ResponseEntity.ok(householdService.getTasksForHousehold(id, userName));
    }

    @PostMapping("/join")
    public ResponseEntity<HouseholdMembershipResponse> joinHousehold(@RequestBody Map<String, String> requestBody,
            Authentication authentication
    ) {
        String username = authentication.getName();
        String inviteCode = requestBody.get("inviteCode");
        return ResponseEntity.ok(membershipService.joinWithCode(inviteCode, username));
    }
}
