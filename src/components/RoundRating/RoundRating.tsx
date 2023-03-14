import React from 'react';
import './RoundRating.scss';

interface Props {
  votes: number;
}

function RoundRating({ votes }: Props) {
  let color = '';

  if (votes <= 3) {
    color = '#E90000';
  } else if (votes > 3 && votes <= 5) {
    color = '#E97E00';
  } else if (votes > 5 && votes <= 7) {
    color = '#E9D100';
  } else {
    color = '#66E900';
  }

  return (
    <div>
      <div className="round-rating" style={{ border: `2px solid ${color}` }}>
        {votes.toFixed(1)}
      </div>
    </div>
  );
}
export default RoundRating;
