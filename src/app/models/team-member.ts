export interface TeamMember {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export interface TeamMemberRequest {
  name: string;
  email: string;
  role: string;
}