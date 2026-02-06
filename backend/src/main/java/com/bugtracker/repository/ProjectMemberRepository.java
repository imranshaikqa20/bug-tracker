package com.bugtracker.repository;

import com.bugtracker.dto.MyProjectResponse;
import com.bugtracker.entity.ProjectMember;
import com.bugtracker.entity.ProjectRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

public interface ProjectMemberRepository
        extends JpaRepository<ProjectMember, Long> {

    // ===============================
    // 👥 PROJECT MEMBERS
    // ===============================

    // Get all members of a project
    List<ProjectMember> findByProjectId(Long projectId);

    // Find a specific member in a project
    Optional<ProjectMember> findByProjectIdAndUserId(
            Long projectId,
            Long userId
    );

    // Check if user already belongs to project
    boolean existsByProjectIdAndUserId(
            Long projectId,
            Long userId
    );

    // ===============================
    // 🔐 ROLE CHECKS (🔥 IMPORTANT)
    // ===============================

    // ✅ FIX: Used by ProjectServiceImpl (OWNER check)
    boolean existsByProjectIdAndUserIdAndRole(
            Long projectId,
            Long userId,
            ProjectRole role
    );

    // (Optional but useful: JWT/email-based checks)
    boolean existsByProjectIdAndUserEmailAndRole(
            Long projectId,
            String email,
            ProjectRole role
    );

    // ===============================
    // ❌ REMOVE MEMBER
    // ===============================
    @Modifying
    @Transactional
    void deleteByProjectIdAndUserId(
            Long projectId,
            Long userId
    );

    // ===============================
    // ❌ DELETE ALL MEMBERS (PROJECT DELETE)
    // ===============================
    @Modifying
    @Transactional
    void deleteByProjectId(Long projectId);

    // ===============================
    // 📊 DASHBOARD – MY PROJECTS
    // ===============================
    @Query("""
        SELECT new com.bugtracker.dto.MyProjectResponse(
            p.id,
            p.name,
            p.description,
            pm.role
        )
        FROM ProjectMember pm
        JOIN pm.project p
        WHERE pm.user.id = :userId
        ORDER BY p.name ASC
    """)
    List<MyProjectResponse> findMyProjects(
            @Param("userId") Long userId
    );

    // ===============================
    // 🔥 KANBAN – LOAD MEMBERS WITH USER
    // ===============================
    @Query("""
        SELECT pm
        FROM ProjectMember pm
        JOIN FETCH pm.user
        WHERE pm.project.id = :projectId
    """)
    List<ProjectMember> findMembersWithUser(
            @Param("projectId") Long projectId
    );
}
