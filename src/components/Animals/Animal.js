import React from 'react';
import './Animal.css';

const Animal = ({player, key}) => {
  return (
    <li className="Animal-group-item" key={key}>
      <div className="Animal">
        <div className="Animal-emoji">{player.animal.emoji}</div>
        <div className="Animal-name">{player.subject}</div>
      </div>
    </li>
  );
};

export default Animal;
