import express from 'express';
import cors from 'cors';
import { router as todoRouter } from './src/routes/todo.route.js';

const PORT = process.env.PORT || 3001;
const app = express();

app.use(cors());

app.use('/todos', express.json(), todoRouter);

app.listen(PORT, () => {});
