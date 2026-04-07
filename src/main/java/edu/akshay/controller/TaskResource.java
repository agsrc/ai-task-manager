package edu.akshay.controller;

import edu.akshay.dto.AiTaskDTO;
import edu.akshay.dto.TaskDTO;
import edu.akshay.entity.Task;
import edu.akshay.service.TaskArchitect;
import edu.akshay.util.TaskListWrapper;
import io.smallrye.common.annotation.RunOnVirtualThread;
import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import edu.akshay.service.TaskService;

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
    @RunOnVirtualThread // The AI call is blocking; keep OS threads free!
    public List<Task> createFromAi(String prompt) {

        // 1. Ask AI to parse the messy text into a list of Task objects
       // List<TaskDTO> extractedTasks = architect.parse(prompt);
        TaskListWrapper wrapper = architect.parse(prompt);

        // 2. Save all extracted tasks to the database
        return service.saveAiGeneratedTasks(wrapper.tasks);
    }

    @GET
    @RunOnVirtualThread
    public List<TaskDTO> getAll() {
        return service.getAllTasks()
                .stream()
                .map(TaskDTO::fromEntity)
                .toList();
    }

    @POST
    public Response create(Task task) {
        Task created = service.createTask(task);
        return Response.status(Response.Status.CREATED).entity(created).build();
    }

    @PUT
    @Path("/{id}/complete")
    public Task markComplete(@PathParam("id") Long id) {
        return service.markComplete(id);
    }

    @DELETE
    @Path("/{id}")
    public void delete(@PathParam("id") Long id) {
        service.deleteTask(id);
    }
}