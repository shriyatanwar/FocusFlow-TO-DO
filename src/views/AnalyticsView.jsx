import React, { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import useStore from '../store/useStore';
import Card from '../components/common/Card';
import './AnalyticsView.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

/**
 * Analytics Dashboard - Shows charts and statistics about tasks
 */
const AnalyticsView = () => {
  const { tasks } = useStore();

  // Calculate statistics
  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === 'done').length;
    const inProgress = tasks.filter((t) => t.status === 'in-progress').length;
    const todo = tasks.filter((t) => t.status === 'todo').length;
    const backlog = tasks.filter((t) => t.status === 'backlog').length;

    // Priority distribution
    const highPriority = tasks.filter((t) => t.priority === 'high').length;
    const mediumPriority = tasks.filter((t) => t.priority === 'medium').length;
    const lowPriority = tasks.filter((t) => t.priority === 'low').length;

    // Completion rate
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      total,
      completed,
      inProgress,
      todo,
      backlog,
      highPriority,
      mediumPriority,
      lowPriority,
      completionRate,
    };
  }, [tasks]);

  // Status Distribution (Doughnut Chart)
  const statusChartData = {
    labels: ['Backlog', 'To Do', 'In Progress', 'Done'],
    datasets: [
      {
        data: [stats.backlog, stats.todo, stats.inProgress, stats.completed],
        backgroundColor: ['#9ca3af', '#3b82f6', '#f59e0b', '#10b981'],
        borderWidth: 0,
      },
    ],
  };

  // Priority Distribution (Bar Chart)
  const priorityChartData = {
    labels: ['Low', 'Medium', 'High'],
    datasets: [
      {
        label: 'Tasks by Priority',
        data: [stats.lowPriority, stats.mediumPriority, stats.highPriority],
        backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  return (
    <div className="analytics-view">
      <div className="view-header">
        <h1>Analytics Dashboard</h1>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <Card className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3>Total Tasks</h3>
            <p className="stat-value">{stats.total}</p>
          </div>
        </Card>

        <Card className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>Completed</h3>
            <p className="stat-value">{stats.completed}</p>
          </div>
        </Card>

        <Card className="stat-card">
          <div className="stat-icon">⚡</div>
          <div className="stat-content">
            <h3>In Progress</h3>
            <p className="stat-value">{stats.inProgress}</p>
          </div>
        </Card>

        <Card className="stat-card">
          <div className="stat-icon">🎯</div>
          <div className="stat-content">
            <h3>Completion Rate</h3>
            <p className="stat-value">{stats.completionRate}%</p>
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="charts-grid">
        <Card className="chart-card">
          <h2 className="chart-title">Status Distribution</h2>
          <div className="chart-container">
            <Doughnut data={statusChartData} options={chartOptions} />
          </div>
        </Card>

        <Card className="chart-card">
          <h2 className="chart-title">Priority Breakdown</h2>
          <div className="chart-container">
            <Bar data={priorityChartData} options={chartOptions} />
          </div>
        </Card>
      </div>

      {/* Insights */}
      <Card className="insights-card">
        <h2>Insights</h2>
        <ul className="insights-list">
          {stats.total === 0 && (
            <li>📝 No tasks yet. Start by creating your first task!</li>
          )}
          {stats.highPriority > 0 && (
            <li>🔴 You have {stats.highPriority} high priority task(s) to focus on</li>
          )}
          {stats.completionRate >= 80 && stats.total > 0 && (
            <li>🎉 Great job! You've completed {stats.completionRate}% of your tasks</li>
          )}
          {stats.backlog > 5 && (
            <li>📋 You have {stats.backlog} tasks in backlog. Consider prioritizing them.</li>
          )}
          {stats.inProgress > 10 && (
            <li>⚠️ You have many tasks in progress. Try to focus on completing them first.</li>
          )}
        </ul>
      </Card>
    </div>
  );
};

export default AnalyticsView;
