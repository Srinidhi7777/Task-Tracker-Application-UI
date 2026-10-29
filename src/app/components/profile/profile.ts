
import { Component } from '@angular/core';

@Component({
  selector: 'app-profile',
  imports: [],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile {

  user = {
    name: 'Sri Nidhi',
    email: 'srinidhi@example.com',
    role: 'Team Member',
    department: 'Development',
    location: 'Chennai',
    joinedDate: '2026-09-01'
  };

  isEditMode = false;

  editProfile(): void {
    this.isEditMode = true;
  }

  cancelEdit(): void {
    this.isEditMode = false;
  }

  saveProfile(): void {
    this.isEditMode = false;
  }

  get initials(): string {
    return this.user.name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase();
  }
}
