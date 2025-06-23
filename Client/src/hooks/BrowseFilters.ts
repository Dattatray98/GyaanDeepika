import { useMemo } from 'react';
import type { Course } from '../components/Common/Types';

// Exported so you can reuse these in dropdowns
export const categories = ['All', 'Programming', 'Design', 'Business', 'Language', 'Other'];
export const levels = ['All', 'Beginner', 'Intermediate', 'Advanced'];

// Map UI category labels to actual categories in the course data
const categoryMap: { [key: string]: string[] } = {
    Programming: ['Web Development', 'Full Stack Development', 'Frontend', 'Backend', 'MERN'],
    Design: ['UI/UX Design', 'Graphic Design'],
    Business: ['Business', 'Entrepreneurship', 'Marketing'],
    Language: ['Language Learning', 'English'],
    Other: ['Personal Development', 'Productivity']
};

interface UseFilteredCoursesProps {
    courses: Course[];
    searchTerm: string;
    selectedCategory: string;
    selectedLevel: string;
}

export function useFilteredCourses({
    courses,
    searchTerm,
    selectedCategory,
    selectedLevel
}: UseFilteredCoursesProps): Course[] {
    return useMemo(() => {
        return courses.filter((course) => {
         
            const matchesSearch =
                course.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                course.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                course.subtitle?.toLowerCase().includes(searchTerm.toLowerCase());


            const matchesCategory =
                selectedCategory === 'All' ||
                (categoryMap[selectedCategory]?.includes(course.category) ?? false);
                console.log(selectedCategory)


            const matchesLevel =
                selectedLevel === 'All' ||
                course.level?.toLowerCase() === selectedLevel.toLowerCase();

            return matchesSearch && matchesCategory && matchesLevel;
        });
    }, [courses, searchTerm, selectedCategory, selectedLevel]);
}
