import React, { createContext, useContext, useState, useEffect } from "react";
import * as initialData from "../data/newMockData";

// Define interfaces for our data types
export interface Simulation {
  id: string;
  name: string;
  code: string;
}

export interface Experiment {
  id: string;
  labId: string;
  institution: string;
  name: string;
  aim: string;
  theory: string;
  pretest: string;
  procedure: string;
  posttest: string;
  references: string;
  contributors: string;
  faqs: { question: string; answer: string }[];
  thumbnail: string;
  simulation?: Simulation[];
}

export interface Lab {
  id: string;
  name: string;
  description: string;
  discipline: string;
  targetAudience: string;
  courseAlignment: string;
  thumbnail: string;
  institution: string;
  institutionLogo: string;
  experimentCount: number;
  experiments: Experiment[];
}

export interface Department {
  id: number;
  name: string;
  institution: string;
  labCount: number;
  labs: Lab[];
}

// Define our context type
export interface DataContextType {
  departments: Department[];
  labs: Lab[];
  experiments: Experiment[];
  userProgress: Record<number, number>; // experimentId -> progress percentage
  userBookmarks: number[]; // experimentIds that are bookmarked
  userNotes: Record<number, string>; // experimentId -> notes

  // CRUD operations
  updateExperimentProgress: (experimentId: number, progress: number) => void;
  toggleBookmark: (experimentId: number) => void;
  saveNote: (experimentId: number, note: string) => void;

  // Data access helpers
  getDepartmentById: (id: number) => Department | undefined;
  getLabById: (id: string) => Lab | undefined;
  getExperimentById: (id: string) => Experiment | undefined;
  getLabsByDepartment: (departmentId: number) => Lab[];
  getExperimentsByLab: (labId: string) => Experiment[];
}

// Create the context
const DataContext = createContext<DataContextType | undefined>(undefined);

// Provider component
export const DataProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Initialize state with data from mock file and localStorage
  const [departments, setDepartments] = useState<Department[]>(() => {
    return initialData.departments;
  });

  // Extract labs and experiments from departments
  const [labs, setLabs] = useState<Lab[]>(() => {
    return departments.flatMap((dept) => dept.labs || []);
  });

  const [experiments, setExperiments] = useState<Experiment[]>(() => {
    return labs.flatMap((lab) => lab.experiments || []);
  });

  // Debugging logs
  console.log("Departments:", departments);
  console.log("Labs:", labs);
  console.log("Experiments:", experiments);

  // User-specific data
  const [userProgress, setUserProgress] = useState<Record<number, number>>(
    () => {
      const saved = localStorage.getItem("virtualLab_progress");
      return saved ? JSON.parse(saved) : {};
    }
  );

  const [userBookmarks, setUserBookmarks] = useState<number[]>(() => {
    const saved = localStorage.getItem("virtualLab_bookmarks");
    return saved ? JSON.parse(saved) : [];
  });

  const [userNotes, setUserNotes] = useState<Record<number, string>>(() => {
    const saved = localStorage.getItem("virtualLab_notes");
    return saved ? JSON.parse(saved) : {};
  });

  // Save to localStorage whenever user data changes
  useEffect(() => {
    localStorage.setItem("virtualLab_progress", JSON.stringify(userProgress));
  }, [userProgress]);

  useEffect(() => {
    localStorage.setItem("virtualLab_bookmarks", JSON.stringify(userBookmarks));
  }, [userBookmarks]);

  useEffect(() => {
    localStorage.setItem("virtualLab_notes", JSON.stringify(userNotes));
  }, [userNotes]);

  // CRUD operations
  const updateExperimentProgress = (experimentId: number, progress: number) => {
    setUserProgress((prev) => ({
      ...prev,
      [experimentId]: progress,
    }));
  };

  const toggleBookmark = (experimentId: number) => {
    setUserBookmarks((prev) => {
      if (prev.includes(experimentId)) {
        return prev.filter((id) => id !== experimentId);
      } else {
        return [...prev, experimentId];
      }
    });
  };

  const saveNote = (experimentId: number, note: string) => {
    setUserNotes((prev) => ({
      ...prev,
      [experimentId]: note,
    }));
  };

  // Helper functions to access data
  const getDepartmentById = (id: number) => {
    return departments.find((dept) => dept.id === id);
  };

  const getLabById = (id: string) => {
    return labs.find((lab) => lab.id === id);
  };

  const getExperimentById = (id: string) => {
    return experiments.find((exp) => exp.id === id);
  };

  const getLabsByDepartment = (departmentId: number) => {
    return labs.filter((lab) => {
      const dept = departments.find((d) => d.id === departmentId);
      return dept?.labs.some((l) => l.id === lab.id);
    });
  };

  const getExperimentsByLab = (labId: string) => {
    return experiments.filter((exp) => exp.labId === labId);
  };

  // Provide the context value
  const contextValue: DataContextType = {
    departments,
    labs,
    experiments,
    userProgress,
    userBookmarks,
    userNotes,
    updateExperimentProgress,
    toggleBookmark,
    saveNote,
    getDepartmentById,
    getLabById,
    getExperimentById,
    getLabsByDepartment,
    getExperimentsByLab,
  };

  return (
    <DataContext.Provider value={contextValue}>{children}</DataContext.Provider>
  );
};

// Custom hook to use the data context
export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};
