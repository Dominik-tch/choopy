    package com.taschion.choopy.controller;

    import com.taschion.choopy.dto.*;
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
        public ResponseEntity<HouseholdResponse> createHousehold(@RequestBody HouseholdRequest household, Authentication authentication) {
            String username = authentication.getName();
            return ResponseEntity.ok(householdService.createHousehold(household, username));
        }

        @GetMapping()
        public ResponseEntity<List<HouseholdResponse>> getHouseholds(Authentication authentication) {
            String username = authentication.getName();
            return ResponseEntity.ok(householdService.getHouseholds(username));
        }

        @GetMapping("{id}/preferences")
        public ResponseEntity<PreferenceResponse> getPreferences(@PathVariable Long id, Authentication authentication) {
            String username = authentication.getName();
            return ResponseEntity.ok(membershipService.getPreferences(username, id));
        }

        @PatchMapping("{id}/preferences")
        public ResponseEntity<PreferenceResponse> updatePreferences(@RequestBody PreferenceRequest preferences, @PathVariable Long id, Authentication authentication) {
            String username = authentication.getName();
            return ResponseEntity.ok(membershipService.updatePreferences(username, id, preferences));
        }

        @GetMapping("/details")
        public ResponseEntity<List<HouseholdDetailResponse>> getHouseholdDetails(Authentication authentication) {
            String username = authentication.getName();
            return ResponseEntity.ok(householdService.getHouseholdDetails(username));
        }

        @GetMapping("/{id}/tasks")
        public ResponseEntity<List<TaskResponse>> getHouseholdTasks(
                @PathVariable Long id,
                @RequestParam(required = false) String status,
                @RequestParam(required = false) Long completedByUserId,
                Authentication authentication
        ) {
            String username = authentication.getName();
            return ResponseEntity.ok(householdService.getTasksForHousehold(id, username, status, completedByUserId));
        }

        @GetMapping("/{id}/members")
        public ResponseEntity<List<MemberResponse>> getHouseholdMembers(@PathVariable Long id) {
            return ResponseEntity.ok(membershipService.getHouseholdMembers(id));
        }

        @GetMapping("/{id}/role")
        public ResponseEntity<MemberRoleResponse> getMemberRole(@PathVariable Long id, Authentication authentication) {
            String username = authentication.getName();
            return ResponseEntity.ok(membershipService.getMemberRole(id, username));
        }

        @PostMapping("/join")
        public ResponseEntity<HouseholdMembershipResponse> joinHousehold(@RequestBody Map<String, String> requestBody,
                Authentication authentication
        ) {
            String username = authentication.getName();
            String inviteCode = requestBody.get("inviteCode");
            return ResponseEntity.ok(membershipService.joinWithCode(inviteCode, username));
        }

        @GetMapping("/{id}/tasks/suggestions")
        public ResponseEntity<List<TaskResponse>> getTaskSuggestions(@PathVariable Long id, Authentication authentication
        ) {
            String username = authentication.getName();
            return ResponseEntity.ok(householdService.getRecentTaskSuggestions(id, username));
        }
    }
