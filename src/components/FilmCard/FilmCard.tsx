import React from 'react';
import { Spin, Image, Rate } from 'antd';
import './FilmCard.scss';
import moment from 'moment';

import RoundRating from '../RoundRating/RoundRating';

// const axios = require('axios');

interface PropTypes {
  key: number;
  genresList: Array<{ id: number; name: string }>;
  handleRatingChange: (value: number) => void;
  rating?: number;
  picture: string;
  title: string;
  votes: number;
  date: string;
  genres: Array<number>;
  description: string;
  id: number;
}

function FilmCard(props: PropTypes) {
  const [ratedValue, setRatedValue] = React.useState(0);

  console.log(props.rating);
  function setDate(date: string) {
    if (date) {
      const format = moment(date).format('MMMM D, YYYY');
      return format;
    } else return 'Release date unknown';
  }

  function setPoster(url: string) {
    if (url) {
      return `https://image.tmdb.org/t/p/w500${url}`;
    } else
      return 'data:image/png;base64,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';
  }

  function setDescription(descr: string) {
    if (!descr) {
      return 'Film description not found';
    } else if (descr.length < 140) {
      return descr;
    }
    const newText = `${descr.slice(0, 130).split(' ').slice(0, -1).join(' ')}...`;
    return newText;
  }

  function setGenre(genreDBArr: Array<{ id: number; name: string }>, genreIdArr: Array<number>) {
    const genresBtn = genreIdArr.map((id: number) => {
      const genreArr: Array<string> = [];

      genreDBArr.forEach((genre: { id: number; name: string }) => {
        if (id === genre.id) {
          genreArr.push(genre.name);
        }
      });

      return (
        <div className="card__genre__item" key={id}>
          {genreArr}
        </div>
      );
    });
    if (genreIdArr.length === 0) {
      return (
        <div className="card__genre__item" key={1}>
          Genre not found
        </div>
      );
    }
    return genresBtn;
  }

  // React.useEffect(() => {
  //   localStorage.setItem('ratedFilms', '{"1":1}');
  // }, []);

  const getStarRating = (rating: number, id: number) => {
    if (rating) {
      console.log('есть rating поэтому ставим', rating);

      return rating;
    }

    try {
      if (JSON.parse(localStorage.getItem('ratedFilms')!)[id]) {
        return JSON.parse(localStorage.getItem('ratedFilms')!)[id];
      }
    } catch {
      return 0;
    }

    // ]
    // else if (
    //   JSON.parse(localStorage.getItem('ratedFilms')!)[
    //     id
    //   ] !== null
    // ) {
    //   console.log(
    //     'есть localStorage поэтому ставим',
    //     JSON.parse(localStorage.getItem('ratedFilms')!)[id]
    //   );

    //   return JSON.parse(
    //     localStorage.getItem('ratedFilms')!
    //   )[id];
    // }
  };

  // React.useEffect(() => {
  //   getStarRating(props.rating, props.id);
  // });

  return (
    <div className="card">
      <div className="card__img">
        <Image
          className="img"
          src={setPoster(props.picture)}
          alt="logo"
          placeholder={
            <Spin size="large">
              <div
                style={{
                  height: 250,
                  margin: 24,
                }}
              ></div>
            </Spin>
          }
        />
      </div>

      <div className="card__content">
        <div className="card__wrapper">
          <div className="round-wrapper">
            <h1>{props.title}</h1>
            <RoundRating votes={props.votes} />
          </div>

          <div className="card__date">{setDate(props.date)}</div>
          <div className="card__genre">
            {/* <div className='card__genre__item'>
              {' '}
              {props.genres[0]}
            </div>
            <div className='card__genre__item'>
              {' '}
              {genre}
            </div> */}

            {setGenre(props.genresList, props.genres)}
          </div>
          <div className="card__description">
            <span>{setDescription(props.description)}</span>
          </div>
        </div>
        <Rate
          count={10}
          allowHalf={true}
          className="card__rating"
          style={{ fontSize: 18, height: 202 }}
          onChange={(value: number) => {
            props.handleRatingChange(value);
            setRatedValue(value);
            console.log(value);
          }}
          defaultValue={ratedValue}
          value={getStarRating(props.rating!, props.id)}
          // value={getStarRating(props.rating, props.id)}
        ></Rate>
      </div>
    </div>
  );
}

export default FilmCard;
// https://image.tmdb.org/t/p/w500/avPMO5cnaGHgLaNiAIhy33WoQLm.jpg