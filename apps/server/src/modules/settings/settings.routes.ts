import { Router } from 'express';
import { handleGetPublicSettings } from './settings.controller.js';

const router = Router();

router.get('/', handleGetPublicSettings);

export default router;
