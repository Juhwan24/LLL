package com.hrm.hrm.team.dto;

import lombok.Builder;
import lombok.Value;
import java.util.UUID;

@Value
@Builder
public class TeamDto {
    UUID id;
    String name;
    String description;
} 
