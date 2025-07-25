export type UserData = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  enrolledCourses: string[];
  progress: Record<string, CourseProgress>;
  mobile?: string;
  language?: string;
  bio?: string;
  role: 'admin' | 'student' | 'instructor';
};

export type CourseProgress = {
  completionPercentage: number;
  currentcontentId?: string;
  currentVideoProgress?: number;
  lastAccessed?: string;
};

export type Course = {
  _id: string;
  title: string;
  description: string;
  thumbnail: string;
  students: number;
  contents: CourseContent[];
  instructor: {
    bio: string;
    rating: number;
    students: number;
    _id: string;
    name: string;
    avatar: string;
  };
  rating: number;
  totalStudents: number;
  duration: string;
  level: string;
  category: string;
  price: number;
  content: CourseSection[];
  announcements: Announcement[];
  totalProgress?: number;
  subtitle?: string;
  progress?: {
    completionPercentage: number;
    lastAccessed?: string;
    currentVideoId?: string;
    currentVideoProgress?: number;
  };
  language?: string;
  lastUpdated?: string;
  learningOutcomes?: string[];
  requirements?: string[];
  resources?: Resource[];
  completedLessons?: number;
  totalLessons?: number;
  estimatedTime?: string;
  course?: {
    content?: CourseSection[];
  };
};

export type CourseSection = {
  _id: string;
  title: string;
  description?: string;
  duration: string;
  lessons: number;
  completed: number;
  locked: boolean;
  content: CourseContent[];
};

export interface Announcement {
  _id: string;
  title: string;
  content: string;
  date: string;
  important: boolean;
};



export interface instructor {
  _id: string;
  name: string;
  avatar?: string;
  email?: string;
  bio?: string;
  rating?: number;
  students?: number;
}

export interface NavigationItem {
  icon: React.ReactNode;
  label: string;
  value: string;
  path: string;
}

export interface Quiz {
  _id: string | undefined;
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface Resource {
  _id: string;
  title: string;
  type: string;
  size: string;
  downloadUrl: string;
}

export interface ApiResponse {
  course: Course;
  content: CourseContent;
}

export interface SummaryResponse {
  data: {
    summaryText: string;
  };
}

export interface CourseContent {
  type: string;
  _id: string;
  title: string;
  description: string;
  videoUrl: string;
  duration: number;
  isCompleted: boolean;
  contentType: string;
  content?: string;
  sectionId: string;
  completed: boolean;
  preview?: boolean;
  notes?: string;
  resources?: string[];
  quizzes?: Quiz[];
  PdfViewUrl?: string;
  PdfDownloadUrl?: string;
}

export interface StudyHub {
  id: string;
  title: string;
  type: 'notes' | 'papers' | 'formulas' | 'videos';
  examType: string;
  subject: string;
  year: string;
  downloads: number;
  rating: number;
  description: string;
}
