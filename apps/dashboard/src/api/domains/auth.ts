import { get, post } from '../client';
import { endpoints } from '../endpoints';
import type { LoginInput, UserDTO } from '../types';

interface LoginResponse {
  token: string;
  user: UserDTO;
}

export function login(data: LoginInput): Promise<LoginResponse> {
  return post<LoginResponse>(endpoints.auth.login, data);
}

export function getProfile(): Promise<UserDTO> {
  return get<UserDTO>(endpoints.auth.me);
}
