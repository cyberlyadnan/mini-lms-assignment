import { useQuery } from '@tanstack/react-query';
import { courseService } from '../services/courseService';

export const useCourses = (page: number = 1, limit: number = 20) => {
  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ['coursesWithInstructors', page, limit],
    queryFn: () => courseService.getCoursesWithInstructors(page, limit),
    staleTime: 5 * 60 * 1000, // 5 minutes caching
    retry: 2,
  });

  return {
    courses: data || [],
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  };
};
