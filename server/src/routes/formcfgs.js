import { Router } from 'express';
import { formcfgRepo } from '../db/database.js';

const router = Router();

// GET /api/formcfgs?schemaId=X
router.get('/', (req, res) => {
    const schemaId = Number(req.query.schemaId);
    if (!schemaId) return res.status(400).json({ success: false, error: 'schemaId query param required' });
    const cfgs = formcfgRepo.getBySchema(schemaId);
    res.json({ success: true, data: cfgs });
});

// GET /api/formcfgs/:id
router.get('/:id', (req, res) => {
    const cfg = formcfgRepo.getById(Number(req.params.id));
    if (!cfg) return res.status(404).json({ success: false, error: 'Formcfg not found' });
    res.json({ success: true, data: cfg });
});

// POST /api/formcfgs
router.post('/', (req, res) => {
    const { schemaId, json, name } = req.body;
    if (!schemaId) return res.status(400).json({ success: false, error: 'schemaId required' });
    const cfg = formcfgRepo.create(schemaId, json || {}, name || '');
    res.status(201).json({ success: true, data: cfg });
});

// PUT /api/formcfgs/:id
router.put('/:id', (req, res) => {
    const updated = formcfgRepo.update(Number(req.params.id), req.body);
    if (!updated) return res.status(404).json({ success: false, error: 'Formcfg not found' });
    res.json({ success: true, data: updated });
});

// DELETE /api/formcfgs/:id
router.delete('/:id', (req, res) => {
    const ok = formcfgRepo.delete(Number(req.params.id));
    if (!ok) return res.status(404).json({ success: false, error: 'Formcfg not found' });
    res.json({ success: true });
});

export default router;
