
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { ActivatedRoute, Router } from '@angular/router';

import { TeamMember } from '../../models/team-member';
import { TeamMemberService } from '../../services/team-member';
import { TaskService } from '../../services/task';
import { Task } from '../../models/task';

@Component({
  selector: 'app-task-form',
  imports: [ReactiveFormsModule],
  templateUrl: './task-form.html',
  styleUrl: './task-form.css'
})
export class TaskForm implements OnInit {

  taskForm: FormGroup;
  teamMembers: TeamMember[] = [];

  isEditMode = false;
  taskId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private teamMemberService: TeamMemberService,
    private taskService: TaskService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      priority: ['', Validators.required],
      status: ['', Validators.required],
      assignedToId: [null, Validators.required],
      dueDate: ['', Validators.required]
    });
  }

ngOnInit(): void {
  this.loadTeamMembers();

  const id = this.route.snapshot.paramMap.get('id');

  if (id !== null) {
    this.isEditMode = true;
    this.taskId = Number(id);
    this.loadTask(this.taskId);
  }
}

  loadTeamMembers(): void {
    this.teamMemberService.getTeamMembers().subscribe({
      next: (data) => {
        this.teamMembers = data;
      },
      error: (error) => {
        console.error('Error loading team members:', error);
      }
    });
  }

loadTask(id: number): void {
  this.taskService.getTaskById(id).subscribe({
    next: (task) => {
      console.log('Task details from API:', task);

      this.taskForm.patchValue({
        title: task.title,
        description: task.description,
        priority: task.priority,
        status: task.status,
        assignedToId: task.assignedToId,
        dueDate: task.dueDate
          ? task.dueDate.substring(0, 10)
          : ''
      });
    },
    error: (error) => {
      console.error('Error loading task:', error);
    }
  });
}

  // saveTask(): void {

  //   if (this.taskForm.invalid) {
  //     this.taskForm.markAllAsTouched();
  //     return;
  //   }
  saveTask(): void {

  console.log('Save button clicked');

  console.log('Form valid:', this.taskForm.valid);

  console.log('Form values:', this.taskForm.value);

  if (this.taskForm.invalid) {
    this.taskForm.markAllAsTouched();

    console.log('Form errors:', 
      Object.keys(this.taskForm.controls)
        .filter(key => this.taskForm.get(key)?.invalid)
    );

    return;
  }

  // Keep your existing code below unchanged.


    const formValue = this.taskForm.value;

    const selectedMember = this.teamMembers.find(
      member => member.id === Number(formValue.assignedToId)
    );

    const taskData: Omit<Task, 'id'> = {
      title: formValue.title,
      description: formValue.description,
      priority: formValue.priority,
      status: formValue.status,
      assignedToId: Number(formValue.assignedToId),
      assignedToName: selectedMember?.name ?? '',
      dueDate: formValue.dueDate
    };

    if (this.isEditMode && this.taskId !== null) {

      // Update existing task
      this.taskService.updateTask(this.taskId, taskData)
        .subscribe({
          next: (success) => {
            if (success) {
              this.router.navigate(['/tasks'], {
                state: {
                  message: 'Task updated successfully!'
                }
              });
            } else {
              console.error('Task not found');
            }
          },
          error: (error) => {
            console.error('Error updating task:', error);
          }
        });

    } else {

      // Create new task
      this.taskService.createTask(taskData)
        .subscribe({
          next: () => {
            this.router.navigate(['/tasks'], {
              state: {
                message: 'Task created successfully!'
              }
            });
          },
          error: (error) => {
            console.error('Error creating task:', error);
          }
        });
    }
  }
  cancel(): void {
  this.router.navigate(['/tasks']);
}
}

