import React from 'react';
import PropTypes from 'prop-types';
import PlaylistEntry from './PlayListEntry';

const Playlist = ({ playlist, isHost, removeSelected, vote, removeForHost }) => (

  <div className="container playlist">
    { playlist.length <= 0 ? <h3>Nothing in playlist</h3> :
      <div className="scroll">
        {playlist.map((song, index) =>
          (<PlaylistEntry
            song={song}
            key={song.id}
            isHost={isHost}
            index={index + 1}
            removeSelected={removeSelected}
            vote={vote}
            removeForHost={removeForHost}
            />))}
          </div>
    }
  </div>
);

Playlist.propTypes = {
  playlist: PropTypes.instanceOf(Array).isRequired,
};

export default Playlist;
