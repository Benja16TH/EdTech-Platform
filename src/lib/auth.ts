import { supabase, isSupabaseConfigured } from './supabaseClient';
import type { User } from '../types';

function mapProfileToUser(data: Record<string, unknown>): User {
  return {
    id: data.id as string,
    email: data.email as string,
    name: data.name as string,
    role: data.role as 'admin' | 'collaborator',
    position: data.position as string | undefined,
    department: data.department as string | undefined,
    active: (data.active as boolean) ?? true,
    createdAt: data.created_at ? new Date(data.created_at as string) : undefined,
  };
}

export async function signInWithSupabase(
  email: string,
  password: string
): Promise<{ user: User | null; error: string | null }> {
  if (!isSupabaseConfigured()) {
    return { user: null, error: null };
  }

  const { data: authData, error: authError } = await supabase!.auth.signInWithPassword({
    email,
    password,
  });

  if (authError) {
    return { user: null, error: authError.message };
  }

  if (!authData.user) {
    return { user: null, error: 'No se pudo autenticar el usuario' };
  }

  const { data: profile, error: profileError } = await supabase!
    .from('users')
    .select('*')
    .eq('id', authData.user.id)
    .single();

  if (profileError || !profile) {
    return { user: null, error: 'Perfil de usuario no encontrado en la base de datos' };
  }

  return { user: mapProfileToUser(profile), error: null };
}

export async function signOutFromSupabase(): Promise<void> {
  if (isSupabaseConfigured()) {
    await supabase!.auth.signOut();
  }
}

export async function getCurrentSession(): Promise<{ user: User | null; error: string | null }> {
  if (!isSupabaseConfigured()) {
    return { user: null, error: null };
  }

  const { data: authData, error: authError } = await supabase!.auth.getUser();

  if (authError || !authData?.user) {
    return { user: null, error: authError?.message || null };
  }

  const { data: profile } = await supabase!
    .from('users')
    .select('*')
    .eq('id', authData.user.id)
    .single();

  if (!profile) {
    return { user: null, error: 'Perfil de usuario no encontrado' };
  }

  return { user: mapProfileToUser(profile), error: null };
}

export async function signUpWithSupabase(
  name: string,
  email: string,
  password: string,
  role: 'admin' | 'collaborator',
): Promise<{ user: User | null; error: string | null }> {
  if (!isSupabaseConfigured()) {
    return { user: null, error: 'Supabase no está configurado' };
  }

  const { data: authData, error: authError } = await supabase!.auth.signUp({
    email,
    password,
  });

  if (authError) return { user: null, error: authError.message };
  if (!authData.user) return { user: null, error: 'No se pudo crear el usuario' };

  const newProfile = {
    id: authData.user.id,
    email,
    name,
    role,
    active: true,
    created_at: new Date().toISOString(),
  };

  const { error: profileError } = await supabase!
    .from('users')
    .insert(newProfile);

  if (profileError) return { user: null, error: profileError.message };

  return { user: mapProfileToUser(newProfile as unknown as Record<string, unknown>), error: null };
}

export { isSupabaseConfigured };
