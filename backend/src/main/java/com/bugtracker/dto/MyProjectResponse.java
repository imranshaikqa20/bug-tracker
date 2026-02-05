package com.bugtracker.dto;

import com.bugtracker.entity.ProjectRole;

public class MyProjectResponse {

    private Long id;
    private String name;
    private String description;
    private ProjectRole role; // ✅ ENUM

    // 🔥 REQUIRED by JPQL constructor expression
    public MyProjectResponse(
            Long id,
            String name,
            String description,
            ProjectRole role
    ) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.role = role;
    }

    // ===============================
    // GETTERS
    // ===============================
    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public ProjectRole getRole() {
        return role;
    }
}