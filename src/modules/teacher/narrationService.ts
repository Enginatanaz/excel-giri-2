/**
 * Narration coordinator for lesson steps and feedback
 */

import { speechService } from './speechService.ts';
import type { TaskStep, LessonStepStatus } from '../learning/lessonTypes.ts';

export const narrationService = {
  narrateTask(task: TaskStep, status: LessonStepStatus) {
    let textToSpeak = task.narrationText;

    if (status === 'success') {
      textToSpeak = `Tebrikler! ${task.title} adımını başarıyla tamamladınız. Şimdi bir sonraki adıma geçebilirsiniz.`;
    } else if (status === 'retry') {
      textToSpeak = `Bir hata oluştu. İpucu: ${task.hint}. Lütfen tekrar deneyin.`;
    }

    speechService.speak(textToSpeak);
  },

  narrateCustom(text: string) {
    speechService.speak(text);
  },

  pause() {
    speechService.pause();
  },

  resume() {
    speechService.resume();
  },

  stop() {
    speechService.stop();
  },
};
