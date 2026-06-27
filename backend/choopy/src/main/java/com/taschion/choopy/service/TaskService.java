package com.taschion.choopy.service;

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
        task.setCompletedBy(null); // Anfangs null, wie gefordert
        return taskRepository.save(task);
    }

    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    public Task completeTask(Long taskId, String username) {
        Task task = taskRepository.findById(taskId).orElseThrow();
        User user = userRepository.findByUsername(username).orElseThrow();
        task.setCompletedBy(user);
        return taskRepository.save(task);
    }
}
