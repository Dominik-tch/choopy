package com.taschion.choopy.service;

import com.taschion.choopy.exception.TaskNotFoundException;
import com.taschion.choopy.model.Task;
import com.taschion.choopy.model.User;
import com.taschion.choopy.repository.TaskRepository;
import com.taschion.choopy.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    public Task createTask(Task task, String username) {
        User owner = userRepository.findByUsername(username).orElseThrow();
        task.setOwner(owner);
        task.setCompletedBy(null);
        return taskRepository.save(task);
    }

    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    public Task completeTask(Long taskId, String username) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new TaskNotFoundException("Task with ID " + taskId + " not found."));
        User user = userRepository.findByUsername(username).orElseThrow();
        task.setCompletedBy(user);
        return taskRepository.save(task);
    }

    public void deleteTask(Long taskId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new TaskNotFoundException("Task with ID " + taskId + " not found."));
        taskRepository.delete(task);
    }
}
