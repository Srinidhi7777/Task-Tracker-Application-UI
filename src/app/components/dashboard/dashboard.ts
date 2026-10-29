
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TaskService } from '../../services/task';
import { Task } from '../../models/task';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {

  tasks: Task[] = [];

  totalTasks = 0;
  pendingTasks = 0;
  inProgressTasks = 0;
  completedTasks = 0;

  highPriorityTasks = 0;
  mediumPriorityTasks = 0;
  lowPriorityTasks = 0;

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.taskService.getTasks().subscribe({
      next: (data) => {
        this.tasks = data;

        this.totalTasks = data.length;

        this.pendingTasks = data.filter(
          task => task.status === 'Pending'
        ).length;

        this.inProgressTasks = data.filter(
          task => task.status === 'In Progress'
        ).length;

        this.completedTasks = data.filter(
          task => task.status === 'Completed'
        ).length;

        this.highPriorityTasks = data.filter(
          task => task.priority === 'High'
        ).length;

        this.mediumPriorityTasks = data.filter(
          task => task.priority === 'Medium'
        ).length;

        this.lowPriorityTasks = data.filter(
          task => task.priority === 'Low'
        ).length;
      },
      error: (error) => {
        console.error('Error loading dashboard:', error);
      }
    });
  }

  get recentTasks(): Task[] {
    return [...this.tasks]
      .sort((a, b) => b.id - a.id)
      .slice(0, 3);
  }

  get pendingPercent(): number {
    return this.getPercentage(this.pendingTasks);
  }

  get inProgressPercent(): number {
    return this.getPercentage(this.inProgressTasks);
  }

  get completedPercent(): number {
    return this.getPercentage(this.completedTasks);
  }

  get donutGradient(): string {
    if (this.totalTasks === 0) {
      return '#e5e7eb';
    }

    const pendingEnd = this.pendingPercent;
    const progressEnd = pendingEnd + this.inProgressPercent;

    return `conic-gradient(
      #fb8189 0% ${pendingEnd}%,
      #f8ca58 ${pendingEnd}% ${progressEnd}%,
      #59c995 ${progressEnd}% 100%
    )`;
  }

  get maxPriorityCount(): number {
    return Math.max(
      this.highPriorityTasks,
      this.mediumPriorityTasks,
      this.lowPriorityTasks,
      1
    );
  }

  getPriorityHeight(count: number): number {
    return (count / this.maxPriorityCount) * 100;
  }

  getPercentage(count: number): number {
    if (this.totalTasks === 0) {
      return 0;
    }

    return (count / this.totalTasks) * 100;
  }

  getRoundedPercentage(count: number): number {
    return Math.round(this.getPercentage(count));
  }

  formatDate(date: string): string {
    if (!date) {
      return '-';
    }

    const parsedDate = new Date(date + 'T00:00:00');

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }
}
