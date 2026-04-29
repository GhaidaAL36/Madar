export interface User {
  name: string;
  email: string;
  initials: string;
}

export interface Simulation {
  icon: string;
  job: string;
  match: number;
}

export interface Profile {
  user: User;
  interests: string[];
  simulations: Simulation[];
}