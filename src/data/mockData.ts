// Common interfaces
export interface Department {
  id: number;
  name: string;
  institution: string;
  labCount: number;
}

export interface Lab {
  id: number;
  name: string;
  institution: string;
  institutionLogo: string;
  department: string;
  departmentId: number;
  experimentCount: number;
  description?: string;
  thumbnail?: string;
  targetAudience?: string;
  courseAlignment?: string;
}

export interface Experiment {
  id: number;
  title: string;
  description: string;
  duration: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  labId: number;
  lab: string;
  departmentId: number;
  department: string;
  progress?: number;
}

export interface Announcement {
  id: number;
  content: React.ReactNode | string;
}

export interface ExperimentCollection {
  id: number;
  title: string;
  department: string;
  images: string[];
}

export interface InProgressExperiment {
  id: number;
  title: string;
  department: string;
  progress: number;
}

// Dashboard data
export const announcements: Announcement[] = [
  {
    id: 1,
    content:
      "<p>Various projects/ICT initiatives of the Ministry of Education are available on the link given here. <a href='#' style='color: blue;'> Please click here for more details. </a></p>",
  },
  {
    id: 2,
    content:
      "<p>Please click here to see the tutorial for using the Flash-based Labs through Virtual Box.</p>",
  },
  {
    id: 3,
    content: "<p>To enroll as a Nodal Center, kindly submit the details.</p>",
  },
];

export const experimentCollections: ExperimentCollection[] = [
  {
    id: 1,
    title: "Basic Breadboard understanding",
    department: "Electronics & Communications",
    images: [
      "/assets/img/breadboard.jpg",
      "/assets/img/microchip.jpg",
      "/assets/img/ic.jpg",
      "/assets/img/circuit.jpg",
    ],
  },
  {
    id: 2,
    title: "Semester 1 Physics",
    department: "Electronics & Communications",
    images: [],
  },
];

export const departments: Department[] = [
  {
    id: 1,
    name: "Electronics & Communications",
    institution: "IIT Bombay",
    labCount: 16,
  },
  {
    id: 2,
    name: "Computer Science & Engineering",
    institution: "IIT Kharagpur",
    labCount: 9,
  },
  {
    id: 3,
    name: "Electrical Engineering",
    institution: "IIT Roorkee",
    labCount: 13,
  },
  {
    id: 4,
    name: "Biotechnology and Biomedical Engineering",
    institution: "IIIT Hyderabad",
    labCount: 17,
  },
  {
    id: 5,
    name: "Civil Engineering",
    institution: "IIIT Hyderabad",
    labCount: 16,
  },
];

export const inProgressExperiments: InProgressExperiment[] = [
  {
    id: 1,
    title: "Familiarization with general bread board",
    department: "Electronics and Communication Engineering",
    progress: 75,
  },
  {
    id: 2,
    title: "Uniform Cost Search",
    department: "Artificial Intelligence II",
    progress: 60,
  },
];

