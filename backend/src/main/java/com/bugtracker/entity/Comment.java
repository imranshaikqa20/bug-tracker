package com.bugtracker.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
public class Comment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 2000, nullable = false)
    private String content;

    @ManyToOne(optional = false)
    private Issue issue;

    @ManyToOne(optional = false)
    private User user;

    private LocalDateTime createdAt = LocalDateTime.now();
}