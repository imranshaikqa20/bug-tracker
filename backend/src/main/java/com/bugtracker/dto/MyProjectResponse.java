package com.bugtracker.dto;

import com.bugtracker.entity.ProjectRole;

public class MyProjectResponse {

    private Long id;
    private String name;
    private String description;
    private ProjectRole myRole; // ✅ clearer meaning

    // 🔥 REQUIRED by JPQL constructor expression
    public MyProjectResponse(
            Long id,
            String name,
            String description,
            ProjectRole myRole
    ) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.myRole = myRole;
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

    public ProjectRole getMyRole() {
        return myRole;
    }
}
