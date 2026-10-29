
import { Component, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import {
  TeamMember,
  TeamMemberRequest
} from '../../models/team-member';

import { TeamMemberService } from '../../services/team-member';

@Component({
  selector: 'app-team-members',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './team-members.html',
  styleUrl: './team-members.css'
})
export class TeamMembers implements OnInit {

  members = signal<TeamMember[]>([]);

  showAddForm = signal(false);
  editingMemberId = signal<number | null>(null);
  saving = signal(false);
  deletingMemberId = signal<number | null>(null);
  errorMessage = signal('');
  successMessage = signal('');

  memberForm: FormGroup;

  constructor(
    private teamMemberService: TeamMemberService,
    private fb: FormBuilder
  ) {
    this.memberForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email]],
      role: ['', [Validators.required, Validators.maxLength(50)]]
    });
  }

  ngOnInit(): void {
    this.loadMembers();
  }

  // GET all members
  loadMembers(): void {
    this.teamMemberService.getTeamMembers().subscribe({
      next: (data) => {
        this.members.set(data ?? []);
      },
      error: (error) => {
        console.error('Error loading members:', error);
        this.errorMessage.set('Unable to load team members.');
      }
    });
  }

  // Open form for adding a member
  openAddForm(): void {
    this.editingMemberId.set(null);
    this.memberForm.reset();
    this.errorMessage.set('');
    this.successMessage.set('');
    this.showAddForm.set(true);
  }

  // Open form for editing a member
  editMember(member: TeamMember): void {
    this.editingMemberId.set(member.id);

    this.memberForm.patchValue({
      name: member.name,
      email: member.email,
      role: member.role
    });

    this.errorMessage.set('');
    this.successMessage.set('');
    this.showAddForm.set(true);
  }

  cancelForm(): void {
    this.showAddForm.set(false);
    this.editingMemberId.set(null);
    this.memberForm.reset();
    this.errorMessage.set('');
  }

  // POST or PUT
  saveMember(): void {
    if (this.memberForm.invalid || this.saving()) {
      this.memberForm.markAllAsTouched();
      return;
    }

    const memberData: TeamMemberRequest = {
      name: this.memberForm.value.name.trim(),
      email: this.memberForm.value.email.trim(),
      role: this.memberForm.value.role.trim()
    };

    if (!memberData.name || !memberData.email || !memberData.role) {
      this.errorMessage.set('Please fill in all required fields.');
      return;
    }

    this.saving.set(true);
    this.errorMessage.set('');

    const id = this.editingMemberId();

    if (id !== null) {
      // PUT - Update member
      this.teamMemberService.updateTeamMember(id, memberData)
        .subscribe({
          next: () => {
            this.saving.set(false);
            this.cancelForm();
            this.successMessage.set('Team member updated successfully.');
            this.loadMembers();
          },
          error: (error) => {
            this.saving.set(false);
            console.error('Update failed:', error);
            this.errorMessage.set('Unable to update team member.');
          }
        });
    } else {
      // POST - Create member
      this.teamMemberService.createTeamMember(memberData)
        .subscribe({
          next: () => {
            this.saving.set(false);
            this.cancelForm();
            this.successMessage.set('Team member added successfully.');
            this.loadMembers();
          },
          error: (error) => {
            this.saving.set(false);
            console.error('Create failed:', error);
            this.errorMessage.set('Unable to create team member.');
          }
        });
    }
  }

  // DELETE member
  deleteMember(member: TeamMember): void {
    if (this.deletingMemberId() !== null) {
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete ${member.name}?`
    );

    if (!confirmed) return;

    this.errorMessage.set('');
    this.successMessage.set('');
    this.deletingMemberId.set(member.id);

    this.teamMemberService.deleteTeamMember(member.id).subscribe({
      next: () => {
        this.deletingMemberId.set(null);
        this.successMessage.set('Team member deleted successfully.');
        this.loadMembers();
      },
      error: (error) => {
        this.deletingMemberId.set(null);
        console.error('Delete failed:', error);

        if (error.status === 409) {
          this.errorMessage.set(
            'Cannot delete this member because tasks are assigned to them.'
          );
        } else {
          this.errorMessage.set('Unable to delete team member.');
        }
      }
    });
  }
}
