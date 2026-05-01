package com.ethara.ai.team_task_manager.repository;
import com.ethara.ai.team_task_manager.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByProjectId(Long projectId);
    List<Task> findByAssignedToId(Long userId);
    
    @org.springframework.data.jpa.repository.Query("SELECT t FROM Task t WHERE t.assignedTo.id = :userId OR t.project.owner.id = :userId OR t.project.assignedTo.id = :userId")
    List<Task> findTasksForUser(@org.springframework.data.repository.query.Param("userId") Long userId);
}
