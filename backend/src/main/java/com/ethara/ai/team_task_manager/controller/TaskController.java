package com.ethara.ai.team_task_manager.controller;

import com.ethara.ai.team_task_manager.dto.TaskDto;
import com.ethara.ai.team_task_manager.model.Project;
import com.ethara.ai.team_task_manager.model.Task;
import com.ethara.ai.team_task_manager.model.TaskStatus;
import com.ethara.ai.team_task_manager.model.User;
import com.ethara.ai.team_task_manager.repository.ProjectRepository;
import com.ethara.ai.team_task_manager.repository.TaskRepository;
import com.ethara.ai.team_task_manager.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<Task>> getAllTasks(org.springframework.security.core.Authentication authentication) {
        User user = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (user.getRole() == com.ethara.ai.team_task_manager.model.Role.ADMIN) {
            return ResponseEntity.ok(taskRepository.findAll());
        }
        return ResponseEntity.ok(taskRepository.findTasksForUser(user.getId()));
    }

    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<Task>> getTasksByProject(@PathVariable Long projectId) {
        return ResponseEntity.ok(taskRepository.findByProjectId(projectId));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Task>> getTasksByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(taskRepository.findByAssignedToId(userId));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('PROJECT_MANAGER') or hasRole('TEAM_LEAD')")
    public ResponseEntity<Task> createTask(@RequestBody TaskDto dto) {
        Project project = projectRepository.findById(dto.getProjectId())
                .orElseThrow(() -> new RuntimeException("Project not found"));
        
        User assignedTo = null;
        if (dto.getAssignedToId() != null) {
            assignedTo = userRepository.findById(dto.getAssignedToId())
                    .orElse(null);
        }

        Task task = new Task();
        task.setTitle(dto.getTitle());
        task.setDescription(dto.getDescription());
        task.setDueDate(dto.getDueDate());
        task.setProject(project);
        task.setAssignedTo(assignedTo);
        task.setStatus(TaskStatus.PENDING);

        return ResponseEntity.ok(taskRepository.save(task));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Task> updateTaskStatus(@PathVariable Long id, @RequestBody TaskDto dto) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        
        try {
            task.setStatus(TaskStatus.valueOf(dto.getStatus().toUpperCase()));
        } catch (Exception e) {
            // Ignored, keep existing status
        }
        return ResponseEntity.ok(taskRepository.save(task));
    }
}
