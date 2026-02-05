package com.bugtracker.service;

import com.bugtracker.entity.User;
import com.bugtracker.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Override
    public User save(User user) {
        return userRepository.save(user);
    }

    @Override
    public Optional<User> findOptionalByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    @Override
    public User findByEmail(String email) {
        return userRepository.findByEmail(email).orElse(null);
    }

    @Override
    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }

    // 🔥 Used for issue assignment
    @Override
    public Optional<User> findByEmailOptional(String email) {
        return userRepository.findByEmail(email);
    }
}
