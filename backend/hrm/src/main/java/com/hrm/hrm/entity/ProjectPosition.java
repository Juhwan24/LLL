package com.hrm.hrm.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.util.UUID;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.AccessLevel;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
@Table(name = "project_position")
public class ProjectPosition {
    @Id
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "project_id")
    private Project project;

    @Column(nullable = false)
    private String name;

    private String description;

    @Column(name = "ideal_traits")
    private String idealTraits;
} 