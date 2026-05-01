package com.ethara.ai.team_task_manager.dto;
import lombok.Data;
import lombok.AllArgsConstructor;
@Data @AllArgsConstructor public class AuthResponse { private String token; private String role; private Long id; }
