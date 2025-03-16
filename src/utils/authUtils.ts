
import { User } from "@/types";

// Mock user data for demonstration
const MOCK_USERS = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    password: "password123",
    avatar: "/placeholder.svg",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    password: "password123",
    avatar: "/placeholder.svg",
  },
];

export const registerUser = (name: string, email: string, password: string): Promise<User> => {
  return new Promise((resolve, reject) => {
    // Check if user already exists
    const existingUser = MOCK_USERS.find(user => user.email === email);
    if (existingUser) {
      reject(new Error("User already exists"));
      return;
    }

    // In a real app, we would send this to a backend API
    // For now, we'll simulate creating a user
    const newUser: User = {
      id: String(MOCK_USERS.length + 1),
      name,
      email,
      avatar: "/placeholder.svg",
    };
    
    // Store in localStorage for persistence across page reloads
    localStorage.setItem("currentUser", JSON.stringify(newUser));
    
    // Simulate API delay
    setTimeout(() => resolve(newUser), 500);
  });
};

export const loginUser = (email: string, password: string): Promise<User> => {
  return new Promise((resolve, reject) => {
    // In a real app, we would send this to a backend API
    // For now, we'll check against our mock data
    const user = MOCK_USERS.find(
      user => user.email === email && user.password === password
    );
    
    if (!user) {
      reject(new Error("Invalid credentials"));
      return;
    }
    
    const userData: User = {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
    };
    
    // Store in localStorage for persistence across page reloads
    localStorage.setItem("currentUser", JSON.stringify(userData));
    
    // Simulate API delay
    setTimeout(() => resolve(userData), 500);
  });
};

export const logoutUser = (): Promise<void> => {
  return new Promise((resolve) => {
    localStorage.removeItem("currentUser");
    // Simulate API delay
    setTimeout(resolve, 300);
  });
};

export const getCurrentUser = (): User | null => {
  const userJson = localStorage.getItem("currentUser");
  if (!userJson) return null;
  
  try {
    return JSON.parse(userJson) as User;
  } catch {
    return null;
  }
};

export const isAuthenticated = (): boolean => {
  return getCurrentUser() !== null;
};
