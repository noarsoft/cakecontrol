import { Router } from 'express';
import { formRepo } from '../db/database.js';

const router = Router();

// GET /api/forms?schemaId=X
router.get('/', (req, res) => {
    const schemaId = Number(req.query.schemaId);
    if (!schemaId) return res.status(400).json({ success: false, error: 'schemaId query param required' });
    const forms = formRepo.getBySchema(schemaId);
    res.json({ success: true, data: forms });
});

// GET /api/forms/:id
router.get('/:id', (req, res) => {
    const form = formRepo.getById(Number(req.params.id));
    if (!form) return res.status(404).json({ success: false, error: 'Form not found' });
    res.json({ success: true, data: form });
});

// POST /api/forms
router.post('/', (req, res) => {
    const { schemaId, data } = req.body;
    if (!schemaId) return res.status(400).json({ success: false, error: 'schemaId required' });
    const form = formRepo.create(schemaId, data || {});
    res.status(201).json({ success: true, data: form });
});

// PUT /api/forms/:id
router.put('/:id', (req, res) => {
    const { data } = req.body;
    const updated = formRepo.update(Number(req.params.id), data || {});
    if (!updated) return res.status(404).json({ success: false, error: 'Form not found' });
    res.json({ success: true, data: updated });
});

// DELETE /api/forms/:id
router.delete('/:id', (req, res) => {
    const ok = formRepo.delete(Number(req.params.id));
    if (!ok) return res.status(404).json({ success: false, error: 'Form not found' });
    res.json({ success: true });
});

export default router;
