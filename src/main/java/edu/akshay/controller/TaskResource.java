package edu.akshay.controller;

import edu.akshay.dto.TaskDTO;
import edu.akshay.entity.Task;
import io.smallrye.common.annotation.RunOnVirtualThread;
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

    // Constructor Injection
    public TaskResource(TaskService service) {
        this.service = service;
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