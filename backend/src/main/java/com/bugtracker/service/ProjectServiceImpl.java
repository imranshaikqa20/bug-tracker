package com.bugtracker.service;

import com.bugtracker.dto.MyProjectResponse;
import com.bugtracker.entity.Project;
import com.bugtracker.entity.ProjectMember;
import com.bugtracker.entity.ProjectRole;
import com.bugtracker.entity.User;
import com.bugtracker.repository.ProjectMemberRepository;
import com.bugtracker.repository.ProjectRepository;
import com.bugtracker.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProjectServiceImpl implements ProjectService {

    private final ProjectRepository projectRepository;
    private final ProjectMemberRepository projectMemberRepository;
    private final UserRepository userRepository; // ✅ FIX

    // ===============================
    // ✅ CREATE PROJECT (OWNER ASSIGNED)
    // ===============================
    @Override
    @Transactional
    public Project create(Project project, Long userId) {

        // 1️⃣ Save project
        Project savedProject = projectRepository.save(project);

        // 2️⃣ Fetch creator
        User ownerUser = userRepository.findById(userId)
                .orElseThrow(() ->
                        new EntityNotFoundException("User not found with id: " + userId));

        // 3️⃣ Create OWNER membership
        ProjectMember owner = new ProjectMember();
        owner.setProject(savedProject);
        owner.setUser(ownerUser);
        owner.setRole(ProjectRole.OWNER);

        projectMemberRepository.save(owner);

        return savedProject;
    }

    // ===============================
    // 🔍 FIND PROJECT BY ID
    // ===============================
    @Override
    public Project findById(Long projectId) {
        return projectRepository.findById(projectId)
                .orElseThrow(() ->
                        new EntityNotFoundException("Project not found with id: " + projectId));
    }

    // ===============================
    // 📊 DASHBOARD – MY PROJECTS
    // ===============================
    @Override
    public List<MyProjectResponse> getMyProjects(Long userId) {
        return projectMemberRepository.findMyProjects(userId);
    }

    // ===============================
    // 👥 KANBAN – PROJECT MEMBERS
    // ===============================
    @Override
    public List<ProjectMember> getProjectMembers(Long projectId) {
        return projectMemberRepository.findMembersWithUser(projectId);
    }

    // ===============================
    // ❌ DELETE PROJECT (OWNER ONLY)
    // ===============================
    @Override
    @Transactional
    public void deleteProject(Long projectId, Long userId) {

        boolean isOwner = projectMemberRepository
                .existsByProjectIdAndUserIdAndRole(
                        projectId,
                        userId,
                        ProjectRole.OWNER
                );

        if (!isOwner) {
            throw new RuntimeException("Only project OWNER can delete this project");
        }

        // 🔥 delete members first
        projectMemberRepository.deleteByProjectId(projectId);

        // 🔥 delete project
        projectRepository.deleteById(projectId);
    }
}
