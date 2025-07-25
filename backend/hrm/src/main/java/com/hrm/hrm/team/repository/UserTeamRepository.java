package com.hrm.hrm.team.repository;

import com.hrm.hrm.entity.UserTeam;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface UserTeamRepository extends JpaRepository<UserTeam, UUID> {
    List<UserTeam> findByTeamId(UUID teamId);
} 
