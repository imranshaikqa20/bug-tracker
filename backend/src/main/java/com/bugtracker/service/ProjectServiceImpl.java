package com.bugtracker.service;

import com.bugtracker.dto.MyProjectResponse;
import com.bugtracker.entity.Project;
import com.bugtracker.entity.ProjectMember;
import com.bugtracker.entity.ProjectRole;
import com.bugtracker.repository.ProjectMemberRepository;
import com.bugtracker.repository.ProjectRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProjectServiceImpl implements ProjectService {

    private final ProjectRepository projectRepository;
    private final ProjectMemberRepository projectMemberRepository;

    // ===============================
    // ✅ CREATE PROJECT
    // ===============================
    @Override
    public Project create(Project project) {
        return projectRepository.save(project);
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
        // DTO-based custom query (FAST & SAFE)
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
    public void deleteProject(Long projectId, Long userId) {

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() ->
                        new EntityNotFoundException("Project not found with id: " + projectId));

        // 🔐 Check OWNER permission
        boolean isOwner = project.getProjectMembers().stream()
                .anyMatch(member ->
                        member.getUser().getId().equals(userId)
                                && member.getRole() == ProjectRole.OWNER
                );

        if (!isOwner) {
            throw new RuntimeException("Only project OWNER can delete this project");
        }

        // 🔥 Step 1: delete members
        projectMemberRepository.deleteByProjectId(projectId);

        // 🔥 Step 2: delete project
        projectRepository.delete(project);
    }
}