package edu.akshay.util;

import edu.akshay.dto.AiTaskDTO;
import io.quarkus.runtime.annotations.RegisterForReflection;

import java.util.List;

@RegisterForReflection
public class TaskListWrapper {
    public List<AiTaskDTO> tasks;

    public TaskListWrapper() {}
}