// Department page data
export const labsByDepartment: Record<number, Lab[]> = {
  1: [
    {
      id: 1,
      name: "Analog and Digital Electronics Lab - I (New)",
      institution: "IIT Roorkee",
      institutionLogo: "/assets/img/institutions/iit-roorkee.png",
      department: "Electronics & Communications",
      departmentId: 1,
      experimentCount: 13,
    },
    {
      id: 2,
      name: "Analog Electronics Circuits Virtual Lab",
      institution: "IIT Kharagpur",
      institutionLogo: "/assets/img/institutions/iit-kharagpur.png",
      department: "Electronics & Communications",
      departmentId: 1,
      experimentCount: 6,
    },
    {
      id: 3,
      name: "Analog Electronics Lab",
      institution: "IIT Roorkee",
      institutionLogo: "/assets/img/institutions/iit-roorkee.png",
      department: "Electronics & Communications",
      departmentId: 1,
      experimentCount: 16,
    },
    {
      id: 4,
      name: "Digital Applications Lab",
      institution: "IIT Bombay",
      institutionLogo: "/assets/img/institutions/iit-bombay.png",
      department: "Electronics & Communications",
      departmentId: 1,
      experimentCount: 4,
    },
    {
      id: 5,
      name: "Digital Electronic Circuits Lab",
      institution: "IIT Kharagpur",
      institutionLogo: "/assets/img/institutions/iit-kharagpur.png",
      department: "Electronics & Communications",
      departmentId: 1,
      experimentCount: 18,
    },
    {
      id: 6,
      name: "Hybrid Electronics Lab",
      institution: "COEP Technological University Pune",
      institutionLogo: "/assets/img/institutions/coep.png",
      department: "Electronics & Communications",
      departmentId: 1,
      experimentCount: 17,
    },
    {
      id: 7,
      name: "Digital Electronics Lab-II",
      institution: "IIT Guwahati",
      institutionLogo: "/assets/img/institutions/iit-guwahati.png",
      department: "Electronics & Communications",
      departmentId: 1,
      experimentCount: 12,
    },
  ],
  2: [
    {
      id: 101,
      name: "Operating Systems Lab",
      description:
        "The Operating Systems Lab provides hands-on learning on OS concepts, including process scheduling, memory management, and file systems.",
      institution: "IIT Madras",
      institutionLogo: "/assets/img/institutions/iit-madras.png",
      department: "Computer Science",
      departmentId: 2,
      experimentCount: 8,
      thumbnail: "/uploads/labs/thumbnails/OS.png",
      targetAudience: "UG - 2nd & 3rd Year BTech/BE students",
      courseAlignment: "Anna University OS Lab & JNTU OS Lab",
    },
    {
      id: 102,
      name: "Computer Networks Lab",
      description:
        "The Computer Networks Lab focuses on protocols, routing, and network security. It helps students understand data transmission and networking principles.",
      institution: "IIT Kharagpur",
      institutionLogo: "/assets/img/institutions/iit-kharagpur.png",
      department: "Computer Science",
      departmentId: 2,
      experimentCount: 12,
      thumbnail: "/uploads/labs/thumbnails/Networks.png",
      targetAudience: "UG - 2nd & 3rd Year BTech/BE students",
      courseAlignment: "NIT Trichy Networks Lab",
    },
    {
      id: 105,
      name: "Artificial Intelligence Lab",
      description:
        "Explore AI concepts such as machine learning, neural networks, and reinforcement learning.",
      institution: "IIT Bombay",
      institutionLogo: "/assets/img/institutions/iit-bombay.png",
      department: "Computer Science",
      departmentId: 2,
      experimentCount: 10,
      thumbnail: "/uploads/labs/thumbnails/AI.png",
      targetAudience: "UG - 3rd & 4th Year BTech/BE students",
      courseAlignment: "IIT Bombay AI Course",
    },
  ],
  3: [
    {
      id: 103,
      name: "Embedded Systems Lab",
      description:
        "This lab helps students learn microcontroller programming, real-time operating systems, and hardware-software co-design.",
      institution: "IIT Kanpur",
      institutionLogo: "/assets/img/institutions/iit-kanpur.png",
      department: "Electronics & Communication",
      departmentId: 3,
      experimentCount: 15,
      thumbnail: "/uploads/labs/thumbnails/Embedded.png",
      targetAudience: "UG - 2nd & 3rd Year BTech/BE students",
      courseAlignment: "IIT Kanpur Embedded Systems Course",
    },
    {
      id: 104,
      name: "Digital Signal Processing Lab",
      description:
        "Learn signal processing concepts such as FFT, filters, and image processing techniques.",
      institution: "IIT Delhi",
      institutionLogo: "/assets/img/institutions/iit-delhi.png",
      department: "Electronics & Communication",
      departmentId: 3,
      experimentCount: 14,
      thumbnail: "/uploads/labs/thumbnails/DSP.png",
      targetAudience: "UG - 3rd & 4th Year BTech/BE students",
      courseAlignment: "IIT Delhi DSP Lab",
    },
  ],
  // Keep the other departments
};

// Lab page data
export const experimentsByLab: Record<number, Experiment[]> = {
  1: [
    {
      id: 1,
      title: "RC Circuit Analysis",
      description:
        "Study the charging and discharging of capacitors in RC circuits",
      duration: "45 minutes",
      difficulty: "Beginner",
      labId: 1,
      lab: "Analog and Digital Electronics Lab - I (New)",
      departmentId: 1,
      department: "Electronics & Communications",
    },
    {
      id: 2,
      title: "RL Circuit Analysis",
      description: "Analyze the transient response of RL circuits",
      duration: "60 minutes",
      difficulty: "Intermediate",
      labId: 1,
      lab: "Analog and Digital Electronics Lab - I (New)",
      departmentId: 1,
      department: "Electronics & Communications",
    },
    {
      id: 3,
      title: "RLC Circuit Resonance",
      description: "Investigate resonance in RLC circuits",
      duration: "75 minutes",
      difficulty: "Advanced",
      labId: 1,
      lab: "Analog and Digital Electronics Lab - I (New)",
      departmentId: 1,
      department: "Electronics & Communications",
    },
  ],
  // Add more labs as needed
};

// Utility functions
export const getExperimentById = (id: number): Experiment | undefined => {
  const allExperiments = Object.values(experimentsByLab).flat();
  return allExperiments.find((exp) => exp.id === id);
};

export const getLabById = (id: number): Lab | undefined => {
  const allLabs = Object.values(labsByDepartment).flat();
  return allLabs.find((lab) => lab.id === id);
};

export const getDepartmentById = (id: number): Department | undefined => {
  return departments.find((dept) => dept.id === id);
};

export const getLabsByDepartmentName = (departmentName: string): Lab[] => {
  const allLabs = Object.values(labsByDepartment).flat();
  return allLabs.filter((lab) => lab.department === departmentName);
};

export const getExperimentsByLabName = (labName: string): Experiment[] => {
  const allExperiments = Object.values(experimentsByLab).flat();
  return allExperiments.filter((exp) => exp.lab === labName);
};
