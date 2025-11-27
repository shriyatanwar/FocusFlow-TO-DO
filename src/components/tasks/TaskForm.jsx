import React, { useState, useEffect } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';
import Badge from '../common/Badge';
import { parseNaturalLanguage } from '../../utils/naturalLanguageParser';
import { PRIORITIES, STATUSES, STATUS_LABELS, PRIORITY_LABELS } from '../../utils/constants';
import './TaskForm.css';

/**
 * Task Form component for creating and editing tasks
 * Supports natural language input parsing
 */
const TaskForm = ({ task, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium',
    status: 'todo',
    tags: [],
    subtasks: [],
  });

  const [naturalInput, setNaturalInput] = useState('');
  const [newTag, setNewTag] = useState('');
  const [newSubtask, setNewSubtask] = useState('');

  // Populate form if editing existing task
  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
        priority: task.priority || 'medium',
        status: task.status || 'todo',
        tags: task.tags || [],
        subtasks: task.subtasks || [],
      });
    }
  }, [task]);

  const handleNaturalInputChange = (e) => {
    const input = e.target.value;
    setNaturalInput(input);

    if (input.trim()) {
      const parsed = parseNaturalLanguage(input);
      setFormData((prev) => ({
        ...prev,
        title: parsed.title,
        dueDate: parsed.dueDate ? parsed.dueDate.split('T')[0] : prev.dueDate,
        priority: parsed.priority,
        tags: [...new Set([...prev.tags, ...parsed.tags])],
      }));
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tag) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  const handleAddSubtask = () => {
    if (newSubtask.trim()) {
      setFormData((prev) => ({
        ...prev,
        subtasks: [
          ...prev.subtasks,
          { id: Date.now(), title: newSubtask.trim(), completed: false },
        ],
      }));
      setNewSubtask('');
    }
  };

  const handleRemoveSubtask = (id) => {
    setFormData((prev) => ({
      ...prev,
      subtasks: prev.subtasks.filter((st) => st.id !== id),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('Please enter a task title');
      return;
    }
    onSubmit(formData);
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      {/* Natural Language Input */}
      <div className="form-section">
        <Input
          label="Quick Add (Natural Language)"
          placeholder='Try: "Submit report tomorrow at 5pm !high @work"'
          value={naturalInput}
          onChange={handleNaturalInputChange}
        />
        <p className="form-hint">
          Use !high/!medium/!low for priority, @tag for tags, and date keywords like "tomorrow"
        </p>
      </div>

      {/* Title */}
      <Input
        label="Title"
        placeholder="Enter task title"
        value={formData.title}
        onChange={(e) => handleChange('title', e.target.value)}
        required
      />

      {/* Description */}
      <div className="form-section">
        <label className="input-label">Description</label>
        <textarea
          className="input"
          placeholder="Enter task description"
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          rows={3}
        />
      </div>

      {/* Due Date */}
      <Input
        label="Due Date"
        type="date"
        value={formData.dueDate}
        onChange={(e) => handleChange('dueDate', e.target.value)}
      />

      {/* Priority and Status */}
      <div className="form-row">
        <div className="form-section">
          <label className="input-label">Priority</label>
          <select
            className="input"
            value={formData.priority}
            onChange={(e) => handleChange('priority', e.target.value)}
          >
            {Object.entries(PRIORITY_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-section">
          <label className="input-label">Status</label>
          <select
            className="input"
            value={formData.status}
            onChange={(e) => handleChange('status', e.target.value)}
          >
            {Object.entries(STATUS_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tags */}
      <div className="form-section">
        <label className="input-label">Tags</label>
        <div className="tags-input">
          <input
            type="text"
            className="input"
            placeholder="Add a tag"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
          />
          <Button type="button" variant="secondary" size="small" onClick={handleAddTag}>
            Add
          </Button>
        </div>
        <div className="tags-list">
          {formData.tags.map((tag) => (
            <Badge key={tag} variant="tag" onRemove={() => handleRemoveTag(tag)}>
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      {/* Subtasks */}
      <div className="form-section">
        <label className="input-label">Subtasks</label>
        <div className="tags-input">
          <input
            type="text"
            className="input"
            placeholder="Add a subtask"
            value={newSubtask}
            onChange={(e) => setNewSubtask(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSubtask())}
          />
          <Button type="button" variant="secondary" size="small" onClick={handleAddSubtask}>
            Add
          </Button>
        </div>
        <ul className="subtasks-list">
          {formData.subtasks.map((subtask) => (
            <li key={subtask.id} className="subtask-item">
              <span>{subtask.title}</span>
              <button
                type="button"
                className="subtask-remove"
                onClick={() => handleRemoveSubtask(subtask.id)}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Actions */}
      <div className="form-actions">
        <Button type="submit" variant="primary">
          {task ? 'Update Task' : 'Create Task'}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default TaskForm;
