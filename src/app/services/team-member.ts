import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  TeamMember,
  TeamMemberRequest
} from '../models/team-member';

@Injectable({
  providedIn: 'root'
})
export class TeamMemberService {

  private apiUrl = 'https://localhost:7039/api/TeamMembers';

  constructor(private http: HttpClient) {}

  // GET - All team members
  getTeamMembers(): Observable<TeamMember[]> {
    return this.http.get<TeamMember[]>(this.apiUrl);
  }

  // GET - Team member by ID
  getTeamMemberById(id: number): Observable<TeamMember> {
    return this.http.get<TeamMember>(`${this.apiUrl}/${id}`);
  }

  // POST - Add team member
  createTeamMember(
    member: TeamMemberRequest
  ): Observable<TeamMember> {
    return this.http.post<TeamMember>(this.apiUrl, member);
  }

  // PUT - Update team member
  updateTeamMember(
    id: number,
    member: TeamMemberRequest
  ): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, member);
  }

  // DELETE - Remove team member
  deleteTeamMember(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}