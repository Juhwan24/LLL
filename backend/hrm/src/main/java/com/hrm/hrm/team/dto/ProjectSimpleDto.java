package com.hrm.hrm.team.dto;

import lombok.Builder;
import lombok.Value;
import java.util.UUID;

/**
 * 프로젝트 간단 정보를 전달하는 DTO
 */
@Value
@Builder
public class ProjectSimpleDto {
    /** 프로젝트 고유 ID */
    UUID id;
    /** 프로젝트 이름 */
    String name;
} 