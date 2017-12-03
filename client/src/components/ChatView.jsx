import React from 'react';
import PropTypes from 'prop-types';
import MessageInput from './MessageInput';
import Messages from './Messages';

class ChatView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      color: '',
    };
    this.sendMessage = this.sendMessage.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.messages.length > 0) {
      if (nextProps.message.dateTime !== this.state.messages[this.state.messages.length - 1].date) {
        this.setState({
          messages: this.state.messages.concat({
            message: nextProps.message.body,
            username: nextProps.message.userName,
            date: nextProps.message.dateTime,
            color: nextProps.message.userColor,
          }),
        });
      }
    } else if (nextProps.message !== '') {
      this.setState({
        messages: this.state.messages.concat({
          message: nextProps.message.body,
          username: nextProps.message.userName,
          date: nextProps.message.dateTime,
          color: nextProps.message.userColor,
        }),
      });
    }
  }

  sendMessage(time, message) {
    this.props.emitMessage(time, message);
  }

  getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  render() {
    return (
      <div className="container userChat">
        <h3>{ this.props.roomName }</h3>
        <div className="scroll">
          <div className="messageContainer">
            <Messages
              messages={this.state.messages}
              getUser={this.props.getUser}
              getRandomColor={this.getRandomColor}
              color={this.color} />
          </div>
          <div className="messageInput">
            <MessageInput sendMessage={this.sendMessage} />
          </div>
        </div>
      </div>
    );
  }
}

ChatView.propTypes = {
  emitMessage: PropTypes.func.isRequired,
  message: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
  ]).isRequired,
};

export default ChatView;
