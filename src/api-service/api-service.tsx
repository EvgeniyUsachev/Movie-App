import axios from 'axios';

export default class ApiService {
  getData = async (request: string, page: number) => {
    const response = await axios.get(
      `https://api.themoviedb.org/3/search/movie?api_key=7d0349337e7da854b0da94f99185e198&query=${request}&page=${page}`
    );
    console.log('this message comes from API ');
    console.log(response.data.results);
    return this._transformData(response.data);
  };

  _transformData = (data: any) => {
    const _transformedArr: any = [];
    data.results.forEach((film: any) => {
      const transformedFilm = {
        id: film.id,
        title: film.title,
        date: film.release_date,
        picture: film.poster_path,
        description: film.overview,
        genres: film.genre_ids,
        totalFilms: data.total_results,
        votes: film.vote_average,
        rating: film.rating,
      };
      _transformedArr.push(transformedFilm);
    });
    return _transformedArr;
  };

  getPopular = async (page: number) => {
    const response = await axios.get(
      `https://api.themoviedb.org/3/movie/popular?api_key=7d0349337e7da854b0da94f99185e198&language=en-US&page=${page}`
    );
    console.log('this message comes from popular ');
    return this._transformData(response.data);
  };

  getGenre = async () => {
    const response = await axios.get(
      'https://api.themoviedb.org/3/genre/movie/list?api_key=7d0349337e7da854b0da94f99185e198&language=en-US'
    );
    return response.data.genres;
  };

  createGuestSession = async () => {
    const response = await axios.get(
      'https://api.themoviedb.org/3/authentication/guest_session/new?api_key=7d0349337e7da854b0da94f99185e198'
    );
    return response.data.guest_session_id;
  };

  rateMovie = async (value: number, id: number, sessionId: string) => {
    const requestBody = {
      value: value,
    };
    const headers = {
      'Content-Type': 'application/json;charset=utf-8',
    };
    const response = await axios.post(
      `https://api.themoviedb.org/3/movie/${id}/rating?api_key=7d0349337e7da854b0da94f99185e198&guest_session_id=${sessionId}`,
      requestBody,
      { headers }
    );

    return response;
  };

  getRatedMovies = async (sessionId: string, page: number) => {
    const response = await axios.get(
      `https://api.themoviedb.org/3/guest_session/${sessionId}/rated/movies?api_key=7d0349337e7da854b0da94f99185e198&language=en-US&sort_by=created_at.asc&page=${page}`
    );

    return this._transformData(response.data);
  };
}
