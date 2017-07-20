import React from 'react';
import Animal from './Animal';

const Animals = ({players}) => {
  return (
    <ul className="list-group">
      {players.map((player, index) => (
        <Animal player={player} key={index} />
      ))}
    </ul>
  );
};

export default Animals;
