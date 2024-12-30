import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { AuthRouteService } from './services/auth/router';
import path from 'path';
import { UserRouteService } from './services/user/router';
import { ArtistRouteService } from './services/artist/router';
import { AlbumRouteService } from './services/album/router';
import { TrackRouteService } from './services/track/router';
import { FavoriteRouteService } from './services/favorite/router';
import { connectToDatabase } from 'music-database';

dotenv.config({ path: path.resolve(__dirname, '../environment/.env') });

// Initialize express app
const app = express();
const port = process.env.PORT || 5000;
const host = process.env.HOST || 'localhost';

// Middleware to parse JSON bodies
app.use(express.json());

// Enable CORS
app.use(cors());

// Connect to MongoDB
connectToDatabase();

app.get('/', (req, res) => {
  res.send('Music API is running');
});

app.use('/api/v1', AuthRouteService);
app.use('/api/v1/users', UserRouteService);
app.use('/api/v1/artists', ArtistRouteService);
app.use('/api/v1/albums', AlbumRouteService);
app.use('/api/v1/tracks', TrackRouteService);
app.use('/api/v1/favorites', FavoriteRouteService);

app.listen(port, () => {
  const baseUrl = `http://${host}:${port}/api`;
  console.log(`Server is running on base URL: ${baseUrl}`);
});
