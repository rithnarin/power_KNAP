import React from 'react';
import cookie from 'cookie';
import CreateModal from 'react-modal';
import axios from 'axios';
import Alert from 'react-alert';

const customStyles = {
  content : {
    top                   : '25%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)',
    overflowY             : 'auto',
    background            : '#343a40',
  }
};

class NavBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null, // refers to Google username when logged in in chat
      createModalIsOpen: false,
      createInput: '',
    }

    this.alertOptions = {
      offset: 200,
      position: 'bottom left',
      theme: 'dark',
      time: 5000,
      transition: 'scale',
    }

    this.createRoom = this.createRoom.bind(this);
  }

  componentDidMount() {
    if (cookie.parse(document.cookie).user) {
      console.log(cookie.parse(document.cookie));
      this.setState({ user: cookie.parse(document.cookie).user })
    }
  }

  createRoom() {
    let roomExists = false;

    this.props.roomList.forEach((room) => {
      if (room.name === this.state.createInput) {
        roomExists = true;
        this.showAlert();
      }
    });

    if (!roomExists) {
      axios.post(`/createroom?name=${this.state.createInput}`)
      .then((response) => {
        this.closeCreateModal();
        this.props.setRoomId(response.data.id);
        this.props.changeView('room');
      })
      .catch(err => {
        console.error(err);
      });
    }
  }

  showAlert() {
    this.msg.show('Room name already exists', {
      time: 5000,
      type: 'error',
    });
  }

  openCreateModal() {
    this.setState({createModalIsOpen: true});
  }

  closeCreateModal() {
    this.setState({createModalIsOpen: false});
  }

  createRoom() {
    let roomExists = false;

    this.props.roomList.forEach((room) => {
      if (room.name === this.state.createInput) {
        roomExists = true;
        this.showAlert();
      }
    });
    if (!roomExists) {
      axios.post(`/createroom?name=${this.state.createInput}`)
      .then((response) => {
        this.closeCreateModal();
        this.props.setRoomId(response.data.id);
        this.props.changeView('room');
      })
      .catch(err => {
        console.error(err);
      });
    }
  }

  openCreateModal() {
    this.setState({createModalIsOpen: true});
  }

  closeCreateModal() {
    this.setState({createModalIsOpen: false});
  }

  render() {
    const view = this.state.user ?
      <ul>
        <li className="nav-link" onClick={ () => this.openCreateModal() }><a href="#">Create a Room</a></li>
        <li className="nav-link" onClick={ () => this.props.getUser(this.state.user) }><a href="#">{this.state.user}</a></li>
        <li className="nav-link"><a href="/auth/logout">Logout</a></li>
      </ul> :
      <li className="nav-link"><a href="/auth/google">Login</a></li>;

    return (
        <header>
          <div className="navbar navbar-dark bg-dark">
            <div className="container d-flex justify-content-between">
              <a href="/" className="navbar-brand">fam.ly</a>
              <nav>
                {view}
              </nav>
            </div>
          </div>
          <CreateModal
            isOpen={this.state.createModalIsOpen}
            onRequestClose={() => this.closeCreateModal()}
            style={customStyles}
            >
            <h2 ref={subtitle => this.subtitle = subtitle}>Create a Room</h2>
            <div class="input-group">
              <input
                className="form-control"
                placeholder="Room Name"
                onChange={ (e) => this.setState({ createInput: e.target.value }) } ></input>
              <span class="input-group-btn">
                <button
                  className="btn btn-secondary"
                  onClick={ () => this.createRoom() }>Create</button>
              </span>
            </div>
          </CreateModal>
          <Alert ref={a => this.msg = a} {...this.alertOptions} />

        </header>
    );
  }
}

export default NavBar;
