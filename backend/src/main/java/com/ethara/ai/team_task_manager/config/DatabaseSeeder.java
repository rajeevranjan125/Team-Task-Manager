package com.ethara.ai.team_task_manager.config;

import com.ethara.ai.team_task_manager.model.Project;
import com.ethara.ai.team_task_manager.model.Role;
import com.ethara.ai.team_task_manager.model.Task;
import com.ethara.ai.team_task_manager.model.TaskStatus;
import com.ethara.ai.team_task_manager.model.User;
import com.ethara.ai.team_task_manager.repository.ProjectRepository;
import com.ethara.ai.team_task_manager.repository.TaskRepository;
import com.ethara.ai.team_task_manager.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
@RequiredArgsConstructor
public class DatabaseSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;
    private final TaskRepository taskRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // No dummy data generation. Users must register themselves.
    }
}
