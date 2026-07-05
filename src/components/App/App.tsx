import css from './App.module.css';
import SearchBar from '../SearchBar/SearchBar';
import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import fetchMovies from '../../services/movieService';
import { type Movie } from '../../types/movie';
import MovieGrid from '../MovieGrid/MovieGrid';
import MovieModal from '../MovieModal/MovieModal';
import { type MovieResponse } from '../../services/movieService';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import ReactPaginateModule from 'react-paginate';
import type { ReactPaginateProps } from 'react-paginate';
import type { ComponentType } from 'react';

type ModuleWithDefault<T> = { default: T };

const ReactPaginate = (
  ReactPaginateModule as unknown as ModuleWithDefault<
    ComponentType<ReactPaginateProps>
  >
).default;

export default function App() {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const [topic, setTopic] = useState('');
  const [page, setPage] = useState(1);
  function handleSearch(newQuery: string) {
    setTopic(newQuery);
    setPage(1);
  }

  const { data, isLoading, error, isSuccess } = useQuery<MovieResponse, Error>({
    queryKey: ['movies', topic, page],
    queryFn: () => fetchMovies(topic, page),
    enabled: topic.trim() !== '',
    retry: false,
    placeholderData: keepPreviousData,
  });
  console.log(topic);
  function closeModal() {
    setSelectedMovie(null);
  }

  function handleSelect(movie: Movie) {
    setSelectedMovie(movie);
  }

  const totalPages = data?.total_pages ?? 0;

  return (
    <>
      <Toaster />
      <SearchBar onSubmit={handleSearch} />

      {isLoading && <Loader />}
      {error && <ErrorMessage />}
      {isSuccess && totalPages > 1 && (
        <ReactPaginate
          pageCount={totalPages}
          pageRangeDisplayed={5}
          marginPagesDisplayed={1}
          onPageChange={({ selected }) => setPage(selected + 1)}
          forcePage={page - 1}
          containerClassName={css.pagination}
          activeClassName={css.active}
          nextLabel="→"
          previousLabel="←"
        />
      )}
      {data && <MovieGrid movies={data.results} onSelect={handleSelect} />}
      {selectedMovie && (
        <MovieModal onClose={closeModal} movie={selectedMovie} />
      )}
    </>
  );
}
