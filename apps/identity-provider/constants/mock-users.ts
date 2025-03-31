
// Define an interface for user credentials
interface UserCredentials {
  username: string;
  password: string;
  name: string;
  email: string;
}

// Mock user data (replace with a database in a real app)
export const mockUsers: UserCredentials[] = [
  {
    username: "testuser1",
    password: "password123",
    name: "Test User One",
    email: "testuser1@example.com",
  },
  {
    username: "johndoe",
    password: "securepass",
    name: "John Doe",
    email: "john.doe@example.com",
  },
  {
    username: "janedoe",
    password: "janepass",
    name: "Jane Doe",
    email: "jane.doe@example.com",
  },
  {
    username: "admin",
    password: "adminpass",
    name: "Administrator",
    email: "admin@example.com",
  },
  {
    username: "user",
    password: "userpass",
    name: "Regular User",
    email: "user@example.com",
  },
];
