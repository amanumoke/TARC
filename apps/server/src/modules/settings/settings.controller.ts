import { eq } from 'drizzle-orm';
import { Request, Response } from 'express';
import { db } from '../../db/client.js';
import { systemSettings } from '../../db/schema/settings.js';

export async function handleGetPublicSettings(_req: Request, res: Response) {
  try {
    const [settings] = await db
      .select({
        institutionName: systemSettings.institutionName,
        tagline: systemSettings.tagline,
        aboutText: systemSettings.aboutText,
        missionText: systemSettings.missionText,
        visionText: systemSettings.visionText,
        directorName: systemSettings.directorName,
        directorTitle: systemSettings.directorTitle,
        directorMessage: systemSettings.directorMessage,
        directorPhotoUrl: systemSettings.directorPhotoUrl,
        officialEmail: systemSettings.officialEmail,
        officialPhone: systemSettings.officialPhone,
        physicalAddress: systemSettings.physicalAddress,
        socialLinks: systemSettings.socialLinks,
      })
      .from(systemSettings)
      .where(eq(systemSettings.id, 'primary'))
      .limit(1);

    if (!settings) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'System settings not found.' },
      });
    }

    res.json({ success: true, data: settings });
  } catch (error) {
    console.error('Fetch public settings error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'FETCH_ERROR', message: 'Failed to fetch settings.' },
    });
  }
}
