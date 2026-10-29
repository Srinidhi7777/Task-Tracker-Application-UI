
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { Task } from '../../models/task';
import { TaskService } from '../../services/task';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-task-list',
  imports: [FormsModule],
  templateUrl: './task-list.html',
  styleUrl: './task-list.css'
})
export class TaskList implements OnInit, OnDestroy {

  tasks: Task[] = [];

  searchText = '';
  selectedStatus = 'All';
  selectedPriority = 'All';

  currentPage = 1;
  pageSize = 5;

  successMessage = '';
  errorMessage = '';

  private toastTimer?: ReturnType<typeof setTimeout>;

  constructor(
    private taskService: TaskService,
    private router: Router,
      private cdr: ChangeDetectorRef

  ) {}

  // Component initialization
  ngOnInit(): void {
    this.loadTasks();

    // Browser-only navigation message
    if (typeof window !== 'undefined') {
      const message = window.history.state?.message;

      if (typeof message === 'string') {
        this.showToast(message, 'success');

        window.history.replaceState(
          { ...window.history.state, message: null },
          ''
        );
      }
    }
  }

  // GET Tasks from ASP.NET Core API
loadTasks(): void {
  this.taskService.getTasks().subscribe({
    next: (data) => {
      this.tasks = data ?? [];

      this.clearFilters();

      this.currentPage = 1;

      console.log('API Tasks:', this.tasks);
      console.log('Filtered Tasks:', this.filteredTasks);
      console.log('Paginated Tasks:', this.paginatedTasks);

      this.cdr.detectChanges();
    },
    error: (error) => {
      console.error('Error loading tasks:', error);
      this.showToast('Unable to load tasks.', 'error');
    }
  });
}
  // Search, status and priority filtering
  get filteredTasks(): Task[] {
    const search = this.searchText.toLowerCase().trim();

    return this.tasks.filter(task => {
      const matchesSearch =
        task.title.toLowerCase().includes(search) ||
        (task.description ?? '').toLowerCase().includes(search);

      const matchesStatus =
        this.selectedStatus === 'All' ||
        task.status === this.selectedStatus;

      const matchesPriority =
        this.selectedPriority === 'All' ||
        task.priority === this.selectedPriority;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }

  // Total number of pages
  get totalPages(): number {
    return Math.max(
      1,
      Math.ceil(this.filteredTasks.length / this.pageSize)
    );
  }

  // Tasks displayed on the current page
  get paginatedTasks(): Task[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;

    return this.filteredTasks.slice(
      startIndex,
      startIndex + this.pageSize
    );
  }

  // Starting task number
  get startTaskNumber(): number {
    if (this.filteredTasks.length === 0) {
      return 0;
    }

    return (this.currentPage - 1) * this.pageSize + 1;
  }

  // Ending task number
  get endTaskNumber(): number {
    return Math.min(
      this.currentPage * this.pageSize,
      this.filteredTasks.length
    );
  }

  // Reset pagination when filters change
  onFilterChange(): void {
    this.currentPage = 1;
  }

  // Clear all filters
  clearFilters(): void {
    this.searchText = '';
    this.selectedStatus = 'All';
    this.selectedPriority = 'All';
    this.currentPage = 1;
  }

  // Next page
  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  // Previous page
  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  // Navigate to Add Task
  addTask(): void {
    this.router.navigate(['/tasks/new']);
  }

  // Navigate to Edit Task
  editTask(id: number): void {
    this.router.navigate(['/tasks/edit', id]);
  }

  // Delete Task - currently uses mock service
  deleteTask(id: number): void {
    if (typeof window === 'undefined') {
      return;
    }

    const isConfirmed = window.confirm(
      'Are you sure you want to delete this task?'
    );

    if (!isConfirmed) {
      return;
    }

    this.taskService.deleteTask(id).subscribe({
      next: (success) => {
        if (success) {
          this.loadTasks();

          this.showToast(
            'Task deleted successfully!',
            'success'
          );
        } else {
          this.showToast(
            'Task not found.',
            'error'
          );
        }
      },
      error: (error) => {
        console.error('Error deleting task:', error);

        this.showToast(
          'Unable to delete task.',
          'error'
        );
      }
    });
  }

  // Format API date
  formatDate(date: string): string {
    if (!date) {
      return '-';
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }

  // Display success/error notification
  showToast(
    message: string,
    type: 'success' | 'error'
  ): void {
    this.closeToast();

    if (type === 'success') {
      this.successMessage = message;
    } else {
      this.errorMessage = message;
    }

    this.toastTimer = setTimeout(() => {
      this.closeToast();
    }, 3000);
  }

  // Close notification
  closeToast(): void {
    if (this.toastTimer) {
      clearTimeout(this.toastTimer);
      this.toastTimer = undefined;
    }

    this.successMessage = '';
    this.errorMessage = '';
  }

  // Component cleanup
  ngOnDestroy(): void {
    if (this.toastTimer) {
      clearTimeout(this.toastTimer);
    }
  }
}
