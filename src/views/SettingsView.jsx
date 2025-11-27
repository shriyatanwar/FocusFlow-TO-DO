import React, { useState } from 'react';
import useStore from '../store/useStore';
import useTheme from '../hooks/useTheme';
import useNotification from '../hooks/useNotification';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import PomodoroTimer from '../components/pomodoro/PomodoroTimer';
import './SettingsView.css';

/**
 * Settings View - App settings and preferences
 */
const SettingsView = () => {
  const { settings, updateSettings } = useStore();
  const { theme, toggleTheme } = useTheme();
  const { permission, requestPermission } = useNotification();

  const [pomodoroSettings, setPomodoroSettings] = useState({
    pomodoroWorkDuration: settings.pomodoroWorkDuration,
    pomodoroShortBreak: settings.pomodoroShortBreak,
    pomodoroLongBreak: settings.pomodoroLongBreak,
  });

  const handlePomodoroChange = (field, value) => {
    setPomodoroSettings((prev) => ({
      ...prev,
      [field]: parseInt(value) || 0,
    }));
  };

  const savePomodoroSettings = () => {
    updateSettings(pomodoroSettings);
    alert('Pomodoro settings saved!');
  };

  const toggleNotifications = async () => {
    if (permission !== 'granted') {
      const result = await requestPermission();
      updateSettings({ notifications: result === 'granted' });
    } else {
      updateSettings({ notifications: !settings.notifications });
    }
  };

  const toggleSound = () => {
    updateSettings({ soundEnabled: !settings.soundEnabled });
  };

  return (
    <div className="settings-view">
      <div className="view-header">
        <h1>Settings</h1>
      </div>

      <div className="settings-content">
        <div className="settings-column">
          {/* Appearance */}
          <Card>
            <h2 className="section-title">Appearance</h2>
            <div className="setting-item">
              <div className="setting-info">
                <h3>Theme</h3>
                <p>Choose between light and dark mode</p>
              </div>
              <Button onClick={toggleTheme}>
                {theme === 'dark' ? '🌙 Dark' : '☀️ Light'}
              </Button>
            </div>
          </Card>

          {/* Notifications */}
          <Card>
            <h2 className="section-title">Notifications</h2>
            <div className="setting-item">
              <div className="setting-info">
                <h3>Browser Notifications</h3>
                <p>Get notified about tasks and Pomodoro sessions</p>
              </div>
              <Button
                variant={settings.notifications ? 'success' : 'secondary'}
                onClick={toggleNotifications}
              >
                {settings.notifications ? '✓ Enabled' : 'Enable'}
              </Button>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <h3>Sound Effects</h3>
                <p>Play sound when Pomodoro timer completes</p>
              </div>
              <Button
                variant={settings.soundEnabled ? 'success' : 'secondary'}
                onClick={toggleSound}
              >
                {settings.soundEnabled ? '✓ Enabled' : 'Enable'}
              </Button>
            </div>
          </Card>

          {/* Pomodoro Settings */}
          <Card>
            <h2 className="section-title">Pomodoro Timer</h2>
            <div className="pomodoro-settings">
              <Input
                label="Work Duration (minutes)"
                type="number"
                value={pomodoroSettings.pomodoroWorkDuration}
                onChange={(e) => handlePomodoroChange('pomodoroWorkDuration', e.target.value)}
                min="1"
                max="60"
              />
              <Input
                label="Short Break (minutes)"
                type="number"
                value={pomodoroSettings.pomodoroShortBreak}
                onChange={(e) => handlePomodoroChange('pomodoroShortBreak', e.target.value)}
                min="1"
                max="30"
              />
              <Input
                label="Long Break (minutes)"
                type="number"
                value={pomodoroSettings.pomodoroLongBreak}
                onChange={(e) => handlePomodoroChange('pomodoroLongBreak', e.target.value)}
                min="1"
                max="60"
              />
              <Button onClick={savePomodoroSettings}>
                Save Pomodoro Settings
              </Button>
            </div>
          </Card>

          {/* About */}
          <Card>
            <h2 className="section-title">About</h2>
            <div className="about-content">
              <h3>FocusFlow</h3>
              <p>Advanced Productivity To-Do App</p>
              <p className="version">Version 1.0.0</p>
              <p className="description">
                Built with React, Zustand, and modern web technologies to help you stay
                productive and focused.
              </p>
            </div>
          </Card>
        </div>

        {/* Pomodoro Timer Preview */}
        <div className="settings-column">
          <Card>
            <h2 className="section-title">Pomodoro Timer</h2>
            <PomodoroTimer />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
