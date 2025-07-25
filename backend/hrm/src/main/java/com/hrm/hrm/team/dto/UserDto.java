package com.hrm.hrm.team.dto;

import lombok.Builder;
import lombok.Singular;
import lombok.Value;
import java.util.List;
import java.util.UUID;

@Value
@Builder
public class UserDto {
    /** 유저 고유 ID */
    UUID id;
    /** 유저 이름 */
    String userName;
    /** 이메일 */
    String email;
    /** 직책/역할 */
    String position;
    /** 진행 중인 프로젝트 목록 */
    @Singular
    List<ProjectSimpleDto> projects;
} 
