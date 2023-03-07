import React from 'react';
import './SearchPanel.scss';

interface Props {
  onSearch: (value: string) => void;
  sessionId: string;
}

function SearchPanel(props: Props) {
  console.log('from search panel', props.sessionId);
  return <input className="search" placeholder="Type to search..." onChange={(e) => props.onSearch(e.target.value)} />;
}

export default SearchPanel;
