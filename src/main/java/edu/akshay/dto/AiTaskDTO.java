package edu.akshay.dto;

import io.quarkus.runtime.annotations.RegisterForReflection;

@RegisterForReflection
public class AiTaskDTO {
    public String title;
    public String description;
    public int priority;
    public String rawDueDate;

    // VERY IMPORTANT: The extension requires a no-args constructor
    public AiTaskDTO() {
    }
}
