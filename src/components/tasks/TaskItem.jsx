import React from 'react';
import { motion } from 'framer-motion';
import Badge from '../common/Badge';
import { formatDateShort, isOverdue } from '../../utils/dateUtils';
import './TaskItem.css';

/**
 * Individual Task Item component
 * @param {object} task - Task object
 * @param {function} onEdit - Edit handler
 * @param {function} onDelete - Delete handler
 * @param {function} onToggleComplete - Toggle complete handler
 * @param {boolean} draggable - Whether task is draggable
 */
const TaskItem = ({ task, onEdit, onDelete, onToggleComplete, draggable = true }) => {
  const isTaskOverdue = task.dueDate && isOverdue(task.dueDate) && task.status !== 'done';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`task-item ${task.status === 'done' ? 'task-completed' : ''} ${
        isTaskOverdue ? 'task-overdue' : ''
      }`}
    >
      <div className="task-item-left">
        <input
          type="checkbox"
          className="task-checkbox"
          checked={task.status === 'done'}
          onChange={() => onToggleComplete(task.id)}
        />

        <div className="task-content">
          <h3 className="task-title">{task.title}</h3>

          {task.description && <p className="task-description">{task.description}</p>}

          <div className="task-meta">
            {task.dueDate && (
              <span className={`task-date ${isTaskOverdue ? 'overdue' : ''}`}>
                📅 {formatDateShort(task.dueDate)}
              </span>
            )}

            {task.tags && task.tags.length > 0 && (
              <div className="task-tags">
                {task.tags.map((tag) => (
                  <Badge key={tag} variant="tag">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            <Badge variant={`priority-${task.priority}`}>{task.priority}</Badge>

            <Badge variant={`status-${task.status}`}>
              {task.status.replace('-', ' ')}
            </Badge>

            {task.subtasks && task.subtasks.length > 0 && (
              <span className="task-subtasks">
                ✓ {task.subtasks.filter((st) => st.completed).length}/{task.subtasks.length}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="task-actions">
        <button
          className="task-action-btn"
          onClick={() => onEdit(task)}
          aria-label="Edit task"
        >
          ✏️
        </button>
        <button
          className="task-action-btn task-delete-btn"
          onClick={() => onDelete(task.id)}
          aria-label="Delete task"
        >
          🗑️
        </button>
      </div>
    </motion.div>
  );
};

export default TaskItem;
