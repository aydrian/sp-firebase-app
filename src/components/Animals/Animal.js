import React from 'react';
import './Animal.css';
import moment from 'moment';
import _ from 'lodash';

const formatDate = (unixStr) => {
  return moment(unixStr, "X").format("llll")
}

const firebaseToArray = (obj) => {
  let arr = [];
  Object.keys(obj).forEach((key) => {
    arr.push(obj[key]);
  });
  return arr;
}

const Opens = ({opens}) => {
  let arr = _.sortBy(firebaseToArray(opens), (item) => {
    return moment(item.timestamp, "X");
  }).reverse();
  return (
    <div>Last Open: {formatDate(arr[0].timestamp)}</div>
  );
};

const Clicks = ({clicks}) => {
  let arr = firebaseToArray(clicks);
  let groups = _.groupBy(arr, 'target_link_name');
  let group_keys = Object.keys(groups);
  return (
    <div>Clicks:
      <ul>
        {group_keys.map((group_key, index) => (
          <li key={index}><a href={groups[group_key][0].target_link_url} >{group_key}</a>: {groups[group_key].length}</li>
        ))}
      </ul>
    </div>
  );
}

const Animal = ({player, key}) => {
  return (
    <li className="Animal-group-item" key={key}>
      <div className="Animal">
        <div className="Animal-emoji">{player.animal.emoji}</div>
        <div className="Animal-name">{player.subject}</div>
        {player.delivered &&
          <div>Email delivered at {formatDate(player.delivered)}.</div>
        }
        {player.opens &&
          <Opens opens={player.opens} />
        }
        {player.clicks &&
          <Clicks clicks={player.clicks} />
        }
      </div>
    </li>
  );
};

export default Animal;
