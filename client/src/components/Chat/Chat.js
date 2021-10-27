import React, { useState, useEffect } from 'react'
import queryString from 'query-string'
import io from 'socket.io-client'

import InfoBar from '../InfoBar/InfoBar'
import Input from '../Input/Input'
import Messages from '../Messages/Messages'
import TextContainer from '../TextContainer/TextContainer'

import './Chat.css'

let socket;


const Chat = ({ location }) => {
    const [name, setName] = useState('');
    const [room, setRoom] = useState('');
    const [users, setUsers] = useState('')
    const [message, setMessage] = useState('')
    const [messages, setMessages] = useState([])
    const ENDPOINT = 'https://stay-connected-react-app.herokuapp.com/'

    useEffect(() => {
        const { name, room } = queryString.parse(location.search);

        socket = io(ENDPOINT)

        setName(name)
        setRoom(room)

        socket.emit('join', { name, room }, () => {
            // error handling callback function
        })

        //componentDidUnmount
        return () => {
            socket.emit('disconnect')
            socket.off()
        }

    }, [ENDPOINT, location.search])

    useEffect(() => {
        //listen from backend and put all message to array messages
        socket.on('message', (message) => {
            setMessages([...messages, message])
        })

        //get who in the room
        socket.on('roomData', ({ users }) => {
            setUsers(users)
        })
    }, [messages])

    //function for sending messages
    const sendMessage = (event) => {
        event.preventDefault()

        if (message) {
            //emit one message to backend
            socket.emit('sendMessage', message, () => setMessage(''))
        }
    }

    console.log(message, messages);
    console.log(users);

    return (
        <div className="outerContainer">
            <div className="container">
                <InfoBar room={room} />
                <Messages messages={messages} name={name} />
                <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
            </div>
            <TextContainer users={users} />
        </div>
    )
}

export default Chat
