package com.hrm.hrm.team.repository;

import com.hrm.hrm.entity.ProjectTeam;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface ProjectTeamRepository extends JpaRepository<ProjectTeam, UUID> {
    List<ProjectTeam> findByTeamId(UUID teamId);
} 
