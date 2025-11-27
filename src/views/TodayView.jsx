import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import useStore from '../store/useStore';
import TaskItem from '../components/tasks/TaskItem';
import TaskForm from '../components/tasks/TaskForm';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';
import { getTodayTasks } from '../utils/dateUtils';
import './TodayView.css';

/**
 * Today View - Shows only tasks due today or overdue
 */
const TodayView = () => {
  const { tasks, addTask, updateTask, deleteTask, toggleTaskComplete } = useStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const todayTasks = getTodayTasks(tasks);
  const completedTasks = todayTasks.filter((task) => task.status === 'done');
  const incompleteTasks = todayTasks.filter((task) => task.status !== 'done');

  const completionRate = todayTasks.length > 0
    ? Math.round((completedTasks.length / todayTasks.length) * 100)
    : 0;

  const handleAddTask = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleSubmitTask = (taskData) => {
    if (editingTask) {
      updateTask(editingTask.id, taskData);
    } else {
      // Set due date to today for new tasks in Today view
      const today = new Date().toISOString().split('T')[0];
      addTask({ ...taskData, dueDate: taskData.dueDate || today });
    }
    setIsModalOpen(false);
    setEditingTask(null);
  };

  const handleDeleteTask = (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteTask(taskId);
    }
  };

  return (
    <div className="today-view">
      {/* Header */}
      <div className="view-header">
        <div className="today-header-content">
          <h1>Today</h1>
          <p className="today-date">{new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric'
          })}</p>
        </div>
        <Button onClick={handleAddTask}>+ New Task</Button>
      </div>

      {/* Progress Card */}
      {todayTasks.length > 0 && (
        <div className="today-progress">
          <div className="progress-header">
            <h3>Today's Progress</h3>
            <span className="progress-percentage">{completionRate}%</span>
          </div>
          <div className="progress-bar">
            <div
              className="progress-bar-fill"
              style={{ width: `${completionRate}%` }}
            />
          </div>
          <p className="progress-text">
            {completedTasks.length} of {todayTasks.length} tasks completed
          </p>
        </div>
      )}

      {/* Tasks */}
      <div className="tasks-container">
        {todayTasks.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📅</div>
            <h2>No tasks for today</h2>
            <p>You're all caught up! Add a new task or enjoy your free time.</p>
            <Button onClick={handleAddTask}>+ Add Task</Button>
          </div>
        ) : (
          <>
            {/* Incomplete Tasks */}
            {incompleteTasks.length > 0 && (
              <div className="task-section">
                <h2 className="section-title">
                  To Do <span className="count">{incompleteTasks.length}</span>
                </h2>
                <div className="tasks-list">
                  <AnimatePresence>
                    {incompleteTasks.map((task) => (
                      <TaskItem
                        key={task.id}
                        task={task}
                        onEdit={handleEditTask}
                        onDelete={handleDeleteTask}
                        onToggleComplete={toggleTaskComplete}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            )}

            {/* Completed Tasks */}
            {completedTasks.length > 0 && (
              <div className="task-section">
                <h2 className="section-title">
                  Completed <span className="count">{completedTasks.length}</span>
                </h2>
                <div className="tasks-list">
                  <AnimatePresence>
                    {completedTasks.map((task) => (
                      <TaskItem
                        key={task.id}
                        task={task}
                        onEdit={handleEditTask}
                        onDelete={handleDeleteTask}
                        onToggleComplete={toggleTaskComplete}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Task Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTask(null);
        }}
        title={editingTask ? 'Edit Task' : 'New Task'}
        size="large"
      >
        <TaskForm
          task={editingTask}
          onSubmit={handleSubmitTask}
          onCancel={() => {
            setIsModalOpen(false);
            setEditingTask(null);
          }}
        />
      </Modal>
    </div>
  );
};

export default TodayView;
