import { sql } from 'drizzle-orm';
import { db } from '../../db/client.js';
import {
  contactMessages,
  publications,
  researchProjects,
  staff,
  vehicles,
} from '../../db/schema/index.js';

export async function getDashboardMetrics() {
  const [projectCounts] = await db
    .select({
      total: sql<number>`count(*)`,
      active: sql<number>`sum(case when status = 'ONGOING' then 1 else 0 end)`,
    })
    .from(researchProjects);

  const [pubCounts] = await db.select({ total: sql<number>`count(*)` }).from(publications);

  const [staffCounts] = await db.select({ total: sql<number>`count(*)` }).from(staff);

  const [vehicleCounts] = await db
    .select({
      total: sql<number>`count(*)`,
      available: sql<number>`sum(case when status = 'AVAILABLE' then 1 else 0 end)`,
    })
    .from(vehicles);

  const [msgCounts] = await db
    .select({
      unread: sql<number>`sum(case when status = 'UNREAD' then 1 else 0 end)`,
    })
    .from(contactMessages);

  return {
    totalProjects: Number(projectCounts?.total || 0),
    activeProjects: Number(projectCounts?.active || 0),
    totalPublications: Number(pubCounts?.total || 0),
    totalStaff: Number(staffCounts?.total || 0),
    availableVehicles: Number(vehicleCounts?.available || 0),
    totalVehicles: Number(vehicleCounts?.total || 0),
    unreadMessages: Number(msgCounts?.unread || 0),
  };
}
