// For some reason which I still need to figure out, this file cannot be imported in deployment.
// For now, all this code is pasted into index.html
// Until I find a way fix paths
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
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
    'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)'
];

// Auto-scroll when chat gets flooded or user is already near the bottom
const AUTO_SCROLL_THRESHOLD = 200; // force autoscroll when message count >= this
const MAX_MESSAGE_KEEP = 2000; // safety cap: drop oldest messages beyond this


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

    // WebSocket path construction for VPS deployment: always use the base href
    const base = document.querySelector('base')?.getAttribute('href') || '/';
    const cleanBase = base.replace(/\/$/, '');
    const sockPath = cleanBase + '/ws';
    
    console.log('Connecting to WebSocket at:', sockPath); // Debug log
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


// Check if user is near the bottom of the chat
const isUserNearBottom = () => {
    const threshold = 100; // pixels from bottom
    return (messageArea.scrollHeight - messageArea.scrollTop - messageArea.clientHeight) <= threshold;
};

// On connection error
const onError = (_error) => {
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
    
    // Check if user is near bottom before adding message
    const wasNearBottom = isUserNearBottom();
    const willBeFlooded = messageArea.childElementCount >= AUTO_SCROLL_THRESHOLD;

    if (message.type === 'JOIN' || message.type === 'LEAVE') {
        messageElement.classList.add('event-message');
        messageElement.innerHTML = `
            <i class="bi bi-${message.type === 'JOIN' ? 'person-plus-fill' : 'person-dash-fill'} me-2"></i>
            ${message.sender} ${message.type === 'JOIN' ? 'joined the chat' : 'left the chat'}
        `;
    } else {
        messageElement.classList.add('chat-message');

        // Avatar
        const avatarElement = document.createElement('i');
        avatarElement.textContent = message.sender[0].toUpperCase();
        avatarElement.style.background = getAvatarColor(message.sender);

        // Username with timestamp
        const usernameElement = document.createElement('span');
        const timestamp = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        usernameElement.innerHTML = `${message.sender} <small class="text-muted ms-2">${timestamp}</small>`;

        // Message text
        const textElement = document.createElement('p');
        textElement.textContent = message.content;

        messageElement.append(avatarElement, usernameElement, textElement);
    }

    // Add fade-in animation
    messageElement.classList.add('fade-in');

    // Append the new message
    messageArea.appendChild(messageElement);

    // Trim oldest messages if we exceed safety cap to avoid unbounded growth
    if (messageArea.childElementCount > MAX_MESSAGE_KEEP) {
        const removeCount = messageArea.childElementCount - MAX_MESSAGE_KEEP;
        for (let i = 0; i < removeCount; i++) {
            if (messageArea.firstChild) messageArea.removeChild(messageArea.firstChild);
        }
    }

    // Auto-scroll logic with notification system
    const shouldAutoScroll = wasNearBottom || willBeFlooded;
    
    if (shouldAutoScroll) {
        // Auto-scroll and hide notification if showing
        messageArea.scrollTop = messageArea.scrollHeight;
    } else {
    // User is not near bottom: do not auto-scroll. No notifications are shown.
    }
};

// Generates a gradient color for the avatar based on username
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

// Note: no scroll-based notifications. If the user is not near the bottom,
// messages will accumulate until they manually scroll down.