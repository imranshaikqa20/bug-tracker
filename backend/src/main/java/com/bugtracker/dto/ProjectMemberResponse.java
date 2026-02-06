package com.bugtracker.dto;

import com.bugtracker.entity.ProjectMember;
import com.bugtracker.entity.ProjectRole;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ProjectMemberResponse {

    private Long userId;
    private String name;
    private String email;
    private ProjectRole role; // 🔥 must be 'role'

    public ProjectMemberResponse(ProjectMember member) {
        this.userId = member.getUser().getId();
        this.name = member.getUser().getName();
        this.email = member.getUser().getEmail();
        this.role = member.getRole();
    }
}
