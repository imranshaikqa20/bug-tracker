package com.bugtracker.service;

import com.bugtracker.entity.User;

import java.util.Optional;

public interface UserService {

    User save(User user);

    Optional<User> findOptionalByEmail(String email);

    User findByEmail(String email);

    Optional<User> findById(Long id);

    // 🔥 Use email for assignment
    Optional<User> findByEmailOptional(String email);
}
