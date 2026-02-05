package com.bugtracker.dto;

import com.bugtracker.entity.Issue;
import com.bugtracker.entity.User;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class IssueResponse {

    private Long id;
    private String title;
    private String description;
    private String status;
    private String priority;

    // 🔥 Assignee details (frontend expects this)
    private AssigneeDto assignee;

    public IssueResponse(Issue issue) {
        this.id = issue.getId();
        this.title = issue.getTitle();
        this.description = issue.getDescription();
        this.status = issue.getStatus() != null ? issue.getStatus().name() : null;
        this.priority = issue.getPriority() != null ? issue.getPriority().name() : null;

        User user = issue.getAssignee();
        if (user != null) {
            this.assignee = new AssigneeDto(user.getName(), user.getEmail());
        } else {
            this.assignee = null; // ✅ important
        }
    }

    // 🔹 Nested DTO (clean & safe)
    @Getter
    @Setter
    @NoArgsConstructor
    public static class AssigneeDto {
        private String name;
        private String email;

        public AssigneeDto(String name, String email) {
            this.name = name;
            this.email = email;
        }
    }
}