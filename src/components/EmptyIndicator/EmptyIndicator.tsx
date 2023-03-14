import React from 'react';

import { FilmType } from '../FilmList/FilmList';

interface PropTypes {
  rated: Array<FilmType>;
}

function EmptyIndicator(props: PropTypes) {
  if (props.rated.length === 0) {
    return (
      <>
        <h1 style={{ textAlign: 'center' }}>No rated films yet</h1>
      </>
    );
  } else {
    return null;
  }
}

export default EmptyIndicator;
