import React from 'react';
import './Animal.css';
import moment from 'moment';
import _ from 'lodash';

const formatDate = (unixStr) => {
  return moment(unixStr, "X").format("llll")
}

const Opens = ({opens}) => {
  let arr = _.sortBy(_.toArray(opens), (item) => {
    return moment(item.timestamp, "X");
  }).reverse();
  return (
    <div className="Open"><span className="title">Last Opened:</span> <br />{formatDate(arr[0].timestamp)}</div>
  );
};

const Clicks = ({clicks}) => {
  let arr = _.toArray(clicks);
  let groups = _.groupBy(arr, 'target_link_name');
  let group_keys = Object.keys(groups);
  return (
    <div className="Click"><span className="title">Clicks:</span>
      <ul className="Click-group">
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
          <div className="Delivered"><span className="title">Email Delivered:</span><br /> {formatDate(player.delivered)}.</div>
        }
        {player.opens &&
          <Opens opens={player.opens} />
        }
        {player.clicks &&
          <Clicks clicks={player.clicks} />
        }
        {!player.delivered && !player.opens && !player.clicks &&
          <div>Whoosh! We're sending you an email!</div>
        }
      </div>
    </li>
  );
};

export default Animal;
