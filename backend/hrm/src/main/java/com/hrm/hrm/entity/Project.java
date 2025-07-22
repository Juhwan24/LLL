package com.hrm.hrm.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "project")
public class Project {
    @Id
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "leader_id")
    private User leader;

    @Column(nullable = false)
    private String name;

    private String description;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @OneToMany(mappedBy = "project")
    private List<ProjectTeam> projectTeams;

    @OneToMany(mappedBy = "project")
    private List<ProjectPosition> projectPositions;
} 