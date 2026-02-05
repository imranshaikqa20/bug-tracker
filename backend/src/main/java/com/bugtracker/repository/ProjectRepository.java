package com.bugtracker.repository;

import com.bugtracker.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProjectRepository extends JpaRepository<Project, Long> {
    // ❌ Do NOT add member-related queries here
    // Project members are handled via ProjectMemberRepository
}
