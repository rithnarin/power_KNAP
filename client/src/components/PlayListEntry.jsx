import React from 'react';
import PropTypes from 'prop-types';


const PlaylistEntry = ({ song, index, isHost, removeSelected, vote, removeForHost}) => {

  return (
      <div className="playlistEntry">
        <div className="songTitle">{index}. {song.videoName} </div>
          Votes: {song.roomvideos.votes}
          <div class="btn-group btn-group-sm voteButton">
            <button className="btn btn-success"  onClick={() => {
                vote(song.id, song.videoName, '+')
              }}>

              +
            </button>
            <button className="btn btn-warning"  onClick={() => {
                vote(song.id, song.videoName, '-')
              }}>

              -
            </button>

            {isHost &&
              <button className="btn btn-danger" onClick={() => { removeForHost(song.videoName); }}>
                Remove for Host
              </button>
            }
            {!isHost &&
              <button className="btn btn-danger" onClick={() => { removeSelected(song.videoName); }}>
                Remove
              </button>
            }
          </div>
      </div>
    );
};

PlaylistEntry.propTypes = {
  song: PropTypes.instanceOf(Object).isRequired,
};

export default PlaylistEntry;
