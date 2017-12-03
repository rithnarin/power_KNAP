import React from 'react';
import io from 'socket.io-client';
import moment from 'moment';
import axios from 'axios';
import cookie from 'cookie';
import PropTypes from 'prop-types';

import VideoPlayer from './VideoPlayer';
import Playlist from './Playlist';
import Search from './Search';
import ChatView from './ChatView';

const roomSocket = io('/room');

class RoomView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentVideo: undefined,
      playlist: [],
      roomName: '',
      startOptions: null,
      isHost: false,
      message: '',
      username: 'Anonymous', // refers to socketIDs when user is in chat but not logged in
      // TODO: eliminate the need for two separate username references
    };


    this.removeVideoFromPlaylist = videoName => roomSocket.emit('removeFromPlaylist', videoName, this.state.playlist.indexOf(this.state.currentVideo));
    this.onPlayerStateChange = this.onPlayerStateChange.bind(this);
    this.emitMessage = this.emitMessage.bind(this);
    this.addToPlaylist = this.addToPlaylist.bind(this);
    this.onPlayerReady = e => e.target.playVideo();
    this.onPlayerReady = this.onPlayerReady.bind(this);
    this.saveToPlaylist = video => roomSocket.emit('saveToPlaylist', video);
    this.saveToPlaylist = this.saveToPlaylist.bind(this);
    this.vote = this.vote.bind(this);
  }

  componentDidMount() {
    this.props.closeModal();
    if (cookie.parse(document.cookie).user) {
      this.setState({ user: cookie.parse(document.cookie).user });
    }
    this.renderRoom();
    // emit room so server will join us to that socket-room
    roomSocket.emit('room', this.props.roomId);
    roomSocket.on('default', () => this.setState({ currentVideo: undefined }));
    roomSocket.on('host', () => this.setState({ isHost: true }));
    roomSocket.on('retrievePlaylist', (videos) => {
      // console.log('Received retrievePlaylist from server. Videos.length is: ', videos.length);
      return this.addToPlaylist(videos);
    });
    roomSocket.on('playNext', (next) => {
      // console.log('Received playNext from server, changing currentVideo to next in playlist.');
      // console.log('next is: ', next, ', and that video is: ', this.state.playlist[next]);
      this.setState({
        currentVideo: this.state.playlist[next],
      });
    });
    roomSocket.on('error', err => console.error(err));
    roomSocket.on('pushingMessage', (message) => {
      // console.log('Received pushingMessage: ', message);
      this.setState({
        message,
      });
    });
    // roomSocket.on('id', id => this.setState({ username: id }));
    if (cookie.parse(document.cookie).user) {
      this.setState({ username: cookie.parse(document.cookie).user })
    }
  }

  componentWillUnmount() {
    roomSocket.disconnect();
  }

  onPlayerStateChange(e) {
    // console.log('this.state.playlist.length is: ', this.state.playlist.length);
    // console.log('this.state.currentVideo is: ', this.state.currentVideo);
    // when video has ended
    if (e.data === 0) {
      // console.log('player state change. e.data is: ', e.data);
      // if (this.state.isHost) {
        // axios.patch(`/playNext/${this.state.playlist.length - 1}`);
        axios.patch(`/playNext?length=${this.state.playlist.length - 1}&roomId=${this.props.roomId}`);
      // }
      this.setState({
        startOptions: { playerVars: { start: 0 } },
      });
    }
    // when video is unstarted
    if (e.data === -1) {
      e.target.playVideo();
    }
  }

  addToPlaylist(videos) {
    // console.log('\naddToPlaylist called, videos.length: ', videos.length);
    if (videos.length === 1) {
      this.setState({
        playlist: videos,
        currentVideo: videos[0],
        startOptions: { playerVars: { start: 0 } },
      }) //, () => console.log('Current index is: ', this.state.playlist.indexOf(this.state.currentVideo)));
    } else {
      this.setState({ playlist: videos });
    }
  }

  emitMessage(time, message) {
    roomSocket.emit('emitMessage', {
      body: message,
      userName: this.state.username,
      dateTime: time,
    });
  }

  vote(videoId, videoName, sign) {
    roomSocket.emit('vote', this.props.roomId, videoId, sign)
    //console.log(`Voted ${sign} on video '${videoName}' in room ${this.props.roomId}`)
  }

  renderRoom() {
    //console.log('Render room called. Room id was: ', this.props.roomId);
    return axios.get(`/room/${this.props.roomId}`)
      .then(({ data }) => {
        // console.log('Room id was: ', this.props.roomId);
        // console.log('Room data is: ', data);
        const currentTime = Date.now();
        const timeLapsed = moment.duration(moment(currentTime).diff(data.start)).asSeconds();
        this.setState({
          playlist: data.videos,
          currentVideo: data.videos[data.index],
          startOptions: {
            playerVars: { start: Math.ceil(timeLapsed) },
          },
        });
      })
      .catch(err => console.error('Could not retrieve playlist: ', err));
  }

  render() {
    const playlistComponent =
      (<Playlist
        playlist={this.state.playlist}
        removeSelected={this.removeVideoFromPlaylist}
        isHost={this.state.isHost}
        vote={this.vote}
        removeForHost={this.state.isHost ? this.removeVideoFromPlaylist : undefined}
      />);

    return (
      <div>
        <div className="room">
          {playlistComponent}
          <VideoPlayer
            currentVideo={this.state.currentVideo}
            opts={this.state.startOptions}
            onReady={this.onPlayerReady}
            onStateChange={this.onPlayerStateChange}
          />
          <Search saveToPlaylist={this.saveToPlaylist} />
          <ChatView
            message={this.state.message}
            date={this.state.dateTime}
            username={this.state.username}
            emitMessage={this.emitMessage}
            getUser={this.props.getUser}
            roomName={this.props.roomName}
          />
        </div>
      </div>
    );
  }
}

export default RoomView;
RoomView.propTypes = {
  roomId: PropTypes.number.isRequired,
};
