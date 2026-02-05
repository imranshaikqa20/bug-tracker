package com.bugtracker.service;

import com.bugtracker.dto.ProjectMemberResponse;
import com.bugtracker.entity.Project;
import com.bugtracker.entity.ProjectMember;
import com.bugtracker.entity.ProjectRole;
import com.bugtracker.entity.User;
import com.bugtracker.repository.ProjectMemberRepository;
import com.bugtracker.repository.ProjectRepository;
import com.bugtracker.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProjectMemberServiceImpl implements ProjectMemberService {

    private final ProjectMemberRepository projectMemberRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    // ===============================
    // ➕ ADD MEMBER TO PROJECT
    // ===============================
    @Override
    public ProjectMember addMember(Long projectId, Long userId, ProjectRole role) {

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 🔒 FIX: Prevent duplicates (UPDATED METHOD NAME)
        if (projectMemberRepository.existsByProjectIdAndUserId(projectId, userId)) {
            throw new RuntimeException("User already added to project");
        }

        ProjectMember member = new ProjectMember();
        member.setProject(project);
        member.setUser(user);
        member.setRole(role != null ? role : ProjectRole.DEVELOPER);

        return projectMemberRepository.save(member);
    }

    // ===============================
    // ➖ REMOVE MEMBER FROM PROJECT
    // ===============================
    @Override
    public void removeMember(Long projectId, Long userId) {
        // 🔒 FIX: UPDATED METHOD NAME
        projectMemberRepository.deleteByProjectIdAndUserId(projectId, userId);
    }

    // ===============================
    // 👥 GET PROJECT MEMBERS (DTO)
    // ===============================
    @Override
    public List<ProjectMemberResponse> getProjectMembers(Long projectId) {

        return projectMemberRepository
                .findMembersWithUser(projectId)   // 🔥 FETCH JOIN
                .stream()
                .map(ProjectMemberResponse::new)  // DTO constructor
                .toList();
    }

    // ===============================
    // 🔒 CHECK PROJECT MEMBERSHIP
    // ===============================
    @Override
    public boolean isMember(Long projectId, Long userId) {
        // 🔒 FIX: UPDATED METHOD NAME
        return projectMemberRepository.existsByProjectIdAndUserId(projectId, userId);
    }
}