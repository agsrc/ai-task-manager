package edu.akshay.service;

import edu.akshay.TaskRepository.TaskRepository;
import edu.akshay.dto.AiTaskDTO;
import edu.akshay.entity.Task;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.NotFoundException;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;

@ApplicationScoped
public class TaskService {

    private final TaskRepository repository;

    // Constructor Injection
    public TaskService(TaskRepository repository) {
        this.repository = repository;
    }

    public List<Task> getAllTasks() {
        return repository.listAll();
    }

    @Transactional
    public List<Task> saveAiGeneratedTasks(List<AiTaskDTO> dtos) {
        if (dtos == null || dtos.isEmpty()) {
            return Collections.emptyList();
        }
        return dtos.stream()
                .map(dto -> {
                    Task entity = new Task();
                    entity.title =(dto.title != null) ? dto.title : "New Task";
                    entity.description = dto.description;
                    entity.priority = dto.priority;

                    if (dto.rawDueDate != null) {
                        String dateInput = dto.rawDueDate.toLowerCase();
                        if (dateInput.contains("tomorrow")) {
                            entity.dueDate = LocalDateTime.now().plusDays(1);
                        } else if (dateInput.contains("today")) {
                            entity.dueDate = LocalDateTime.now();
                        } else if (dateInput.contains("next week")) {
                            entity.dueDate = LocalDateTime.now().plusWeeks(1);
                        }
                        else {
                            // AI found a date but our code doesn't recognize it yet
                            entity.dueDate = LocalDateTime.now().plusDays(1); // Default to tomorrow
                        }
                    }
                    else {
                        // AI found NO date at all
                        entity.dueDate = LocalDateTime.now().plusDays(1); // Global default
                    }

                    entity.completed = false; // Default for new tasks

                    repository.persist(entity);
                    return entity;
                })
                .toList();
    }

    @Transactional // Transaction boundary moved to the Service layer
    public Task createTask(Task task) {
        // Business logic (e.g., validations, sending events) would go here
        repository.persist(task);
        return task;
    }

    @Transactional
    public Task toggleStatus(Long id) {
        Task task = repository.findById(id);
        if (task == null) {
            throw new NotFoundException("Task not found with ID: " + id);
        }
        task.completed = !task.completed;
        return task; // Hibernate automatically flushes changes to the DB when the transaction closes
    }

    @Transactional
    public void deleteTask(Long id) {
        repository.deleteById(id);
    }
}