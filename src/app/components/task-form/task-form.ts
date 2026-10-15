import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

@Component({
  selector: 'app-task-form',
  imports: [ReactiveFormsModule],
  templateUrl: './task-form.html',
  styleUrl: './task-form.css'
})
export class TaskForm {

  taskForm: FormGroup;

  constructor(private fb: FormBuilder) {

    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      priority: ['', Validators.required],
      status: ['', Validators.required],
      assignedToId: ['', Validators.required],
      dueDate: ['', Validators.required]
    });

  }
}