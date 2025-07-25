package com.hrm.hrm.team.dto;

import lombok.Builder;
import lombok.Singular;
import lombok.Value;
import java.util.List;
import java.util.UUID;

/**
 * 프로젝트 상세 정보를 전달하는 DTO
 */
@Value
@Builder
public class ProjectDetailDto {
    /** 프로젝트 고유 ID */
    UUID id;
    /** 프로젝트 이름 */
    String name;
    /** 프로젝트 설명 */
    String description;
    /** 참여 멤버 목록 */
    @Singular
    List<UserDto> members;
} 