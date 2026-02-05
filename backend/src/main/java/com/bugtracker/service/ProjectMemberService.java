package com.bugtracker.service;

import com.bugtracker.dto.ProjectMemberResponse;
import com.bugtracker.entity.ProjectMember;
import com.bugtracker.entity.ProjectRole;

import java.util.List;

public interface ProjectMemberService {

    // ➕ Add user to project
    ProjectMember addMember(Long projectId, Long userId, ProjectRole role);

    // ➖ Remove user from project
    void removeMember(Long projectId, Long userId);

    // 👥 List members of a project (DTO-based)
    List<ProjectMemberResponse> getProjectMembers(Long projectId);

    // 🔒 Check membership (used later for security & assignment)
    boolean isMember(Long projectId, Long userId);
}
