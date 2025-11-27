import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { motion, AnimatePresence } from 'framer-motion';
import useStore from '../store/useStore';
import TaskItem from '../components/tasks/TaskItem';
import TaskForm from '../components/tasks/TaskForm';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';
import { STATUS_LABELS } from '../utils/constants';
import './KanbanView.css';

/**
 * Kanban Board View - Shows tasks grouped by status
 */
const KanbanView = () => {
  const { tasks, addTask, updateTask, deleteTask, toggleTaskComplete } = useStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const statuses = ['backlog', 'todo', 'in-progress', 'done'];

  const getTasksByStatus = (status) => {
    return tasks.filter((task) => task.status === status);
  };

  const handleDragEnd = (result) => {
    const { source, destination } = result;

    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return;
    }

    const taskId = result.draggableId;
    const newStatus = destination.droppableId;

    updateTask(taskId, { status: newStatus });
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
      addTask(taskData);
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
    <div className="kanban-view">
      {/* Header */}
      <div className="view-header">
        <h1>Kanban Board</h1>
        <Button onClick={handleAddTask}>+ New Task</Button>
      </div>

      {/* Kanban Board */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="kanban-board">
          {statuses.map((status) => {
            const statusTasks = getTasksByStatus(status);

            return (
              <div key={status} className="kanban-column">
                <div className="kanban-column-header">
                  <h2>{STATUS_LABELS[status]}</h2>
                  <span className="task-count">{statusTasks.length}</span>
                </div>

                <Droppable droppableId={status}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`kanban-column-content ${
                        snapshot.isDraggingOver ? 'dragging-over' : ''
                      }`}
                    >
                      <AnimatePresence>
                        {statusTasks.map((task, index) => (
                          <Draggable key={task.id} draggableId={task.id} index={index}>
                            {(provided, snapshot) => (
                              <motion.div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`kanban-task ${snapshot.isDragging ? 'dragging' : ''}`}
                                layout
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                              >
                                <TaskItem
                                  task={task}
                                  onEdit={handleEditTask}
                                  onDelete={handleDeleteTask}
                                  onToggleComplete={toggleTaskComplete}
                                />
                              </motion.div>
                            )}
                          </Draggable>
                        ))}
                      </AnimatePresence>
                      {provided.placeholder}

                      {statusTasks.length === 0 && (
                        <div className="empty-column">
                          <p>No tasks in {STATUS_LABELS[status].toLowerCase()}</p>
                        </div>
                      )}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>

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

export default KanbanView;
