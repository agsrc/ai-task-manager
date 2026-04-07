package edu.akshay.dto;

import edu.akshay.entity.Task;

import java.time.LocalDateTime;

// A Record automatically generates getters, equals, hashCode, and toString
public record TaskDTO(
        Long id,
        String title,
        String description,
        int priority,
        LocalDateTime dueDate,
        boolean completed
) {
    // Static factory method for easy mapping
    public static TaskDTO fromEntity(Task task) {
        return new TaskDTO(
                task.id, task.title, task.description,
                task.priority, task.dueDate, task.completed
        );
    }
}
