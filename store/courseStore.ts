import { create } from 'zustand';
import { CourseWithInstructor, BookmarkedCourse } from '../types/course.types';
import { courseService } from '../services/courseService';
import { saveItem, getItem } from '../utils/asyncStorage';
import { ASYNC_KEYS } from '../utils/constants';

interface CourseState {
  courses: CourseWithInstructor[];
  bookmarks: BookmarkedCourse[];
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
}

interface CourseActions {
  fetchCourses: (page?: number, limit?: number) => Promise<void>;
  toggleBookmark: (course: CourseWithInstructor) => Promise<void>;
  setSearchQuery: (query: string) => void;
  getFilteredCourses: () => CourseWithInstructor[];
  loadBookmarks: () => Promise<void>;
}

export const useCourseStore = create<CourseState & CourseActions>((set, get) => ({
  courses: [],
  bookmarks: [],
  isLoading: false,
  error: null,
  searchQuery: '',

  fetchCourses: async (page = 1, limit = 10) => {
    set({ isLoading: true, error: null });
    try {
      const coursesWithInstructors = await courseService.getCoursesWithInstructors(page, limit);
      
      set((state) => ({
        courses: page === 1 ? coursesWithInstructors : [...state.courses, ...coursesWithInstructors],
        isLoading: false,
      }));
    } catch (error: any) {
      set({ 
        error: error.message || 'Failed to fetch courses', 
        isLoading: false 
      });
    }
  },

  toggleBookmark: async (course: CourseWithInstructor) => {
    const { bookmarks } = get();
    const isBookmarked = bookmarks.some((b) => b.id === course.id);
    
    let updatedBookmarks;
    if (isBookmarked) {
      updatedBookmarks = bookmarks.filter((b) => b.id !== course.id);
    } else {
      updatedBookmarks = [...bookmarks, { ...course, bookmarkedAt: new Date().toISOString() }];
    }

    set({ bookmarks: updatedBookmarks });
    await saveItem(ASYNC_KEYS.BOOKMARKS_KEY, updatedBookmarks);
  },

  setSearchQuery: (query: string) => {
    set({ searchQuery: query });
  },

  getFilteredCourses: () => {
    const { courses, searchQuery } = get();
    if (!searchQuery.trim()) return courses;
    
    const lowerQuery = searchQuery.toLowerCase();
    return courses.filter((course) => 
      course.title.toLowerCase().includes(lowerQuery) || 
      course.description.toLowerCase().includes(lowerQuery) ||
      (course.instructor?.name?.first || '').toLowerCase().includes(lowerQuery) ||
      (course.instructor?.name?.last || '').toLowerCase().includes(lowerQuery)
    );
  },

  loadBookmarks: async () => {
    try {
      const savedBookmarks = await getItem<BookmarkedCourse[]>(ASYNC_KEYS.BOOKMARKS_KEY);
      if (savedBookmarks) {
        set({ bookmarks: savedBookmarks });
      }
    } catch {
      set({ bookmarks: [] });
    }
  }
}));
