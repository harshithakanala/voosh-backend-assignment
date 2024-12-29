import express from 'express';
import dotenv from 'dotenv';
import { AuthRouteService } from './services/auth/router';
import { connectToDatabase } from 'music-database';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../environment/.env') });

// Initialize express app
const app = express();
const port = process.env.PORT || 5000;
const host = process.env.HOST || 'localhost';

// Middleware to parse JSON bodies
app.use(express.json());

// Connect to MongoDB
connectToDatabase();

app.get('/', (req, res) => {
  res.send('Music API is running');
});

app.use('/api', AuthRouteService);

app.listen(port, () => {
  const baseUrl = `http://${host}:${port}/api`;
  console.log(`Server is running on base URL: ${baseUrl}`);
});
