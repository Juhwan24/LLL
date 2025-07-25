package com.hrm.hrm.team.controller;

import com.hrm.hrm.team.dto.*;
import com.hrm.hrm.team.service.TeamService;
import com.hrm.hrm.common.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@Tag(name = "Team", description = "팀 관련 API")
@RestController
@RequestMapping("/api/team")
@RequiredArgsConstructor
public class TeamController {

    private final TeamService teamService;

    @Operation(summary = "전체 팀 목록 조회")
    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ApiResponse<List<TeamDto>> getAllTeams() {
        try {
            return ApiResponse.ok(teamService.getAllTeams());
        } catch (Exception e) {
            return ApiResponse.fail(e.getMessage());
        }
    }

    @Operation(summary = "팀별 멤버 목록 조회")
    @GetMapping("/{teamId}/members")
    @PreAuthorize("isAuthenticated()")
    public ApiResponse<List<UserDto>> getMembersByTeam(@PathVariable UUID teamId) {
        try {
            return ApiResponse.ok(teamService.getMembersByTeam(teamId));
        } catch (Exception e) {
            return ApiResponse.fail(e.getMessage());
        }
    }

    @Operation(summary = "팀별 프로젝트 목록 조회")
    @GetMapping("/{teamId}/projects")
    @PreAuthorize("isAuthenticated()")
    public ApiResponse<List<ProjectSimpleDto>> getProjectsByTeam(@PathVariable UUID teamId) {
        try {
            return ApiResponse.ok(teamService.getProjectsByTeam(teamId));
        } catch (Exception e) {
            return ApiResponse.fail(e.getMessage());
        }
    }
} 