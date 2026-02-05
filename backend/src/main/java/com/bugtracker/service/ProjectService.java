package com.bugtracker.service;

import com.bugtracker.dto.MyProjectResponse;
import com.bugtracker.entity.Project;
import com.bugtracker.entity.ProjectMember;

import java.util.List;

public interface ProjectService {

    // ✅ Create new project
    Project create(Project project);

    // 🔍 Find project by id
    Project findById(Long projectId);

    // 📊 Dashboard: projects where user is a member
    List<MyProjectResponse> getMyProjects(Long userId);

    // 👥 KANBAN: project members
    List<ProjectMember> getProjectMembers(Long projectId);

    //delete project
    void deleteProject(Long projectId, Long userId);
}