package com.ethara.ai.team_task_manager;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class TeamTaskManagerApplication {

	public static void main(String[] args) {
		var ctx = SpringApplication.run(TeamTaskManagerApplication.class, args);
		String dbUrl = ctx.getEnvironment().getProperty("PROD_DB_URL");
		System.out.println("---------------------------------------------------------");
		System.out.println("DEBUG: PROD_DB_URL is: " + dbUrl);
		System.out.println("---------------------------------------------------------");
	}

}
