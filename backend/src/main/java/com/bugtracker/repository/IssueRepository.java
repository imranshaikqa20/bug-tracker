package com.bugtracker.repository;

import com.bugtracker.entity.Issue;
import com.bugtracker.entity.IssueStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IssueRepository extends JpaRepository<Issue, Long> {

    List<Issue> findByProject_Id(Long projectId);

    // 🔥 Required for Kanban
    List<Issue> findByProject_IdAndStatus(Long projectId, IssueStatus status);
}
