import { db } from './client.js';
import {
  contactMessages,
  departments,
  events,
  galleryMedia,
  news,
  publicationAuthors,
  publications,
  researchPrograms,
  researchProjects,
  staff,
  systemSettings,
  users,
  vehicleAssignments,
  vehicles,
} from './schema/index.js';

async function clearDatabase() {
  console.log('Clearing TARCMS database records...');

  await db.delete(vehicleAssignments);
  await db.delete(vehicles);
  await db.delete(contactMessages);
  await db.delete(galleryMedia);
  await db.delete(news);
  await db.delete(events);
  await db.delete(publicationAuthors);
  await db.delete(publications);
  await db.delete(researchProjects);
  await db.delete(researchPrograms);
  await db.delete(staff);
  await db.delete(departments);
  await db.delete(users);
  await db.delete(systemSettings);

  console.log('Database records cleared. Tables and schema were preserved.');
  await process.exit(0);
}

clearDatabase().catch((error) => {
  console.error('Failed to clear database:', error);
  process.exit(1);
});
