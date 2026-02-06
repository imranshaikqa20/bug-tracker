package com.bugtracker.controller;

import com.bugtracker.dto.MyProjectResponse;
import com.bugtracker.dto.ProjectMemberResponse;
import com.bugtracker.dto.ProjectRequest;
import com.bugtracker.entity.Project;
import com.bugtracker.entity.User;
import com.bugtracker.service.ProjectMemberService;
import com.bugtracker.service.ProjectService;
import com.bugtracker.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
@CrossOrigin
public class ProjectController {

    private final ProjectService projectService;
    private final ProjectMemberService projectMemberService;
    private final UserService userService;

    // ===============================
    // ✅ CREATE PROJECT (OWNER AUTO)
    // ===============================
    @PostMapping
    public Project createProject(
            @RequestBody ProjectRequest request,
            Authentication authentication
    ) {
        // 🔐 logged-in user
        User user = userService.findByEmail(authentication.getName());

        // 📦 build project only (NO members here)
        Project project = new Project();
        project.setName(request.getName());
        project.setDescription(request.getDescription());
        project.setCreatedBy(user);

        // ✅ OWNER assignment happens in SERVICE
        return projectService.create(project, user.getId());
    }

    // ===============================
    // 📊 DASHBOARD – MY PROJECTS
    // ===============================
    @GetMapping("/my-projects")
    public List<MyProjectResponse> getMyProjects(
            Authentication authentication
    ) {
        User user = userService.findByEmail(authentication.getName());
        return projectService.getMyProjects(user.getId());
    }

    // ===============================
    // 👥 KANBAN – PROJECT MEMBERS
    // ===============================
    @GetMapping("/{projectId}/members")
    public List<ProjectMemberResponse> getProjectMembers(
            @PathVariable Long projectId
    ) {
        return projectMemberService.getProjectMembers(projectId);
    }

    // ===============================
    // ❌ DELETE PROJECT (OWNER ONLY)
    // ===============================
    @DeleteMapping("/{projectId}")
    public ResponseEntity<Void> deleteProject(
            @PathVariable Long projectId,
            Authentication authentication
    ) {
        User user = userService.findByEmail(authentication.getName());

        projectService.deleteProject(projectId, user.getId());

        return ResponseEntity.noContent().build();
    }
}
