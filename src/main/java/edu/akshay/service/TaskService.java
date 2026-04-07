package edu.akshay.service;

import edu.akshay.TaskRepository.TaskRepository;
import edu.akshay.entity.Task;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.NotFoundException;
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

    @Transactional // Transaction boundary moved to the Service layer
    public Task createTask(Task task) {
        // Business logic (e.g., validations, sending events) would go here
        repository.persist(task);
        return task;
    }

    @Transactional
    public Task markComplete(Long id) {
        Task task = repository.findById(id);
        if (task == null) {
            throw new NotFoundException("Task not found with ID: " + id);
        }
        task.completed = true;
        return task; // Hibernate automatically flushes changes to the DB when the transaction closes
    }

    @Transactional
    public void deleteTask(Long id) {
        repository.deleteById(id);
    }
}