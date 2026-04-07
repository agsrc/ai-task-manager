package edu.akshay;

import edu.akshay.dto.AiTaskDTO;
import edu.akshay.service.TaskArchitect;
import edu.akshay.util.TaskListWrapper;
import io.quarkus.test.InjectMock;
import io.quarkus.test.junit.QuarkusTest;
import io.restassured.http.ContentType;
import org.junit.jupiter.api.Test;

import java.util.List;

import static io.restassured.RestAssured.given;
import static org.hamcrest.CoreMatchers.is;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

@QuarkusTest
public class AiTaskTest {

    @InjectMock
    TaskArchitect architect; // This mocks the AI Proxy

    @Test
    public void testAiTaskCreationFlow() {
        // 1. Setup the Mock Behavior
        TaskListWrapper mockWrapper = new TaskListWrapper();
        AiTaskDTO mockTask = new AiTaskDTO();
        mockTask.title = "Mock Task";
        mockTask.description = "Mock Description";
        mockTask.priority = 1;
        mockTask.rawDueDate = "tomorrow";
        mockWrapper.tasks = List.of(mockTask);

        // Tell Mockito to return our wrapper when the AI is called
        when(architect.parse(anyString())).thenReturn(mockWrapper);

        // 2. Execute the REST call
        given()
                .contentType(ContentType.TEXT)
                .body("I need to do something tomorrow")
                .when()
                .post("/tasks/ai")
                .then()
                .statusCode(200)
                .body("[0].title", is("Mock Task"))
                .body("[0].priority", is(1));
    }
}