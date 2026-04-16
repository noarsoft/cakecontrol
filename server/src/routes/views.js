import { Router } from 'express';
import { viewRepo } from '../db/database.js';

const router = Router();

// GET /api/views?schemaId=X
router.get('/', (req, res) => {
    const schemaId = Number(req.query.schemaId);
    if (!schemaId) return res.status(400).json({ success: false, error: 'schemaId query param required' });
    const views = viewRepo.getBySchema(schemaId);
    res.json({ success: true, data: views });
});

// GET /api/views/:id
router.get('/:id', (req, res) => {
    const view = viewRepo.getById(Number(req.params.id));
    if (!view) return res.status(404).json({ success: false, error: 'View not found' });
    res.json({ success: true, data: view });
});

// POST /api/views
router.post('/', (req, res) => {
    const { schemaId, viewType, json, name } = req.body;
    if (!schemaId || !viewType) return res.status(400).json({ success: false, error: 'schemaId and viewType required' });
    const view = viewRepo.create(schemaId, viewType, json || {}, name || '');
    res.status(201).json({ success: true, data: view });
});

// PUT /api/views/:id
router.put('/:id', (req, res) => {
    const updated = viewRepo.update(Number(req.params.id), req.body);
    if (!updated) return res.status(404).json({ success: false, error: 'View not found' });
    res.json({ success: true, data: updated });
});

// DELETE /api/views/:id
router.delete('/:id', (req, res) => {
    const ok = viewRepo.delete(Number(req.params.id));
    if (!ok) return res.status(404).json({ success: false, error: 'View not found' });
    res.json({ success: true });
});

export default router;
