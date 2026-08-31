import { useMutation } from '@tanstack/react-query';
import { submitContact } from '../domains/messages';
import type { ContactFormInput } from '../types';

export function useContact() {
  return useMutation({
    mutationFn: (data: ContactFormInput) => submitContact(data),
  });
}
