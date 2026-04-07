package edu.akshay.TaskRepository;

import edu.akshay.entity.Task;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;
import java.util.List;

@ApplicationScoped // Makes this a Singleton bean
public class TaskRepository implements PanacheRepository<Task> {

    // Custom query method
    public List<Task> findHighPriority() {
        return find("priority >= ?1 and completed = false", 4).list();
    }
}