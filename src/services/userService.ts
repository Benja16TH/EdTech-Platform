import { User } from '../types';
import { mockUsers } from '../data/mockData';
import { mockCollaborators } from '../data/extendedMockData';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
// v2.0.2 — Supabase-aware. Reads from public.users when configured,
// falls back to mock data otherwise.

const mockWithPasswords = mockUsers.map(u => ({ ...u, active: true }));
const extraCollaborators = mockCollaborators
  .filter(c => !['1', '2', '3'].includes(c.id))
  .map(c => ({ ...c, password: 'password123', active: true }));
let usersData: User[] = [...mockWithPasswords, ...extraCollaborators];

function mapRow(row: Record<string, unknown>): User {
  return {
    id: row.id as string,
    email: row.email as string,
    name: row.name as string,
    role: row.role as 'admin' | 'collaborator',
    position: row.position as string | undefined,
    department: row.department as string | undefined,
    active: (row.active as boolean) ?? true,
    createdAt: row.created_at ? new Date(row.created_at as string) : undefined,
  };
}

export async function getUsers(): Promise<User[]> {
  if (isSupabaseConfigured()) {
    const { data, error } = await supabase!.from('users').select('*').order('created_at', { ascending: false });
    if (!error && data) return data.map(mapRow);
  }
  return [...usersData];
}

export async function getUserById(userId: string): Promise<User | undefined> {
  if (isSupabaseConfigured()) {
    const { data, error } = await supabase!.from('users').select('*').eq('id', userId).single();
    if (!error && data) return mapRow(data);
  }
  return usersData.find(u => u.id === userId);
}

export async function createUser(userData: Omit<User, 'id'> & { id?: string }): Promise<User> {
  if (isSupabaseConfigured()) {
    const row = {
      id: userData.id || crypto.randomUUID(),
      email: userData.email,
      name: userData.name,
      role: userData.role,
      position: userData.position || null,
      department: userData.department || null,
      active: userData.active ?? true,
      created_at: new Date().toISOString(),
    };
    const { data, error } = await supabase!.from('users').insert(row).select().single();
    if (!error && data) {
      const user = mapRow(data);
      usersData = [...usersData, user];
      return user;
    }
  }
  const newUser: User = {
    ...userData,
    id: userData.id || `user_${Date.now()}`,
    createdAt: new Date(),
  };
  usersData = [...usersData, newUser];
  return newUser;
}

export async function updateUser(userId: string, userData: Partial<User>): Promise<User | null> {
  if (isSupabaseConfigured()) {
    const payload: Record<string, unknown> = {};
    if (userData.name !== undefined) payload.name = userData.name;
    if (userData.email !== undefined) payload.email = userData.email;
    if (userData.role !== undefined) payload.role = userData.role;
    if (userData.position !== undefined) payload.position = userData.position;
    if (userData.department !== undefined) payload.department = userData.department;
    if (userData.active !== undefined) payload.active = userData.active;

    const { data, error } = await supabase!.from('users').update(payload).eq('id', userId).select().single();
    if (!error && data) {
      const user = mapRow(data);
      const idx = usersData.findIndex(u => u.id === userId);
      if (idx !== -1) usersData = [...usersData.slice(0, idx), user, ...usersData.slice(idx + 1)];
      return user;
    }
  }
  const index = usersData.findIndex(u => u.id === userId);
  if (index === -1) return null;
  const updated = { ...usersData[index], ...userData };
  usersData = [...usersData.slice(0, index), updated, ...usersData.slice(index + 1)];
  return updated;
}

export async function deleteUser(userId: string): Promise<boolean> {
  if (isSupabaseConfigured()) {
    const { error } = await supabase!.from('users').delete().eq('id', userId);
    if (!error) {
      usersData = usersData.filter(u => u.id !== userId);
      return true;
    }
    return false;
  }
  const index = usersData.findIndex(u => u.id === userId);
  if (index === -1) return false;
  usersData = [...usersData.slice(0, index), ...usersData.slice(index + 1)];
  return true;
}
