package edu.akshay.service;

import dev.langchain4j.service.SystemMessage;
import dev.langchain4j.service.UserMessage;
import edu.akshay.util.TaskListWrapper;
import io.quarkiverse.langchain4j.RegisterAiService;

@RegisterAiService
public interface TaskArchitect {
    //optimize prompt for better results
    @SystemMessage("""
        Extract tasks from the text.
        Return a JSON list of TaskDTO objects.
        Do not generate an ID; set it to null.
        Priority should be 1-5.
        """)
    TaskListWrapper parse(@UserMessage String text);
}
