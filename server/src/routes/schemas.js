import { Router } from 'express';
import { schemaRepo } from '../db/database.js';

const router = Router();

// GET /api/schemas — list all active schemas
router.get('/', (req, res) => {
    const schemas = schemaRepo.getAll();
    res.json({ success: true, data: schemas });
});

// GET /api/schemas/:id
router.get('/:id', (req, res) => {
    const schema = schemaRepo.getById(Number(req.params.id));
    if (!schema) return res.status(404).json({ success: false, error: 'Schema not found' });
    res.json({ success: true, data: schema });
});

// POST /api/schemas — create
router.post('/', (req, res) => {
    const { name, json } = req.body;
    if (!name) return res.status(400).json({ success: false, error: 'name is required' });
    const schema = schemaRepo.create(name, json || {});
    res.status(201).json({ success: true, data: schema });
});

// PUT /api/schemas/:id — update
router.put('/:id', (req, res) => {
    const updated = schemaRepo.update(Number(req.params.id), req.body);
    if (!updated) return res.status(404).json({ success: false, error: 'Schema not found' });
    res.json({ success: true, data: updated });
});

// DELETE /api/schemas/:id — soft delete
router.delete('/:id', (req, res) => {
    const ok = schemaRepo.delete(Number(req.params.id));
    if (!ok) return res.status(404).json({ success: false, error: 'Schema not found' });
    res.json({ success: true });
});

export default router;
