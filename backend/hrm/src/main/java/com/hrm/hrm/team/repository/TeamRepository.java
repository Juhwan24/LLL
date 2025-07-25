package com.hrm.hrm.team.repository;

import com.hrm.hrm.entity.Team;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface TeamRepository extends JpaRepository<Team, UUID> {
} 
