import { apiClient } from './api';
import { Course, Instructor, CourseWithInstructor } from '../types/course.types';
import { PaginatedResponse } from '../types/api.types';

export const courseService = {
  getCourses: async (page: number = 1, limit: number = 10): Promise<PaginatedResponse<Course>> => {
    const response = await apiClient.get<PaginatedResponse<Course>>('/api/v1/public/randomproducts', {
      params: { page, limit }
    });
    return response.data;
  },

  getInstructors: async (page: number = 1, limit: number = 10): Promise<PaginatedResponse<Instructor>> => {
    const response = await apiClient.get<PaginatedResponse<Instructor>>('/api/v1/public/randomusers', {
      params: { page, limit }
    });
    return response.data;
  },

  getCoursesWithInstructors: async (page: number = 1, limit: number = 10): Promise<CourseWithInstructor[]> => {
    const [coursesRes, instructorsRes] = await Promise.all([
      courseService.getCourses(page, limit),
      courseService.getInstructors(page, limit)
    ]);

    const courses = coursesRes.data?.data || [];
    const instructors = instructorsRes.data?.data || [];

    return courses.map((course, index) => ({
      ...course,
      instructor: instructors[index] || null
    }));
  }
};
