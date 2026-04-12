package edu.akshay.controller;

import edu.akshay.dto.TaskDTO;
import edu.akshay.entity.Task;
import edu.akshay.service.TaskArchitect;
import edu.akshay.util.TaskListWrapper;
import io.smallrye.common.annotation.Blocking;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import edu.akshay.service.TaskService;

import java.util.Collections;
import java.util.List;

@Path("/tasks")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class TaskResource {

    private final TaskService service;

    @Inject
    TaskArchitect architect; // Inject the AI Service

    // Constructor Injection
    public TaskResource(TaskService service) {
        this.service = service;
    }

    @POST
    @Path("/ai")
    @Consumes(MediaType.TEXT_PLAIN)
    @Transactional // The AI call is blocking; keep OS threads free!
    public List<Task> createFromAi(String prompt) {

        if (prompt == null || prompt.isBlank()) {
            throw new BadRequestException("Prompt cannot be empty");
        }


        // 1. Ask AI to parse the messy text into a list of Task objects
       // List<TaskDTO> extractedTasks = architect.parse(prompt);
        TaskListWrapper wrapper = architect.parse(prompt);

        if (wrapper == null || wrapper.tasks == null) {
            // Log this so you can see what the AI actually sent back
            System.out.println("AI failed to extract tasks from prompt: " + prompt);
            return Collections.emptyList();
        }

        // 2. Save all extracted tasks to the database
        return service.saveAiGeneratedTasks(wrapper.tasks);
    }

    @GET
    // Removed @RunOnVirtualThread to prevent H2 read-locks
    @Blocking
    public List<TaskDTO> getAll() {
        return service.getAllTasks()
                .stream()
                .map(TaskDTO::fromEntity)
                .toList();
    }

    @POST
    @Transactional
    public Response create(Task task) {
        Task created = service.createTask(task);
        return Response.status(Response.Status.CREATED).entity(created).build();
    }

    @PUT
    @Path("/{id}/toggle")
    public Task toggleStatus(@PathParam("id") Long id) {
        return service.toggleStatus(id);
    }

    @DELETE
    @Path("/{id}")
    public void delete(@PathParam("id") Long id) {
        service.deleteTask(id);
    }
}