import { post } from '../client';
import { endpoints } from '../endpoints';
import type { ContactFormInput } from '../types';

export function submitContact(data: ContactFormInput): Promise<void> {
  return post<void>(endpoints.contact, data);
}
