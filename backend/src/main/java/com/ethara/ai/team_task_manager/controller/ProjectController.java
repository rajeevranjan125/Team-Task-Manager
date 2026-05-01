package com.ethara.ai.team_task_manager.controller;

import com.ethara.ai.team_task_manager.dto.ProjectDto;
import com.ethara.ai.team_task_manager.model.Project;
import com.ethara.ai.team_task_manager.model.User;
import com.ethara.ai.team_task_manager.repository.ProjectRepository;
import com.ethara.ai.team_task_manager.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<Project>> getAllProjects(Authentication authentication) {
        User user = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (user.getRole() == com.ethara.ai.team_task_manager.model.Role.ADMIN) {
            return ResponseEntity.ok(projectRepository.findAll());
        }
        return ResponseEntity.ok(projectRepository.findByOwnerIdOrAssignedToId(user.getId(), user.getId()));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('PROJECT_MANAGER') or hasRole('TEAM_LEAD')")
    public ResponseEntity<Project> createProject(@RequestBody ProjectDto dto, Authentication authentication) {
        User owner = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        User assignedTo = null;
        if (dto.getAssignedToId() != null) {
            assignedTo = userRepository.findById(dto.getAssignedToId()).orElse(null);
        }

        Project project = new Project();
        project.setName(dto.getName());
        project.setDescription(dto.getDescription() != null ? dto.getDescription() : "");
        project.setOwner(owner);
        project.setAssignedTo(assignedTo);
        project.setStatus(com.ethara.ai.team_task_manager.model.ProjectStatus.PENDING);

        return ResponseEntity.ok(projectRepository.save(project));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Project> updateProjectStatus(@PathVariable Long id, @RequestBody ProjectDto dto) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found"));
        try {
            project.setStatus(com.ethara.ai.team_task_manager.model.ProjectStatus.valueOf(dto.getStatus().toUpperCase()));
        } catch (Exception e) {}
        return ResponseEntity.ok(projectRepository.save(project));
    }
}
