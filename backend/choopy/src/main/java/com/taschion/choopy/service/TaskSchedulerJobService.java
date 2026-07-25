package com.taschion.choopy.service;

import com.taschion.choopy.model.ScheduledTask;
import com.taschion.choopy.model.Task;
import com.taschion.choopy.repository.ScheduledTaskRepository;
import com.taschion.choopy.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class TaskSchedulerJobService {

    private final ScheduledTaskRepository scheduledTaskRepo;
    private final TaskRepository taskRepo;

    // Cron: Sekunde, Minute, Stunde, Tag im Monat, Monat, Wochentag
    // "0 0 3 * * *" means: every day at 03:00:00
    @Transactional
    @Scheduled(cron = "0 0 3 * * *")
    public void generateTasksForToday() {
        String today = LocalDate.now().getDayOfWeek().name();
        log.info("Running daily task generation... Today is: {}", today);

        List<ScheduledTask> allTemplates = scheduledTaskRepo.findAll();
        int createdTasksCount = 0;

        for (ScheduledTask template : allTemplates) {

            if (template.getScheduledDays() != null && template.getScheduledDays().contains(today)) {

                boolean alreadyCreatedToday = taskRepo.existsByGeneratedByAndCreationDateGreaterThanEqual(
                        template, LocalDate.now().atStartOfDay()
                );
                boolean hasOpenTask = taskRepo.existsByGeneratedByAndCompletedByIsNull(template);

                if (!alreadyCreatedToday && !hasOpenTask) {
                    Task newTask = Task.builder()
                            .title(template.getTitle())
                            .description(template.getDescription())
                            .category(template.getCategory())
                            .duration(template.getDuration())
                            .points(template.getPoints())
                            .household(template.getHousehold())
                            .generatedBy(template)
                            .build();

                    taskRepo.save(newTask);
                    createdTasksCount++;
                }
            }
        }

        log.info("Task generation finished. Created {} new tasks.", createdTasksCount);
    }
}