import React, { useEffect, useRef, useState } from "react";
import {useLocation} from "react-router-dom";
import styles from "./index.module.css";

const Room = ({ socket }) => {
  const [currMessage, setCurrMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const msgBoxRef = useRef();

  const location = useLocation();
  const { name: author, room } = location.state;


  const sendMessage = async () => {
    if (currMessage !== "") {
      const messageData = {
        room,
        author,
        message: currMessage,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };

      await socket.emit("send_message", messageData);
      setCurrMessage("");
    }
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessages((list) => [...list, data]);
    });
    return () => {
      socket.off("receive_message");
    }
  }, [socket]);

  useEffect(() => {
    if (msgBoxRef) {
      msgBoxRef.current.addEventListener('DOMNodeInserted', event => {
        const { currentTarget: target } = event;
        target.scroll({ top: target.scrollHeight, behavior: 'smooth' });
      });
    }
  }, [])

  return (
    <div className={styles.Container}>
      <div className={styles.Room}>
        <div className={styles.header}>
          <p>{room} | {author}</p>
        </div>
        <div className={styles.MessageBox} ref={msgBoxRef}>
          {messages.map((msg, ind) => {
            return (
              <div
                key={ind}
                className={[
                  styles.Message,
                  msg.author != author ? styles.Left : styles.Right,
                ].join(" ")}
              >
                <p>{msg.message}</p>
                <div className={styles.MessageInfo}>
                  <p>{msg.author}</p>
                  <p>{msg.time}</p>
                </div>
              </div>
            );
          })}
        </div>
        <div className={styles.SendBox}>
          <div className={styles.InputBox}>
            <input
              placeholder="enter a message..."
              value={currMessage}
              onChange={(e) => setCurrMessage(e.target.value)}
            ></input>
            <button onClick={sendMessage}>
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTAma70mbtm6GvFZYTWT_GnoCpEgn8CuO654A&usqp=CAU" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Room;
