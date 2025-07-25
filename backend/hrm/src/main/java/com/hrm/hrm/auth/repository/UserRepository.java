package com.hrm.hrm.auth.repository;

import com.hrm.hrm.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, java.util.UUID> {
    boolean existsByEmail(String email);
    java.util.Optional<User> findByEmail(String email);
} 
