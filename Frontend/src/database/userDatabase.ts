// Frontend-compatible user database
// This replaces the Node.js backend database for frontend use

interface UserData {
  name: string;
  email: string;
  password?: string;
  userType: 'hunter' | 'agent';
  phoneNumber?: string;
  agentLicenseNumber?: string;
  createdAt?: string;
}

interface StoredUser extends UserData {
  id: string;
  passwordHash: string;
}

class UserDatabase {
  private users: StoredUser[] = [];
  private storageKey = 'property_hunter_users';

  constructor() {
    this.loadUsers();
  }

  private loadUsers() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        this.users = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load users from localStorage:', error);
      this.users = [];
    }
  }

  private saveUsers() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.users));
    } catch (error) {
      console.error('Failed to save users to localStorage:', error);
    }
  }

  emailExists(email: string): boolean {
    return this.users.some(user => user.email === email);
  }

  addUser(userData: UserData): StoredUser {
    if (this.emailExists(userData.email)) {
      throw new Error('Email already exists');
    }

    const id = `user-${Date.now()}`;
    const passwordHash = userData.password ? this.hashPassword(userData.password) : '';
    
    const newUser: StoredUser = {
      id,
      ...userData,
      passwordHash,
      createdAt: new Date().toISOString(),
    };
    delete newUser.password; // Remove plain password

    this.users.push(newUser);
    this.saveUsers();
    return newUser;
  }

  validateCredentials(email: string, password: string): StoredUser | undefined {
    const user = this.users.find(u => u.email === email);
    if (user && user.passwordHash && this.verifyPassword(password, user.passwordHash)) {
      return user;
    }
    return undefined;
  }

  // Simple password hashing (for demo purposes)
  private hashPassword(password: string): string {
    // In a real app, use a proper hashing library like bcrypt
    // This is a simple hash for demo purposes only
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
      const char = password.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString();
  }

  private verifyPassword(password: string, hash: string): boolean {
    return this.hashPassword(password) === hash;
  }
}

export default new UserDatabase();
