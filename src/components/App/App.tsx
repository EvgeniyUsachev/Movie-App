import React, { useState, useEffect } from 'react';
import '../../normalize.css';
import { Online } from 'react-detect-offline';
import { debounce } from 'lodash';
import { Pagination, Tabs } from 'antd';
import type { TabsProps } from 'antd';

import FilmList from '../FilmList/FilmList';
import ApiService from '../../api-service/api-service';
import ErrorIndicator from '../ErrorIndicator/ErrorIndicator';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import OfflineText from '../Offline/Offline';
import SearchPanel from '../SearchPanel/SearchPanel';
import './App.scss';
import EmptyIndicator from '../EmptyIndicator/EmptyIndicator';

const App: React.FC = () => {
  const [filmsData, setFilmsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [searchRequest, setSearchRequest] = useState('');
  const [genres, setGenres] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [sessionId, setSessionId] = useState('');
  const [ratedFilms, setRatedFilms] = useState([]);

  const api = new ApiService();
  useEffect(() => {
    const api = new ApiService();
    api.getGenre().then((info) => {
      console.log('genres', info);
      setGenres(info);
    });

    api
      .getData(searchRequest, page)
      .then((filmsData) => {
        console.log(filmsData);
        if (searchRequest.length === 0) {
          api.getPopular().then((popularData) => {
            setFilmsData(popularData);
            console.log('popular', popularData);
            setTotal(popularData[0].totalFilms);
            setLoading(false);
          });
        } else {
          setFilmsData(filmsData);
          setLoading(false);
          setTotal(filmsData[0].totalFilms);
        }
      })
      .catch((err: Error) => {
        setError(true);
        setLoading(false);
        console.log('error catched');
        console.log(err);
        console.log(error);
      });
  }, [searchRequest, page, total, error]);

  useEffect(() => {
    const api = new ApiService();
    api.createGuestSession().then((id) => {
      setSessionId(id);
      localStorage.clear();
    });
  }, []);

  const loadingSpinner = loading ? <LoadingSpinner /> : null;

  const errorMessage = error ? <ErrorIndicator /> : null;

  const onSearch = debounce((value: string) => {
    setSearchRequest(value);
    setLoading(true);
    setError(false);
    setPage(1);
  }, 500);

  const onPagignationChange = (page: number) => {
    setPage(page);
  };

  const paginationItem =
    Object.keys(filmsData).length && !loading ? (
      <Pagination onChange={onPagignationChange} pageSize={20} total={total} />
    ) : null;

  const handleRatingChange = (value: number, id: number) => {
    // setRating(value);
    api
      .rateMovie(value, id, sessionId)

      .catch((err) => {
        console.log('error frompost request', err);
      });

    if (localStorage.getItem('ratedFilms') === null) {
      const obj: any = {};
      obj[id] = value;
      localStorage.setItem('ratedFilms', JSON.stringify(obj));
    } else {
      const obj: any = JSON.parse(localStorage.getItem('ratedFilms')!);
      obj[id] = value;
      localStorage.setItem('ratedFilms', JSON.stringify(obj));
    }

    console.log(id, value, sessionId);
  };

  const getRatedMovies = (activeKey: string) => {
    setLoading(true);

    if (activeKey === '2') {
      api.getRatedMovies(sessionId).then((ratedMovies) => {
        console.log('from getRatedMovies', ratedMovies);
        setLoading(false);
        setFilmsData(ratedMovies);
        setRatedFilms(ratedMovies);

        console.log(ratedMovies.length);
      });
    }
    if (activeKey === '1') {
      api.getData(searchRequest, page).then((filmsData) => {
        console.log(filmsData);
        if (filmsData.length === 0) {
          api.getPopular().then((popularData) => {
            setFilmsData(popularData);
            console.log('popular', popularData);
            setTotal(popularData[0].totalFilms);
            setLoading(false);
            setError(false);
          });
        } else {
          api
            .getData(searchRequest, page)
            .then((filmsData) => {
              setFilmsData(filmsData);
              setLoading(false);
              setTotal(filmsData[0].totalFilms);
              setError(false);
            })
            .catch((err: Error) => {
              setError(true);
              setLoading(false);
              console.log('error catched');
              console.log(err);
              console.log(error);
            });
        }
      });
    }
  };

  const ratedPagination =
    Object.keys(filmsData).length && !loading ? (
      <Pagination onChange={onPagignationChange} pageSize={20} total={filmsData.length} />
    ) : null;

  const tabItems: TabsProps['items'] = [
    {
      key: '1',
      label: 'Search',

      children: (
        <>
          <div className="App">
            <Online>
              <SearchPanel onSearch={onSearch} sessionId={sessionId} />
              {loadingSpinner}
              <FilmList
                films={filmsData}
                errorMessage={errorMessage}
                genres={genres}
                loading={loading}
                handleRatingChange={handleRatingChange}
                searchRequest={searchRequest}
              />
              {paginationItem}
            </Online>
            <OfflineText />
          </div>
        </>
      ),
    },
    {
      key: '2',
      label: 'Rated',
      children: (
        <>
          <div className="App">
            <Online>
              {loadingSpinner}
              <FilmList
                films={filmsData}
                genres={genres}
                loading={loading}
                errorMessage={errorMessage}
                handleRatingChange={handleRatingChange}
                searchRequest={searchRequest}
              />
              <EmptyIndicator rated={ratedFilms} />
              {ratedPagination}
            </Online>

            <OfflineText />
          </div>
        </>
      ),
    },
  ];

  return (
    <>
      <div className="App">
        <Tabs centered onChange={(activeKey) => getRatedMovies(activeKey)} items={tabItems} />
      </div>
      {/* <div className='App'> */}
      {/* <Tabs.TabPane tab='Search' key='1'> */}
      {/* <Online>
          <SearchPanel
            onSearch={onSearch}
            sessionId={sessionId}
          />
          {loadingSpinner}
          <FilmList
            films={filmsData}
            errorMessage={errorMessage}
            genres={genres}
            loading={loading}
            handleRatingChange={handleRatingChange}
            rating={rating}
          />
          {paginationItem}
        </Online>
        <OfflineText /> */}
      {/* </Tabs.TabPane> */}

      {/* <Tabs.TabPane
          tab='Rated'
          key='2'
          destroyInactiveTabPane={true}
        > */}
      {/* <Online>
          {loadingSpinner}
          <FilmList
            films={filmsData}
            errorMessage={errorMessage}
            genres={genres}
            loading={loading}
            handleRatingChange={handleRatingChange}
            rating={rating}
          />
          {paginationItem}
        </Online>

        <OfflineText /> */}
      {/* </Tabs.TabPane> */}
      {/* </Tabs> */}
      {/* </div> */}
    </>
  );
};

export default App;
