// App.js
import React, { useState, useEffect } from 'react';
import axios from "axios";
import { useLocation } from 'react-router-dom';
import io from "socket.io-client";
import ScrollToBottom from 'react-scroll-to-bottom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { FaTrashAlt } from 'react-icons/fa';
import { Link } from "react-router-dom";

const socket = io.connect("http://localhost:5000");

function App() {
  const location = useLocation();
  const [messageList, setMessageList] = useState([]);
  const [users, setUsers] = useState([]);
  const [inputText, setInputText] = useState('');
  const [room, setRoom] = useState('');
  const [selected, setSelected] = useState('');

  const [helper, setHelper] = useState(false);

  // Join the chat room when the username changes


  const handleUserClick = async (username) => {
    const newRoom = generateRoomId(location.state.Username, username);

    // Update room state and selected user
    setRoom(newRoom);
    // setMessageList([])
    await axios.get(`http://localhost:8000/${newRoom}`)
      .then((response) => {
        // Extract chat messages from the response data
        const chatHistory = response.data;

        // Update message list state with the retrieved chat history
        // console.log(chatHistory)
        setMessageList(chatHistory);
      })
      .catch((error) => {
        console.error('Error fetching chat history:', error);
        // Handle error (e.g., display an error message)
      });
    // Reset message list and helper state
    setHelper(true);

    // Generate room ID for the conversation between current user and selected user
    setSelected(username);

    // Emit "join_room" event with the updated room state
    socket.emit("join_room", newRoom);

    // Fetch chat history for the selected room from the server
  };


  const sendMessage = (e) => {
    e.preventDefault();
    if (inputText === '') return;
    const timestamp = new Date();
    const messageData = {
      room: room,
      sender: location.state.Username,
      receiver: selected,
      message: inputText,
      time: timestamp.toLocaleTimeString()// Add the current time
    };

    socket.emit("send_message", messageData);
    axios.post(`http://localhost:8000/${room}`, messageData)
      .then(res => {
        console.log(res.data); // Log the response from the server
      })
      .catch(error => {
        alert("Error sending message"); // Display an error message
        console.error("Error sending message:", error); // Log the error
      });
    setMessageList(prev => [...prev, messageData]);
    setInputText('');

  };
  const generateRoomId = (userId1, userId2) => {
    // Sort user IDs lexicographically and concatenate them to form the room ID
    const sortedUserIds = [userId1, userId2].sort();
    console.log(sortedUserIds.join('_'))
    return sortedUserIds.join('_');

  };
  // Handle user click

  // Fetch users from the server
  useEffect(() => {
    axios.get("http://localhost:5000/")
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.error('Error fetching users:', error);
      });
  }, []);

  // Receive messages from the server
  useEffect(() => {
    // console.log("useeffect")
    socket.on("receive_message", (receivedMessageData) => {
      setMessageList(prev => [...prev, receivedMessageData]);
      // console.log("receive message")
    });
  }, []);

  return (
    <div className="chat-container">


      <div className="users">
        <h2>ChatHarbor</h2>
        <div className='users_container'>
          {users.map((user) => {
            if (user.Username !== location.state.Username) {
              return (
                <div
                  onClick={() => handleUserClick(user.Username)}
                  className='user'
                  key={user.Username}
                >
                  {user.Username}
                </div>
              );
            } else {
              return null;
            }
          })}
        </div>
        <div className='admin'>{location.state.Username}</div>
      </div>

      <div className="chat-box">
        {helper ? (
          <>
            <div className="chat-body">
              <div class="user-profile">
                <div class="username">{selected}</div>
                <Link to="/">
                  <FontAwesomeIcon icon={faSignOutAlt} className="logout-icon" />
                </Link>

              </div>

              <ScrollToBottom className="message-container">
                {messageList.map((messageContent, index) => (
                  <div className={`message ${messageContent.sender === location.state.Username ? 'you' : 'other'}`} key={index}>
                    <div className="message-bubble">
                      <strong>{messageContent.sender} :</strong>
                      <span>{messageContent.message}</span>
                    </div>
                    <div className="message-meta">
                      <p className="message-time">{messageContent.time}</p>
                    </div>
                  </div>
                ))}
              </ScrollToBottom>
              <form onSubmit={sendMessage} className="input-box">
                <input
                  type="text"
                  placeholder="Type your message..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                />
                <input type='submit' value="Send" />
                <button className="clear-button" >
                  <FaTrashAlt className="trash-icon" />
                  Clear
                </button>

              </form>
            </div>
          </>
        ) : (
          <>
            <Link to="/">
              <FontAwesomeIcon icon={faSignOutAlt} className="logout-icon-home" />
            </Link>
            <div className='video'>
              <video src='/videos/robot.mp4' autoPlay loop >

              </video>
            </div>

          </>
        )}
      </div>
    </div>
  );
}

export default App;
