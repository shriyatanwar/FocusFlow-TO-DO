import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { format } from 'date-fns';
import useStore from '../store/useStore';
import TaskItem from '../components/tasks/TaskItem';
import TaskForm from '../components/tasks/TaskForm';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';
import { groupTasksByDate } from '../utils/dateUtils';
import './CalendarView.css';

/**
 * Calendar View - Shows tasks in a calendar format
 */
const CalendarView = () => {
  const { tasks, addTask, updateTask, deleteTask, toggleTaskComplete } = useStore();

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const groupedTasks = groupTasksByDate(tasks);
  const selectedDateKey = format(selectedDate, 'yyyy-MM-dd');
  const tasksForSelectedDate = groupedTasks[selectedDateKey] || [];

  // Mark dates that have tasks
  const tileClassName = ({ date }) => {
    const dateKey = format(date, 'yyyy-MM-dd');
    return groupedTasks[dateKey] ? 'has-tasks' : null;
  };

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
      // Set due date to selected date for new tasks
      addTask({
        ...taskData,
        dueDate: taskData.dueDate || selectedDate.toISOString()
      });
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
    <div className="calendar-view">
      {/* Header */}
      <div className="view-header">
        <h1>Calendar</h1>
        <Button onClick={handleAddTask}>+ New Task</Button>
      </div>

      <div className="calendar-container">
        {/* Calendar */}
        <div className="calendar-widget">
          <Calendar
            onChange={setSelectedDate}
            value={selectedDate}
            tileClassName={tileClassName}
          />
        </div>

        {/* Selected Date Tasks */}
        <div className="selected-date-tasks">
          <h2 className="selected-date-title">
            {format(selectedDate, 'MMMM d, yyyy')}
          </h2>

          {tasksForSelectedDate.length === 0 ? (
            <div className="empty-state">
              <p>No tasks for this date</p>
              <Button onClick={handleAddTask}>+ Add Task</Button>
            </div>
          ) : (
            <div className="tasks-list">
              {tasksForSelectedDate.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onEdit={handleEditTask}
                  onDelete={handleDeleteTask}
                  onToggleComplete={toggleTaskComplete}
                />
              ))}
            </div>
          )}
        </div>
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

export default CalendarView;
