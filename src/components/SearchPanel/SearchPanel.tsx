import React from 'react';
import './SearchPanel.scss';

interface Props {
  onSearch: (value: string) => void;
  sessionId: string;
  searchRequest: string;
}

function SearchPanel(props: Props) {
  const localSearch = localStorage.getItem('query')! ? localStorage.getItem('query')! : '';
  const [value, setValue] = React.useState(localSearch);
  console.log('from search panel', props.sessionId);

  // localStorage.setItem('sessionID', props.sessionId);

  const handleChange = (e: any) => {
    setValue(e.target.value);
    props.onSearch(e.target.value);
    console.log(value);
  };

  return (
    <input
      className="search"
      placeholder="Type to search..."
      onChange={(e) => handleChange(e)}
      // onChange={(e) => props.onSearch(e.target.value)}
      value={value}
    />
  );
}

export default SearchPanel;
