/**
 * Lesson session management hook
 * Manages the student learning flow, teacher validation, step state machine, and progress
 */

import { useState, useCallback, useEffect } from 'react';
import type { Lesson, LessonStepStatus, TaskValidationResult } from '../modules/learning/lessonTypes.ts';
import type { Worksheet, CellCoordinate } from '../modules/spreadsheet/types.ts';
import { progressService } from '../modules/learning/progressService.ts';
import { narrationService } from '../modules/teacher/narrationService.ts';

export function useLessonSession(lesson: Lesson) {
  const [currentTaskIndex, setCurrentTaskIndex] = useState<number>(0);
  const [stepStatus, setStepStatus] = useState<LessonStepStatus>('instruction');
  const [activeTab, setActiveTab] = useState<'anlatim' | 'ornek' | 'uygulama' | 'ozet'>('uygulama');
  const [validationResult, setValidationResult] = useState<TaskValidationResult | null>(null);
  const [completedTaskIds, setCompletedTaskIds] = useState<string[]>([]);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const currentTask = lesson.tasks[currentTaskIndex];

  // Load existing progress for this lesson
  useEffect(() => {
    const progress = progressService.getProgress();
    const lessonProg = progress.lessonProgress[lesson.id];
    if (lessonProg) {
      if (lessonProg.completed) {
        setIsCompleted(true);
        setCompletedTaskIds(lessonProg.completedTasks || lesson.tasks.map((t) => t.id));
      } else if (lessonProg.currentTaskIndex !== undefined) {
        setCurrentTaskIndex(Math.min(lessonProg.currentTaskIndex, lesson.tasks.length - 1));
        setCompletedTaskIds(lessonProg.completedTasks || []);
      }
    }
  }, [lesson.id, lesson.tasks]);

  /**
   * Validate current task against actual worksheet and active cell
   */
  const validateCurrentTask = useCallback(
    (sheet: Worksheet, activeCell: CellCoordinate) => {
      if (!currentTask) return;

      setStepStatus('validating');
      const result = currentTask.validate(sheet, activeCell);
      setValidationResult(result);

      if (result.isValid) {
        setStepStatus('success');
        narrationService.narrateTask(currentTask, 'success');

        const newCompleted = Array.from(new Set([...completedTaskIds, currentTask.id]));
        setCompletedTaskIds(newCompleted);

        const isAllDone = newCompleted.length === lesson.tasks.length;
        if (isAllDone) {
          setIsCompleted(true);
        }

        progressService.saveLessonProgress(lesson.id, {
          completed: isAllDone,
          currentTaskIndex: Math.min(currentTaskIndex + 1, lesson.tasks.length - 1),
          completedTasks: newCompleted,
          score: Math.round((newCompleted.length / lesson.tasks.length) * 100),
        });
      } else {
        setStepStatus('retry');
        narrationService.narrateTask(currentTask, 'retry');
      }
    },
    [currentTask, completedTaskIds, lesson.id, lesson.tasks.length, currentTaskIndex]
  );

  /**
   * Move to next task step (only allowed if current task is completed or valid)
   */
  const nextTask = useCallback(() => {
    if (currentTaskIndex < lesson.tasks.length - 1) {
      const nextIndex = currentTaskIndex + 1;
      setCurrentTaskIndex(nextIndex);
      setStepStatus('instruction');
      setValidationResult(null);

      progressService.saveLessonProgress(lesson.id, {
        currentTaskIndex: nextIndex,
      });

      const nextTaskStep = lesson.tasks[nextIndex];
      if (nextTaskStep) {
        narrationService.narrateTask(nextTaskStep, 'instruction');
      }
    } else {
      setStepStatus('completed');
      setIsCompleted(true);
      setActiveTab('ozet');
    }
  }, [currentTaskIndex, lesson.tasks, lesson.id]);

  /**
   * Move to previous task step
   */
  const prevTask = useCallback(() => {
    if (currentTaskIndex > 0) {
      const prevIndex = currentTaskIndex - 1;
      setCurrentTaskIndex(prevIndex);
      setStepStatus('instruction');
      setValidationResult(null);
    }
  }, [currentTaskIndex]);

  /**
   * Retry current task
   */
  const retryTask = useCallback(() => {
    setStepStatus('waiting_for_student');
    setValidationResult(null);
  }, []);

  /**
   * Jump to specific task index
   */
  const jumpToTask = useCallback(
    (index: number) => {
      if (index >= 0 && index < lesson.tasks.length) {
        setCurrentTaskIndex(index);
        setStepStatus('instruction');
        setValidationResult(null);
      }
    },
    [lesson.tasks.length]
  );

  return {
    currentTaskIndex,
    currentTask,
    stepStatus,
    setStepStatus,
    activeTab,
    setActiveTab,
    validationResult,
    completedTaskIds,
    isCompleted,
    validateCurrentTask,
    nextTask,
    prevTask,
    retryTask,
    jumpToTask,
  };
}
