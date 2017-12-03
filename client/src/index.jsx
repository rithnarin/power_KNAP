import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import RoomList from './components/RoomList';
import Modal from 'react-modal';
import NavBar from './components/NavBar';
import Messages from './components/Messages';
import RoomView from './components/RoomView';
import Home from './components/Home';
import RoomListEntry from './components/RoomListEntry';
import UserProfile from './components/UserProfile';

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)',
    overflowY             : 'auto',
  }
};


class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      roomList: [{}],
      modalIsOpen: false,
      view: 'home',
      user: {},
      roomId: 1,
      roomName: name,
    };

    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.renderView = this.renderView.bind(this);
    this.changeView = this.changeView.bind(this);
    this.getUser = this.getUser.bind(this);
    this.setRoomId = this.setRoomId.bind(this);
  }

  componentDidMount() {
    this.setState({
      view: 'home',
    });

    this.getRoomList();
  };

  getUser(user) {
    fetch(`/users?user=${user}`)
      .then(response => response.json())
      .then(user => this.setState({
        user: user,
      }))
      .then(() => {
        this.changeView('user');
      })
      .catch(err => console.error(err));
  }

  openModal() {
    this.setState({ modalIsOpen: true });
  }

  afterOpenModal() {
    // references are now sync'd and can be accessed.
    this.subtitle.style.color = '#000';
  }

  closeModal() {
    this.setState({ modalIsOpen: false });
  }

  renderView() {
    const { view } = this.state;

    if (view === 'home') {
      return <Home openModal={this.openModal} />;
    } else if (view === 'room') {
      return <RoomView
        roomId={this.state.roomId}
        roomName={this.state.roomName}
        closeModal={this.closeModal}
        getUser={this.getUser} />;
    } else if (view === 'user') {
      return <UserProfile user={this.state.user} />;
    }
  }

  changeView(view) {
    this.setState({
      view: view,
    });
    // axios.get('/rooms')
    //   .then(({ data }) => this.setState({ roomList: data.rooms }));
  }

  getRoomList() {
    fetch('/rooms')
      .then(response => response.json())
      .then(data => {
        this.setState({
          roomList: data
        });
      })
      .catch(err => {
        console.err(err);
      })
  }

  setRoomId(id, name) {
    this.setState({
      roomId: id,
      roomName: name,
    });
  }

  render() {
    return (
      <div>
        <NavBar
          getUser={this.getUser}
          setRoomId={this.setRoomId}
          changeView={this.changeView}
          roomList={this.state.roomList} />
        { this.renderView() }

        <Modal
          isOpen={this.state.modalIsOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          style={customStyles}
          >
          <h2 ref={subtitle => this.subtitle = subtitle}>Select Room</h2>
          <RoomList
            rooms={this.state.roomList}
            changeView={this.changeView}
            setRoomId={this.setRoomId} />
        </Modal>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
