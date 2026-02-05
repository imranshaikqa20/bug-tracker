package com.bugtracker.service;

import com.bugtracker.dto.CommentResponse;

import java.util.List;

public interface CommentService {

    CommentResponse addComment(Long issueId, String content, String email);

    List<CommentResponse> getComments(Long issueId);
}