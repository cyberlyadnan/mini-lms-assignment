import { CourseWithInstructor } from '../types/course.types';
import { getItem } from './asyncStorage';
import { ENROLLED_COURSE_KEY } from './constants';

function placeholderCourse(id: string): CourseWithInstructor {
  const n = Number(id);
  return {
    id: Number.isFinite(n) ? n : 0,
    title: `Course #${id}`,
    description: 'Enroll again from Discover to refresh full details.',
    price: 0,
    discountPercentage: 0,
    rating: 0,
    stock: 0,
    brand: '',
    category: '',
    thumbnail: '',
    images: [],
    instructor: {
      id: 0,
      gender: '',
      name: { title: '', first: '', last: 'Unknown' },
      email: '',
      picture: { large: '', medium: '', thumbnail: '' },
    },
  };
}

/** Normalize legacy string[] or mixed storage into course-shaped entries. */
export async function loadEnrolledCourses(): Promise<CourseWithInstructor[]> {
  const raw = await getItem<unknown[]>(ENROLLED_COURSE_KEY);
  if (!raw?.length) return [];
  return raw.map((item) => {
    if (typeof item === 'string') {
      return placeholderCourse(item);
    }
    return item as CourseWithInstructor;
  });
}

export function enrolledIdsFromRaw(raw: unknown[] | null): string[] {
  if (!raw?.length) return [];
  return raw.map((item) => (typeof item === 'string' ? item : String((item as CourseWithInstructor).id)));
}
