import { useQuery } from '@tanstack/react-query';
import { getVacancies } from '../domains/vacancies';

export function useVacancies() {
  return useQuery({ queryKey: ['vacancies'], queryFn: getVacancies });
}
