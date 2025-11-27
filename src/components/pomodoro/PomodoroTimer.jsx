import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import useStore from '../../store/useStore';
import Button from '../common/Button';
import { showPomodoroNotification } from '../../utils/notificationUtils';
import './PomodoroTimer.css';

/**
 * Pomodoro Timer Component
 * Helps users focus on tasks using the Pomodoro Technique
 */
const PomodoroTimer = () => {
  const { settings, selectedTaskId, tasks } = useStore();
  const [timeLeft, setTimeLeft] = useState(settings.pomodoroWorkDuration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState('work'); // 'work', 'shortBreak', 'longBreak'
  const [sessions, setSessions] = useState(0);
  const intervalRef = useRef(null);

  const selectedTask = tasks.find((t) => t.id === selectedTaskId);

  const durations = {
    work: settings.pomodoroWorkDuration * 60,
    shortBreak: settings.pomodoroShortBreak * 60,
    longBreak: settings.pomodoroLongBreak * 60,
  };

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  const handleTimerComplete = () => {
    setIsRunning(false);

    if (mode === 'work') {
      const newSessions = sessions + 1;
      setSessions(newSessions);

      // Show notification
      showPomodoroNotification('workComplete', selectedTask);

      // Determine next break
      if (newSessions % 4 === 0) {
        setMode('longBreak');
        setTimeLeft(durations.longBreak);
      } else {
        setMode('shortBreak');
        setTimeLeft(durations.shortBreak);
      }
    } else {
      showPomodoroNotification(
        mode === 'longBreak' ? 'longBreakComplete' : 'breakComplete'
      );
      setMode('work');
      setTimeLeft(durations.work);
    }

    // Play sound if enabled
    if (settings.soundEnabled) {
      playNotificationSound();
    }
  };

  const playNotificationSound = () => {
    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZizoIIGO47+WKNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZizoIIGO47+WKNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZizoIIGO47+WKNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZizoIIGO47+WKNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZizoIIGO47+WKNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZizoIIGO47+WKNwgZaLvt55NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZizoIIGO47+WKNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZizoIIGO47+WKNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZizoIIGO47+WKNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZizoIIGO47+WKNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFA==');
    audio.play().catch(() => {});
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(durations[mode]);
  };

  const switchMode = (newMode) => {
    setIsRunning(false);
    setMode(newMode);
    setTimeLeft(durations[newMode]);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((durations[mode] - timeLeft) / durations[mode]) * 100;

  return (
    <div className={`pomodoro-timer mode-${mode}`}>
      <div className="pomodoro-header">
        <h2>Pomodoro Timer</h2>
        {selectedTask && (
          <p className="selected-task-title">
            📌 {selectedTask.title}
          </p>
        )}
      </div>

      {/* Mode Switcher */}
      <div className="mode-switcher">
        <button
          className={`mode-btn ${mode === 'work' ? 'active' : ''}`}
          onClick={() => switchMode('work')}
        >
          Work
        </button>
        <button
          className={`mode-btn ${mode === 'shortBreak' ? 'active' : ''}`}
          onClick={() => switchMode('shortBreak')}
        >
          Short Break
        </button>
        <button
          className={`mode-btn ${mode === 'longBreak' ? 'active' : ''}`}
          onClick={() => switchMode('longBreak')}
        >
          Long Break
        </button>
      </div>

      {/* Timer Display */}
      <div className="timer-display">
        <motion.div
          className="timer-circle"
          style={{
            background: `conic-gradient(#667eea ${progress}%, var(--bg-secondary) ${progress}%)`,
          }}
        >
          <div className="timer-inner">
            <div className="timer-time">{formatTime(timeLeft)}</div>
            <div className="timer-label">{mode === 'work' ? 'Focus' : 'Break'}</div>
          </div>
        </motion.div>
      </div>

      {/* Controls */}
      <div className="timer-controls">
        <Button
          variant={isRunning ? 'secondary' : 'primary'}
          size="large"
          onClick={toggleTimer}
        >
          {isRunning ? '⏸ Pause' : '▶ Start'}
        </Button>
        <Button variant="ghost" size="large" onClick={resetTimer}>
          🔄 Reset
        </Button>
      </div>

      {/* Sessions */}
      <div className="sessions-counter">
        <p>Sessions completed: {sessions}</p>
      </div>
    </div>
  );
};

export default PomodoroTimer;
