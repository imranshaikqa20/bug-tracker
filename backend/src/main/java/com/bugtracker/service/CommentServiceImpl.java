package com.bugtracker.service;

import com.bugtracker.dto.CommentResponse;
import com.bugtracker.entity.Comment;
import com.bugtracker.entity.Issue;
import com.bugtracker.entity.User;
import com.bugtracker.repository.CommentRepository;
import com.bugtracker.repository.IssueRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CommentServiceImpl implements CommentService {

    private final CommentRepository commentRepository;
    private final IssueRepository issueRepository;
    private final UserService userService;

    @Override
    public CommentResponse addComment(
            Long issueId,
            String content,
            String email) {

        Issue issue = issueRepository.findById(issueId)
                .orElseThrow(() -> new RuntimeException("Issue not found"));

        User user = userService.findByEmail(email);

        Comment comment = new Comment();
        comment.setContent(content);
        comment.setIssue(issue);
        comment.setUser(user);

        return new CommentResponse(
                commentRepository.save(comment)
        );
    }

    @Override
    public List<CommentResponse> getComments(Long issueId) {
        return commentRepository
                .findByIssueIdOrderByCreatedAtAsc(issueId)
                .stream()
                .map(CommentResponse::new)
                .toList();
    }
}