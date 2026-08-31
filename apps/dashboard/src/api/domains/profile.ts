import { get, put } from '../client';
import { endpoints } from '../endpoints';
import type { UserDTO } from '../types';

interface UpdateProfileInput {
  name?: string;
  email?: string;
  phone?: string;
  avatar_url?: string;
}

interface UpdatePasswordInput {
  current_password: string;
  new_password: string;
}

export function getProfile(): Promise<UserDTO> {
  return get<UserDTO>(endpoints.profile);
}

export function updateProfile(data: UpdateProfileInput): Promise<UserDTO> {
  return put<UserDTO>(endpoints.profile, data);
}

export function updatePassword(data: UpdatePasswordInput): Promise<void> {
  return put<void>(endpoints.profilePassword, data);
}
