package com.bugtracker.service;

import com.bugtracker.dto.UpdateIssueRequest;
import com.bugtracker.entity.Issue;
import com.bugtracker.entity.IssueStatus;

import java.util.List;
import java.util.Map;

public interface IssueService {

    // ===============================
    // ➕ CREATE ISSUE
    // ===============================
    Issue create(Issue issue);

    // ===============================
    // 📋 GET ISSUES
    // ===============================
    List<Issue> getProjectIssues(Long projectId);

    Issue findById(Long id);

    // ===============================
    // 🔄 KANBAN
    // ===============================
    Issue updateStatus(Long issueId, IssueStatus status);

    Map<IssueStatus, List<Issue>> getKanbanIssues(Long projectId);

    // ===============================
    // 👤 ASSIGN / UNASSIGN
    // ===============================
    Issue assignIssue(Long issueId, String assigneeEmail);

    // ===============================
    // ✏️ EDIT ISSUE (AUTH: OWNER / ASSIGNEE)
    // ===============================
    Issue updateIssue(
            Long issueId,
            UpdateIssueRequest request,
            String email
    );

    // ===============================
    // 🗑️ DELETE ISSUE (AUTH: OWNER)
    // ===============================
    void deleteIssue(Long issueId, String email);
}