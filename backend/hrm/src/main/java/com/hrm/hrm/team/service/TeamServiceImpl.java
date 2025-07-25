package com.hrm.hrm.team.service;

import com.hrm.hrm.entity.UserTeam;
import com.hrm.hrm.team.dto.TeamDto;
import com.hrm.hrm.team.dto.UserDto;
import com.hrm.hrm.team.dto.ProjectSimpleDto;
import com.hrm.hrm.entity.ProjectTeam;
import com.hrm.hrm.entity.Project;
import com.hrm.hrm.entity.User;
import com.hrm.hrm.team.repository.TeamRepository;
import com.hrm.hrm.team.repository.UserTeamRepository;
import com.hrm.hrm.team.repository.ProjectTeamRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TeamServiceImpl implements TeamService {

    private final TeamRepository teamRepository;
    private final UserTeamRepository userTeamRepository;
    private final ProjectTeamRepository projectTeamRepository;

    @Override
    public List<TeamDto> getAllTeams() {
        return teamRepository.findAll().stream()
                .map(team -> TeamDto.builder()
                        .id(team.getId())
                        .name(team.getName())
                        .description(team.getDescription())
                        .build())
                .collect(Collectors.toList());
    }

    @Override
    public List<UserDto> getMembersByTeam(UUID teamId) {
        List<UserTeam> userTeams = userTeamRepository.findByTeamId(teamId);
        return userTeams.stream()
                .map(userTeam -> {
                    User user = userTeam.getUser();
                    return UserDto.builder()
                            .id(user.getId())
                            .userName(user.getUserName())
                            .email(user.getEmail())
                            .position(null) // 필요시 추가
                            .build();
                })
                .collect(Collectors.toList());
    }

    @Override
    public List<ProjectSimpleDto> getProjectsByTeam(UUID teamId) {
        List<ProjectTeam> projectTeams = projectTeamRepository.findByTeamId(teamId);
        return projectTeams.stream()
                .map(pt -> {
                    Project p = pt.getProject();
                    return ProjectSimpleDto.builder()
                            .id(p.getId())
                            .name(p.getName())
                            .build();
                })
                .collect(Collectors.toList());
    }
} 
