import React from 'react';

import FilmCard from '../FilmCard/FilmCard';

export interface FilmType {
  date: string;
  description: string;
  genres: Array<number>;
  id: number;
  picture: string;
  rating?: number;
  title: string;
  totalFilms: number;
  votes: number;
}

interface PropsType {
  films: Array<FilmType> | never[];
  errorMessage?: any;
  genres: Array<{ id: number; name: string }> | never[];
  loading: boolean;
  handleRatingChange: (value: number, id: number) => void;
  searchRequest: string;
}

function FilmList(props: PropsType) {
  const filmArr = props.films.map((film: FilmType) => {
    const { id } = film;

    return (
      <FilmCard
        key={id}
        {...film}
        genresList={props.genres}
        handleRatingChange={(value: number) => props.handleRatingChange(value, id)}
      />
    );
  });
  if (props.loading) {
    return null;
  } else if (!props.films && props.searchRequest.length !== 0) {
    return <div style={{ textAlign: 'center' }}>No films found. Try another search request</div>;
  }

  return (
    <div className="wrapper">
      {/* {props.loadingSpinner} */}
      {props.errorMessage}
      {filmArr}
    </div>
  );
}

export default FilmList;
