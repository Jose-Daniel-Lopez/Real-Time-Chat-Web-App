'use strict';

// DOM Elements
const usernamePage = document.querySelector('#username-page');
const chatPage = document.querySelector('#chat-page');
const usernameForm = document.querySelector('#usernameForm');
const messageForm = document.querySelector('#messageForm');
const messageInput = document.querySelector('#message');
const messageArea = document.querySelector('#messageArea');
const connectingElement = document.querySelector('.connecting');

let stompClient = null;
let username = null;

const colors = [
    '#2196F3', '#32c787', '#00BCD4', '#ff5652',
    '#ffc107', '#ff85af', '#FF9800', '#39bbb0'
];

// Connects to WebSocket and transitions UI
const connect = (event) => {
    event.preventDefault();
    username = document.querySelector('#name').value.trim();

    if (!username) {
        alert('Please enter a username!');
        return;
    }

    usernamePage.classList.add('hidden');
    chatPage.classList.remove('hidden');

    // Get the base path from the base tag, fallback to root
    const base = document.querySelector('base')?.getAttribute('href') || '/';
    const sockPath = (base.endsWith('/') ? base.slice(0, -1) : base) + '/ws';
    const socket = new SockJS(sockPath);
    stompClient = Stomp.over(socket);

    stompClient.connect({}, onConnected, onError);
};

// On successful connection
const onConnected = () => {
    // Subscribe to the Public Topic
    stompClient.subscribe('/topic/public', onMessageReceived);

    // Notify server of new user
    stompClient.send('/app/chat.addUser', {}, JSON.stringify({
        sender: username,
        type: 'JOIN'
    }));

    connectingElement.classList.add('hidden');
};

// On connection error
const onError = (error) => {
    connectingElement.textContent = 'Could not connect to WebSocket server. Please refresh this page to try again!';
    connectingElement.classList.add('error');
};

// Sends a chat message
const sendMessage = (event) => {
    event.preventDefault();
    const messageContent = messageInput.value.trim();

    if (messageContent && stompClient) {
        const chatMessage = {
            sender: username,
            content: messageContent,
            type: 'CHAT'
        };
        stompClient.send('/app/chat.sendMessage', {}, JSON.stringify(chatMessage));
        messageInput.value = '';
    }
};

// Handles incoming messages
const onMessageReceived = (payload) => {
    const message = JSON.parse(payload.body);
    const messageElement = document.createElement('li');

    if (message.type === 'JOIN' || message.type === 'LEAVE') {
        messageElement.classList.add('event-message');
        messageElement.textContent = `${message.sender} ${message.type === 'JOIN' ? 'joined!' : 'left!'}`;
    } else {
        messageElement.classList.add('chat-message');

        // Avatar
        const avatarElement = document.createElement('i');
        avatarElement.textContent = message.sender[0].toUpperCase();
        avatarElement.style.backgroundColor = getAvatarColor(message.sender);

        // Username
        const usernameElement = document.createElement('span');
        usernameElement.textContent = message.sender;

        // Message text
        const textElement = document.createElement('p');
        textElement.textContent = message.content;

        messageElement.append(avatarElement, usernameElement, textElement);
    }

    messageArea.appendChild(messageElement);
    messageArea.scrollTop = messageArea.scrollHeight;
};

// Generates a color for the avatar based on username
const getAvatarColor = (messageSender) => {
    let hash = 0;
    for (let i = 0; i < messageSender.length; i++) {
        hash = 31 * hash + messageSender.charCodeAt(i);
    }
    const index = Math.abs(hash % colors.length);
    return colors[index];
};

// Event Listeners
usernameForm.addEventListener('submit', connect);
messageForm.addEventListener('submit', sendMessage);
