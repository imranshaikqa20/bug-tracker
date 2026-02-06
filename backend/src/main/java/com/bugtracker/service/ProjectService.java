package com.bugtracker.service;

import com.bugtracker.dto.MyProjectResponse;
import com.bugtracker.entity.Project;
import com.bugtracker.entity.ProjectMember;

import java.util.List;

public interface ProjectService {

    // ✅ Create project (creator becomes OWNER)
    Project create(Project project, Long userId);

    // 🔍 Find project
    Project findById(Long projectId);

    // 📊 Dashboard projects
    List<MyProjectResponse> getMyProjects(Long userId);

    // 👥 Project members
    List<ProjectMember> getProjectMembers(Long projectId);

    // ❌ Delete project
    void deleteProject(Long projectId, Long userId);
}
