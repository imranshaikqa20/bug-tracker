package com.bugtracker.dto;

import com.bugtracker.entity.ProjectRole;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AddProjectMemberRequest {

    private Long projectId;   // 🔥 REQUIRED (FIX)
    private Long userId;
    private ProjectRole role;
}
