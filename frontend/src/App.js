import { useState } from 'react';
import {  useNavigate } from 'react-router-dom';
import styles from './App.module.css';

export default function App({socket}) {
  const [name, setName] = useState('');
  const [roomName, setRoomName] = useState('');

  const navigate = useNavigate();

  const joinRoom = () => {
    if(name == "" || roomName == ""){
      alert("Please fill the fields..");
      return;
    }
    socket.emit("join_room", {name, room: roomName});
    navigate('/joinRoom', {
      state:{
        name,
        room: roomName,
      }
    })
  }

  return (
    <div className={styles.Container}>
      <div className={styles.Box}>
        <h1>Join Room</h1>
        <input placeholder='enter you name' value={name} onChange={(e) => setName(e.target.value)} />
        <input placeholder='enter room name' value={roomName} onChange={(e) => setRoomName(e.target.value)}/>
        <button onClick={joinRoom}>Join</button>
      </div>
    </div>
  )
}
