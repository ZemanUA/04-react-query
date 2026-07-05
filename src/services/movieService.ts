import axios from 'axios';
import { type Movie } from '../types/movie';
export interface MovieResponse {
  total_pages: number;
  results: Movie[];
}

export default async function fetchMovies(
  query: string,
  page: number = 1
): Promise<MovieResponse> {
  console.log(query);
  const response = await axios.get<MovieResponse>(
    `https://api.themoviedb.org/3/search/movie?query=${query}`,
    {
      params: { page },
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
      },
    }
  );
  return response.data;
}
