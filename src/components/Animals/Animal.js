import React from 'react';

const Animal = ({player, key}) => {
  return (
    <li className="list-group-item" key={key}>
      A {player.animal.name} named {player.subject}. {player.animal.emoji}
    </li>
  );
};

export default Animal;
