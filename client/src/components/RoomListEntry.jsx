import React from 'react';

const RoomListEntry = (props) => (
  <li className="room-choice"
    onClick={() => {
      props.setRoomId(props.room.id, props.room.name);
      props.changeView('room');
    }}>
    { props.room.name }
  </li>
);

export default RoomListEntry;
