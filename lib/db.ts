import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

const DATA_DIR = join(process.cwd(), 'data');
const USERS_FILE = join(DATA_DIR, 'users.json');
const SESSIONS_FILE = join(DATA_DIR, 'sessions.json');
const INVITES_FILE = join(DATA_DIR, 'invites.json');
const HEALTH_DATA_FILE = join(DATA_DIR, 'health-data.json');

// Ensure data directory exists
if (!existsSync(DATA_DIR)) {
  mkdirSync(DATA_DIR, { recursive: true });
}

// Types
export interface User {
  id: string;
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'user';
  age?: number;
  weight?: number; // in kg
  height?: number; // in cm
  gender?: 'male' | 'female' | 'other';
  createdAt: string;
  onboardingComplete: boolean;
}

export interface Session {
  id: string;
  userId: string;
  expiresAt: string;
}

export interface Invite {
  id: string;
  token: string;
  email: string;
  createdBy: string;
  createdAt: string;
  usedAt?: string;
  usedBy?: string;
}

export interface HealthData {
  userId: string;
  bloodWork?: {
    uploadedAt: string;
    data: Record<string, unknown>;
  };
  healthKit?: {
    uploadedAt: string;
    stats: Record<string, unknown>;
    totalRecords: number;
    dateRange: string;
  };
}

// Helper functions to read/write JSON files
function readJsonFile<T>(filePath: string, defaultValue: T): T {
  try {
    if (existsSync(filePath)) {
      return JSON.parse(readFileSync(filePath, 'utf-8'));
    }
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
  }
  return defaultValue;
}

function writeJsonFile<T>(filePath: string, data: T): void {
  writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// Initialize admin user if not exists
function initializeAdmin() {
  const users = readJsonFile<User[]>(USERS_FILE, []);
  const adminExists = users.some(u => u.email === 'vision@mindvalley.com');

  if (!adminExists) {
    const adminUser: User = {
      id: uuidv4(),
      email: 'vision@mindvalley.com',
      passwordHash: bcrypt.hashSync('vibrant health', 10),
      firstName: 'Vishen',
      lastName: 'Lakhiani',
      role: 'admin',
      age: 49,
      gender: 'male',
      createdAt: new Date().toISOString(),
      onboardingComplete: true,
    };
    users.push(adminUser);
    writeJsonFile(USERS_FILE, users);
    console.log('Admin user created');
  }
}

// Initialize on module load
initializeAdmin();

// User functions
export function getUsers(): User[] {
  return readJsonFile<User[]>(USERS_FILE, []);
}

export function getUserById(id: string): User | undefined {
  const users = getUsers();
  return users.find(u => u.id === id);
}

export function getUserByEmail(email: string): User | undefined {
  const users = getUsers();
  return users.find(u => u.email.toLowerCase() === email.toLowerCase());
}

export function createUser(userData: Omit<User, 'id' | 'createdAt' | 'passwordHash'> & { password: string }): User {
  const users = getUsers();
  const newUser: User = {
    id: uuidv4(),
    email: userData.email,
    passwordHash: bcrypt.hashSync(userData.password, 10),
    firstName: userData.firstName,
    lastName: userData.lastName,
    role: userData.role,
    age: userData.age,
    weight: userData.weight,
    height: userData.height,
    gender: userData.gender,
    createdAt: new Date().toISOString(),
    onboardingComplete: userData.onboardingComplete,
  };
  users.push(newUser);
  writeJsonFile(USERS_FILE, users);
  return newUser;
}

export function updateUser(id: string, updates: Partial<User>): User | undefined {
  const users = getUsers();
  const index = users.findIndex(u => u.id === id);
  if (index === -1) return undefined;

  users[index] = { ...users[index], ...updates };
  writeJsonFile(USERS_FILE, users);
  return users[index];
}

export function verifyPassword(user: User, password: string): boolean {
  return bcrypt.compareSync(password, user.passwordHash);
}

// Session functions
export function getSessions(): Session[] {
  return readJsonFile<Session[]>(SESSIONS_FILE, []);
}

export function createSession(userId: string): Session {
  const sessions = getSessions();
  // Remove expired sessions
  const now = new Date();
  const validSessions = sessions.filter(s => new Date(s.expiresAt) > now);

  const newSession: Session = {
    id: uuidv4(),
    userId,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
  };
  validSessions.push(newSession);
  writeJsonFile(SESSIONS_FILE, validSessions);
  return newSession;
}

export function getSessionById(id: string): Session | undefined {
  const sessions = getSessions();
  const session = sessions.find(s => s.id === id);
  if (session && new Date(session.expiresAt) > new Date()) {
    return session;
  }
  return undefined;
}

export function deleteSession(id: string): void {
  const sessions = getSessions();
  const filtered = sessions.filter(s => s.id !== id);
  writeJsonFile(SESSIONS_FILE, filtered);
}

// Invite functions
export function getInvites(): Invite[] {
  return readJsonFile<Invite[]>(INVITES_FILE, []);
}

export function createInvite(email: string, createdBy: string): Invite {
  const invites = getInvites();
  const invite: Invite = {
    id: uuidv4(),
    token: uuidv4(),
    email,
    createdBy,
    createdAt: new Date().toISOString(),
  };
  invites.push(invite);
  writeJsonFile(INVITES_FILE, invites);
  return invite;
}

export function getInviteByToken(token: string): Invite | undefined {
  const invites = getInvites();
  return invites.find(i => i.token === token && !i.usedAt);
}

export function markInviteUsed(token: string, userId: string): void {
  const invites = getInvites();
  const index = invites.findIndex(i => i.token === token);
  if (index !== -1) {
    invites[index].usedAt = new Date().toISOString();
    invites[index].usedBy = userId;
    writeJsonFile(INVITES_FILE, invites);
  }
}

// Health data functions
export function getHealthData(): HealthData[] {
  return readJsonFile<HealthData[]>(HEALTH_DATA_FILE, []);
}

export function getUserHealthData(userId: string): HealthData | undefined {
  const allData = getHealthData();
  return allData.find(d => d.userId === userId);
}

export function saveUserHealthData(userId: string, data: Partial<HealthData>): HealthData {
  const allData = getHealthData();
  const index = allData.findIndex(d => d.userId === userId);

  if (index !== -1) {
    allData[index] = { ...allData[index], ...data };
    writeJsonFile(HEALTH_DATA_FILE, allData);
    return allData[index];
  } else {
    const newData: HealthData = { userId, ...data };
    allData.push(newData);
    writeJsonFile(HEALTH_DATA_FILE, allData);
    return newData;
  }
}
