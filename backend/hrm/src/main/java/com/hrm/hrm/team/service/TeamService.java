package com.hrm.hrm.team.service;

import com.hrm.hrm.team.dto.TeamDto;
import com.hrm.hrm.team.dto.UserDto;
import com.hrm.hrm.team.dto.ProjectSimpleDto;

import java.util.List;
import java.util.UUID;

public interface TeamService {
    List<TeamDto> getAllTeams();
    List<UserDto> getMembersByTeam(UUID teamId);
    List<ProjectSimpleDto> getProjectsByTeam(UUID teamId);
} 