export interface Department {
  id: number;
  name: string;
  description: string;
  imageUrl?: string;
}

export interface Lab {
  id: number;
  name: string;
  description: string;
  departmentId: number;
  institution: string;
  experimentCount: number;
  imageUrl?: string;
}

export interface Experiment {
  id: number;
  title: string;
  description: string;
  labId: number;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
  simulationCode?: string;
  theory?: string;
  procedure?: string;
  objectives?: string[];
}

export interface UserCollection {
  id: number;
  name: string;
  experimentIds: number[];
}

export interface StickyNote {
  id: string;
  text: string;
  color: string;
  experimentId: string;
  createdAt: string;
  isNew?: boolean;
}
