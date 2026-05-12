export interface Simulation {
  icon: string;
  job: string;
  match: number;
}

export interface Profile {
  userId: string;
  name: string;
  email: string;
  interests: string[];
  simulations: Simulation[];
}