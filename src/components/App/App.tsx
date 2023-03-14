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
  const [page, setPage] = useState(1000);
  const [total, setTotal] = useState(0);
  const [sessionId, setSessionId] = useState('');
  const [ratedFilms, setRatedFilms] = useState([]);
  const [totalRated, setTotalRated] = useState(0);
  const [ratedPage, setRatedPage] = useState(1);

  const localPage = Number(localStorage.getItem('page')!) ? Number(localStorage.getItem('page')!) : 1;
  const localSearch = localStorage.getItem('query')!;
  const localSessionId = localStorage.getItem('sessionID')!;

  const api = new ApiService();
  useEffect(() => {
    const api = new ApiService();
    api.getGenre().then((info) => {
      setGenres(info);
    });

    api
      .getData(localSearch, localPage)
      .then((filmsData) => {
        console.log(filmsData);
        if (localSearch === null || localSearch === '') {
          api.getPopular(localPage).then((popularData) => {
            setFilmsData(popularData);
            setTotal(popularData[0].totalFilms);
            setLoading(false);
          });
        } else {
          setFilmsData(filmsData);

          setLoading(false);
          setTotal(filmsData[0].totalFilms);
          setLoading(false);
        }
      })
      .catch((err: Error) => {
        setError(true);
        setLoading(false);
      });
  }, [searchRequest, page, total, error]);

  useEffect(() => {
    const api = new ApiService();
    api.createGuestSession().then((id) => {
      setSessionId(id);
      if (localStorage.getItem('sessionID') === null) {
        localStorage.setItem('sessionID', id);
      }

      // localStorage.clear();
      // localStorage.setItem('page', '1');
    });
    /*  api.getGenre().then((info) => {
      setGenres(info);
    }); */
  }, []);

  const loadingSpinner = loading ? <LoadingSpinner /> : null;

  const errorMessage = error ? <ErrorIndicator /> : null;

  const onSearch = debounce((value: string) => {
    localStorage.setItem('query', value);

    setSearchRequest(value);
    setLoading(true);
    setError(false);
    localStorage.setItem('page', '1');
  }, 500);

  const onPagignationChange = (page: number) => {
    localStorage.setItem('page', page.toString());
    setPage(page);
  };

  const onRatedPagignationChange = (page: number) => {
    setLoading(true);
    setRatedPage(page);
    api.getRatedMovies(localSessionId, page).then((ratedMovies) => {
      setLoading(false);
      setFilmsData(ratedMovies);
      setRatedFilms(ratedMovies);
      setTotalRated(ratedMovies[0].totalFilms);
    });
    setRatedPage(page);
  };

  const handleRatingChange = (value: number, id: number) => {
    // setRating(value);
    api
      .rateMovie(value, id, localSessionId)

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
  };

  const getRatedMovies = (activeKey: string) => {
    setLoading(true);

    if (activeKey === '2') {
      api
        .getRatedMovies(localSessionId, ratedPage)
        .then((ratedMovies) => {
          setLoading(false);
          setFilmsData(ratedMovies);
          setRatedFilms(ratedMovies);
          setTotalRated(ratedMovies[0].totalFilms);
        })
        .catch((err: Error) => console.log(err));
    }
    if (activeKey === '1') {
      api.getData(localSearch, localPage).then((filmsData) => {
        if (filmsData.length === 0) {
          api.getPopular(localPage).then((popularData) => {
            setFilmsData(popularData);
            setTotal(popularData[0].totalFilms);
            setLoading(false);
            setError(false);
          });
        } else {
          api
            .getData(localSearch, localPage)
            .then((filmsData) => {
              setFilmsData(filmsData);
              setLoading(false);
              setTotal(filmsData[0].totalFilms);
              setError(false);
            })
            .catch((err: Error) => {
              setError(true);
              setLoading(false);
              console.log(err);
              console.log(error);
            });
        }
      });
    }
  };
  const paginationItem =
    Object.keys(filmsData).length && !loading ? (
      <Pagination onChange={onPagignationChange} pageSize={20} total={total} current={localPage} />
    ) : null;

  const ratedPagination =
    Object.keys(filmsData).length && !loading ? (
      <Pagination onChange={onRatedPagignationChange} pageSize={20} total={totalRated} current={ratedPage} />
    ) : null;

  const tabItems: TabsProps['items'] = [
    {
      key: '1',
      label: 'Search',

      children: (
        <>
          <div className="App">
            <Online>
              <SearchPanel onSearch={onSearch} sessionId={sessionId} searchRequest={searchRequest} />
              {loadingSpinner}
              <FilmList
                films={filmsData}
                errorMessage={errorMessage}
                genres={genres}
                loading={loading}
                handleRatingChange={handleRatingChange}
                searchRequest={searchRequest}
              />
              <div style={{ textAlign: 'center' }}>{paginationItem}</div>
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
                searchRequest={localStorage.getItem('query')!}
              />
              <EmptyIndicator rated={ratedFilms} />
              {/* {ratedPagination} */}
              <div style={{ textAlign: 'center' }}>{ratedPagination}</div>
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
