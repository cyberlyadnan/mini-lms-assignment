export interface Course {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
}

export interface Instructor {
  id: number;
  gender: string;
  name: {
    title: string;
    first: string;
    last: string;
  };
  email: string;
  location?: {
    street?: { number: number, name: string },
    city?: string,
    state?: string,
    country?: string,
    postcode?: number | string
  };
  phone?: string;
  cell?: string;
  dob?: { date: string, age: number };
  registered?: { date: string, age: number };
  nat?: string;
  picture: {
    large: string;
    medium: string;
    thumbnail: string;
  };
}

export interface CourseWithInstructor extends Course {
  instructor: Instructor;
}

export interface BookmarkedCourse extends CourseWithInstructor {
  bookmarkedAt: string;
}
