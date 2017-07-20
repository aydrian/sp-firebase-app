import React from 'react';
import Animal from './Animal';
import './Animal.css';

const Animals = ({players}) => {
  return (
    <ul className="Animal-group">
      {players.map((player, index) => (
        <Animal player={player} key={index} />
      ))}
    </ul>
  );
};

export default Animals;
