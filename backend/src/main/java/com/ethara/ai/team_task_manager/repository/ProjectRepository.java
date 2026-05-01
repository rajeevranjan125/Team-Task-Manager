package com.ethara.ai.team_task_manager.repository;
import com.ethara.ai.team_task_manager.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProjectRepository extends JpaRepository<Project, Long> {
    List<Project> findByOwnerIdOrAssignedToId(Long ownerId, Long assignedToId);
}
