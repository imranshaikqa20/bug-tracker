package com.bugtracker.controller;

import com.bugtracker.dto.CreateIssueRequest;
import com.bugtracker.dto.UpdateIssueRequest;
import com.bugtracker.dto.IssueResponse;
import com.bugtracker.entity.Issue;
import com.bugtracker.entity.IssueStatus;
import com.bugtracker.entity.Project;
import com.bugtracker.entity.User;
import com.bugtracker.service.IssueService;
import com.bugtracker.service.ProjectService;
import com.bugtracker.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/issues")
@RequiredArgsConstructor
@CrossOrigin
public class IssueController {

    private final IssueService issueService;
    private final ProjectService projectService;
    private final UserService userService;

    // ===============================
    // ✅ CREATE ISSUE (INSIDE PROJECT)
    // ===============================
    @PostMapping
    public IssueResponse createIssue(
            @Valid @RequestBody CreateIssueRequest request,
            Authentication authentication) {

        Project project = projectService.findById(request.getProjectId());

        Issue issue = new Issue();
        issue.setTitle(request.getTitle());
        issue.setDescription(request.getDescription());
        issue.setPriority(request.getPriority());
        issue.setStatus(IssueStatus.TODO);
        issue.setProject(project);

        // Optional assignee during creation
        if (request.getAssignedToUserId() != null) {
            User user = userService.findById(request.getAssignedToUserId())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            issue.setAssignee(user);
        }

        return new IssueResponse(issueService.create(issue));
    }

    // ===============================
    // 📋 GET ALL ISSUES OF A PROJECT
    // ===============================
    @GetMapping("/project/{projectId}")
    public List<IssueResponse> getProjectIssues(
            @PathVariable Long projectId) {

        return issueService.getProjectIssues(projectId)
                .stream()
                .map(IssueResponse::new)
                .collect(Collectors.toList());
    }

    // ===============================
    // 🔄 UPDATE ISSUE STATUS (KANBAN)
    // ===============================
    @PatchMapping("/{issueId}/status")
    public IssueResponse updateStatus(
            @PathVariable Long issueId,
            @RequestParam IssueStatus status) {

        return new IssueResponse(
                issueService.updateStatus(issueId, status)
        );
    }

    // ===============================
    // 📊 KANBAN BOARD (STATUS → ISSUES)
    // ===============================
    @GetMapping("/kanban/project/{projectId}")
    public Map<IssueStatus, List<IssueResponse>> getKanbanBoard(
            @PathVariable Long projectId) {

        return issueService.getKanbanIssues(projectId)
                .entrySet()
                .stream()
                .collect(Collectors.toMap(
                        Map.Entry::getKey,
                        e -> e.getValue()
                                .stream()
                                .map(IssueResponse::new)
                                .collect(Collectors.toList())
                ));
    }

    // ===============================
    // 👤 ASSIGN / UNASSIGN ISSUE
    // ===============================
    @PatchMapping("/{issueId}/assignee")
    public IssueResponse updateAssignee(
            @PathVariable Long issueId,
            @RequestParam(required = false) String assigneeEmail) {

        return new IssueResponse(
                issueService.assignIssue(issueId, assigneeEmail)
        );
    }

    // ===============================
    // ✏️ EDIT ISSUE (AUTH: OWNER / ASSIGNEE)
    // ===============================
    @PutMapping("/{issueId}")
    public IssueResponse updateIssue(
            @PathVariable Long issueId,
            @Valid @RequestBody UpdateIssueRequest request,
            Authentication authentication) {

        return new IssueResponse(
                issueService.updateIssue(
                        issueId,
                        request,
                        authentication.getName()
                )
        );
    }

    // ===============================
    // 🗑️ DELETE ISSUE (AUTH: OWNER)
    // ===============================
    @DeleteMapping("/{issueId}")
    public void deleteIssue(
            @PathVariable Long issueId,
            Authentication authentication) {

        issueService.deleteIssue(issueId, authentication.getName());
    }
}