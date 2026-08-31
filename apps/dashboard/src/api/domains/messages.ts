import { del, get, put } from '../client';
import { endpoints } from '../endpoints';
import type { ContactMessageDTO } from '../types';

interface PaginatedResponse<T> {
  data: T[];
  meta: { total: number; page: number; limit: number };
}

export function listMessages(): Promise<PaginatedResponse<ContactMessageDTO>> {
  return get<PaginatedResponse<ContactMessageDTO>>(endpoints.messages.list);
}

export function getUnreadMessages(): Promise<ContactMessageDTO[]> {
  return get<ContactMessageDTO[]>(endpoints.messages.unread);
}

export function getMessage(id: string): Promise<ContactMessageDTO> {
  return get<ContactMessageDTO>(endpoints.messages.byId(id));
}

export function updateMessage(
  id: string,
  data: Partial<ContactMessageDTO>
): Promise<ContactMessageDTO> {
  return put<ContactMessageDTO>(endpoints.messages.byId(id), data);
}

export function deleteMessage(id: string): Promise<void> {
  return del<void>(endpoints.messages.byId(id));
}
