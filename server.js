import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import loadRoutes from './utils/loadRoutes.js';
import cors from 'cors';

dotenv.config({ path: './.env', quiet: true });

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(morgan('dev'));
app.use(express.json({ limit: '20mb' }));
app.use(cors());

// Router
await loadRoutes(app);

// Error handling
app.use((err, req, res, next) => {
  console.log(err.message);
  const statusCode = typeof(err.code) === 'number' ? err.code : 500;
  res.status(statusCode).json({ message: err.message || 'Something went wrong'});
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
});