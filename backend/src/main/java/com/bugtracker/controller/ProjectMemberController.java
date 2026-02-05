package com.bugtracker.controller;

import com.bugtracker.dto.AddProjectMemberRequest;
import com.bugtracker.entity.ProjectMember;
import com.bugtracker.service.ProjectMemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/project-members")
@RequiredArgsConstructor
@CrossOrigin
public class ProjectMemberController {

    private final ProjectMemberService projectMemberService;

    // ➕ Add member to project (JSON BODY)
    @PostMapping
    public ProjectMember addMember(@RequestBody AddProjectMemberRequest request) {

        return projectMemberService.addMember(
                request.getProjectId(),
                request.getUserId(),
                request.getRole()
        );
    }

    // ➖ Remove member from project
    @DeleteMapping
    public void removeMember(
            @RequestParam Long projectId,
            @RequestParam Long userId) {

        projectMemberService.removeMember(projectId, userId);
    }
}
