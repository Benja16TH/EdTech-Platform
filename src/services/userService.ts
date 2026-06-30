import { User } from '../types';
import { mockUsers } from '../data/mockData';
import { mockCollaborators } from '../data/extendedMockData';
// v2.0.1 — Prepared for Supabase migration. When ready, replace in-memory
// operations with supabase.from('users') queries from src/lib/supabaseClient.ts.

const mockWithPasswords = mockUsers.map(u => ({ ...u, active: true }));
const extraCollaborators = mockCollaborators
  .filter(c => !['1', '2', '3'].includes(c.id))
  .map(c => ({ ...c, password: 'password123', active: true }));
let usersData: User[] = [...mockWithPasswords, ...extraCollaborators];

export function getUsers(): Promise<User[]> {
  return Promise.resolve([...usersData]);
}

export function getUserById(userId: string): Promise<User | undefined> {
  return Promise.resolve(usersData.find(u => u.id === userId));
}

export function createUser(userData: Omit<User, 'id'> & { id?: string }): Promise<User> {
  const newUser: User = {
    ...userData,
    id: userData.id || `user_${Date.now()}`,
    createdAt: new Date(),
  };
  usersData = [...usersData, newUser];
  return Promise.resolve(newUser);
}

export function updateUser(userId: string, userData: Partial<User>): Promise<User | null> {
  const index = usersData.findIndex(u => u.id === userId);
  if (index === -1) return Promise.resolve(null);
  const updated = { ...usersData[index], ...userData };
  usersData = [...usersData.slice(0, index), updated, ...usersData.slice(index + 1)];
  return Promise.resolve(updated);
}

export function deleteUser(userId: string): Promise<boolean> {
  const index = usersData.findIndex(u => u.id === userId);
  if (index === -1) return Promise.resolve(false);
  usersData = [...usersData.slice(0, index), ...usersData.slice(index + 1)];
  return Promise.resolve(true);
}
