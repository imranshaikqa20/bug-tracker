package com.bugtracker.service;

import com.bugtracker.dto.UpdateIssueRequest;
import com.bugtracker.entity.Issue;
import com.bugtracker.entity.IssueStatus;
import com.bugtracker.entity.ProjectRole;
import com.bugtracker.entity.User;
import com.bugtracker.repository.IssueRepository;
import com.bugtracker.repository.ProjectMemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.EnumMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Transactional   // ✅ IMPORTANT: ensures delete/update run in transaction
public class IssueServiceImpl implements IssueService {

    private final IssueRepository issueRepository;
    private final UserService userService;
    private final ProjectMemberRepository projectMemberRepository;

    // ===============================
    // ➕ CREATE ISSUE
    // ===============================
    @Override
    public Issue create(Issue issue) {
        return issueRepository.save(issue);
    }

    // ===============================
    // 📋 GET PROJECT ISSUES
    // ===============================
    @Override
    public List<Issue> getProjectIssues(Long projectId) {
        return issueRepository.findByProject_Id(projectId);
    }

    // ===============================
    // 🔄 UPDATE STATUS (KANBAN)
    // ===============================
    @Override
    public Issue updateStatus(Long issueId, IssueStatus status) {

        Issue issue = issueRepository.findById(issueId)
                .orElseThrow(() ->
                        new RuntimeException("Issue not found with id: " + issueId));

        issue.setStatus(status);
        return issueRepository.save(issue);
    }

    // ===============================
    // 📊 KANBAN BOARD
    // ===============================
    @Override
    public Map<IssueStatus, List<Issue>> getKanbanIssues(Long projectId) {

        Map<IssueStatus, List<Issue>> board =
                new EnumMap<>(IssueStatus.class);

        for (IssueStatus status : IssueStatus.values()) {
            board.put(
                    status,
                    issueRepository.findByProject_IdAndStatus(projectId, status)
            );
        }
        return board;
    }

    // ===============================
    // 🔍 FIND ISSUE
    // ===============================
    @Override
    public Issue findById(Long id) {
        return issueRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Issue not found with id: " + id));
    }

    // ===============================
    // 👤 ASSIGN / UNASSIGN ISSUE
    // ===============================
    @Override
    public Issue assignIssue(Long issueId, String assigneeEmail) {

        Issue issue = issueRepository.findById(issueId)
                .orElseThrow(() ->
                        new RuntimeException("Issue not found with id: " + issueId));

        if (assigneeEmail == null || assigneeEmail.isBlank()) {
            issue.setAssignee(null);
        } else {
            User user = userService.findOptionalByEmail(assigneeEmail)
                    .orElseThrow(() ->
                            new RuntimeException("User not found with email: " + assigneeEmail));
            issue.setAssignee(user);
        }

        return issueRepository.save(issue);
    }

    // ===============================
    // ✏️ EDIT ISSUE (AUTH: OWNER / ASSIGNEE)
    // ===============================
    @Override
    public Issue updateIssue(
            Long issueId,
            UpdateIssueRequest request,
            String email) {

        Issue issue = issueRepository.findById(issueId)
                .orElseThrow(() -> new RuntimeException("Issue not found"));

        Long projectId = issue.getProject().getId();

        boolean isOwner =
                projectMemberRepository.existsByProjectIdAndUserEmailAndRole(
                        projectId,
                        email,
                        ProjectRole.OWNER
                );

        boolean isAssignee =
                issue.getAssignee() != null &&
                        issue.getAssignee().getEmail().equals(email);

        if (!isOwner && !isAssignee) {
            throw new RuntimeException("Not authorized to edit issue");
        }

        issue.setTitle(request.getTitle());
        issue.setDescription(request.getDescription());
        issue.setPriority(request.getPriority());

        return issueRepository.save(issue);
    }

    // ===============================
    // 🗑️ DELETE ISSUE (AUTH: OWNER ONLY)
    // ===============================
    @Override
    public void deleteIssue(Long issueId, String email) {

        Issue issue = issueRepository.findById(issueId)
                .orElseThrow(() -> new RuntimeException("Issue not found"));

        Long projectId = issue.getProject().getId();

        boolean isOwner =
                projectMemberRepository.existsByProjectIdAndUserEmailAndRole(
                        projectId,
                        email,
                        ProjectRole.OWNER
                );

        if (!isOwner) {
            throw new RuntimeException("Only project OWNER can delete issues");
        }

        issueRepository.delete(issue); // ✅ now runs inside transaction
    }
}