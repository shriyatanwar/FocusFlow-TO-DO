import React from 'react';
import useStore from '../../store/useStore';
import Input from '../common/Input';
import Button from '../common/Button';
import { PRIORITY_LABELS, STATUS_LABELS } from '../../utils/constants';
import './TaskFilters.css';

/**
 * Task Filters component
 * Includes search, priority filter, status filter
 */
const TaskFilters = () => {
  const {
    searchQuery,
    filterPriority,
    filterStatus,
    setSearchQuery,
    setFilterPriority,
    setFilterStatus,
    clearFilters,
  } = useStore();

  const hasActiveFilters =
    searchQuery || filterPriority !== 'all' || filterStatus !== 'all';

  return (
    <div className="task-filters">
      {/* Search */}
      <div className="filter-search">
        <Input
          placeholder="Search tasks... (press / to focus)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          icon="🔍"
        />
      </div>

      {/* Filter Controls */}
      <div className="filter-controls">
        {/* Priority Filter */}
        <select
          className="filter-select"
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
        >
          <option value="all">All Priorities</option>
          {Object.entries(PRIORITY_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label} Priority
            </option>
          ))}
        </select>

        {/* Status Filter */}
        <select
          className="filter-select"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="all">All Statuses</option>
          {Object.entries(STATUS_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button variant="ghost" size="small" onClick={clearFilters}>
            Clear Filters
          </Button>
        )}
      </div>
    </div>
  );
};

export default TaskFilters;
