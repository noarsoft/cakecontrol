import express from 'express';
import cors from 'cors';
import schemasRouter from './routes/schemas.js';
import viewsRouter from './routes/views.js';
import formcfgsRouter from './routes/formcfgs.js';
import formsRouter from './routes/forms.js';

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Routes
app.use('/api/schemas', schemasRouter);
app.use('/api/views', viewsRouter);
app.use('/api/formcfgs', formcfgsRouter);
app.use('/api/forms', formsRouter);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
    console.log(`CakeControl API running at http://localhost:${PORT}`);
    console.log(`Endpoints:`);
    console.log(`  GET/POST       /api/schemas`);
    console.log(`  GET/PUT/DELETE  /api/schemas/:id`);
    console.log(`  GET/POST       /api/views?schemaId=X`);
    console.log(`  GET/PUT/DELETE  /api/views/:id`);
    console.log(`  GET/POST       /api/formcfgs?schemaId=X`);
    console.log(`  GET/PUT/DELETE  /api/formcfgs/:id`);
    console.log(`  GET/POST       /api/forms?schemaId=X`);
    console.log(`  GET/PUT/DELETE  /api/forms/:id`);
});
