package com.ethara.ai.team_task_manager.dto;
import lombok.Data;
@Data public class ProjectDto { 
    private String name; 
    private String description; 
    private Long assignedToId;
    private String status;
}
