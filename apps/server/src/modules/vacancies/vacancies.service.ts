import { asc, desc, eq } from 'drizzle-orm';
import { db } from '../../db/client.js';
import { departments, vacancies } from '../../db/schema/index.js';
import type { NewVacancy } from '../../db/schema/index.js';

const vacancySelection = {
  id: vacancies.id,
  departmentId: vacancies.departmentId,
  departmentName: departments.name,
  title: vacancies.title,
  employmentType: vacancies.employmentType,
  location: vacancies.location,
  closingDate: vacancies.closingDate,
  description: vacancies.description,
  qualifications: vacancies.qualifications,
  applicationInstructions: vacancies.applicationInstructions,
  isPublished: vacancies.isPublished,
  createdAt: vacancies.createdAt,
  updatedAt: vacancies.updatedAt,
};

export async function getPublicVacancies() {
  return db
    .select(vacancySelection)
    .from(vacancies)
    .leftJoin(departments, eq(vacancies.departmentId, departments.id))
    .where(eq(vacancies.isPublished, true))
    .orderBy(asc(vacancies.closingDate));
}

export async function getAllVacancies() {
  return db
    .select(vacancySelection)
    .from(vacancies)
    .leftJoin(departments, eq(vacancies.departmentId, departments.id))
    .orderBy(desc(vacancies.createdAt));
}

export async function getVacancyById(id: string) {
  const [vacancy] = await db
    .select(vacancySelection)
    .from(vacancies)
    .leftJoin(departments, eq(vacancies.departmentId, departments.id))
    .where(eq(vacancies.id, id));
  return vacancy;
}

export async function createVacancy(data: NewVacancy) {
  await db.insert(vacancies).values(data);
  return getVacancyById(data.id);
}

export async function updateVacancy(id: string, data: Partial<NewVacancy>) {
  await db.update(vacancies).set(data).where(eq(vacancies.id, id));
  return getVacancyById(id);
}

export async function deleteVacancy(id: string) {
  await db.delete(vacancies).where(eq(vacancies.id, id));
}
