package com.lll.repository;

import com.lll.entity.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {
    
    Page<Post> findAllByOrderByCreatedAtDesc(Pageable pageable);
    
    Page<Post> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);
} 