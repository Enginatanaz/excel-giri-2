/**
 * Web Speech API service for Excel Akademi AI
 * Safely accesses speechSynthesis and manages narration playback
 */

import type { PlaybackState, SpeechStatus } from './teacherTypes.ts';

type StateListener = (status: SpeechStatus) => void;

class SpeechService {
  private utterance: SpeechSynthesisUtterance | null = null;
  private currentText: string = '';
  private state: PlaybackState = 'idle';
  private listeners: Set<StateListener> = new Set();
  private isBrowserSupported: boolean = false;
  private turkishVoice: SpeechSynthesisVoice | null = null;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.isBrowserSupported = true;
      this.initVoices();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = () => this.initVoices();
      }
    }
  }

  private initVoices() {
    if (!this.isBrowserSupported) return;
    const voices = window.speechSynthesis.getVoices();
    this.turkishVoice =
      voices.find((v) => v.lang.startsWith('tr') || v.lang === 'tr-TR') ||
      voices.find((v) => v.default) ||
      voices[0] ||
      null;
    this.notify();
  }

  public subscribe(listener: StateListener): () => void {
    this.listeners.add(listener);
    listener(this.getStatus());
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    const status = this.getStatus();
    this.listeners.forEach((fn) => fn(status));
  }

  public getStatus(): SpeechStatus {
    return {
      isSupported: this.isBrowserSupported,
      state: this.state,
      hasTurkishVoice: !!this.turkishVoice,
      selectedVoiceName: this.turkishVoice?.name || null,
    };
  }

  public speak(text: string) {
    if (!this.isBrowserSupported) {
      console.info('SpeechSynthesis not supported on this platform. Displaying text.');
      return;
    }

    this.stop();
    this.currentText = text;

    try {
      this.utterance = new SpeechSynthesisUtterance(text);
      if (this.turkishVoice) {
        this.utterance.voice = this.turkishVoice;
      }
      this.utterance.lang = 'tr-TR';
      this.utterance.rate = 0.95; // Slightly slower, clear educational pace
      this.utterance.pitch = 1.0;

      this.utterance.onstart = () => {
        this.state = 'playing';
        this.notify();
      };

      this.utterance.onend = () => {
        this.state = 'idle';
        this.notify();
      };

      this.utterance.onerror = (e) => {
        // 'interrupted' and 'canceled' are normal when user clicks stop or skips
        if (e.error !== 'interrupted' && e.error !== 'canceled') {
          console.warn('Speech error:', e);
        }
        this.state = 'idle';
        this.notify();
      };

      window.speechSynthesis.speak(this.utterance);
      this.state = 'playing';
      this.notify();
    } catch (e) {
      console.warn('Speech synthesis exception:', e);
      this.state = 'idle';
      this.notify();
    }
  }

  public pause() {
    if (!this.isBrowserSupported) return;
    try {
      window.speechSynthesis.pause();
      this.state = 'paused';
      this.notify();
    } catch (e) {
      console.warn(e);
    }
  }

  public resume() {
    if (!this.isBrowserSupported) return;
    try {
      window.speechSynthesis.resume();
      this.state = 'playing';
      this.notify();
    } catch (e) {
      console.warn(e);
    }
  }

  public stop() {
    if (!this.isBrowserSupported) return;
    try {
      window.speechSynthesis.cancel();
      this.state = 'stopped';
      this.notify();
    } catch (e) {
      console.warn(e);
    }
  }

  public getCurrentText(): string {
    return this.currentText;
  }
}

export const speechService = new SpeechService();
