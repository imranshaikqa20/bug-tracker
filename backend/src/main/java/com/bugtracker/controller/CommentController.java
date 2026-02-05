package com.bugtracker.controller;

import com.bugtracker.dto.CommentResponse;
import com.bugtracker.dto.CreateCommentRequest;
import com.bugtracker.service.CommentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/issues/{issueId}/comments")
@RequiredArgsConstructor
@CrossOrigin
public class CommentController {

    private final CommentService commentService;

    @PostMapping
    public CommentResponse addComment(
            @PathVariable Long issueId,
            @Valid @RequestBody CreateCommentRequest request,
            Authentication authentication) {

        return commentService.addComment(
                issueId,
                request.getContent(),
                authentication.getName()
        );
    }

    @GetMapping
    public List<CommentResponse> getComments(
            @PathVariable Long issueId) {

        return commentService.getComments(issueId);
    }
}