# Real-Time Chat Application

A modern, real-time chat application built with **Spring Boot** and **WebSocket** technology. Instantly join chat rooms, exchange messages, and see live user activity-all in a responsive, intuitive UI.

---

## Features

- **Real-time messaging** via WebSocket protocol
- **User status notifications** (join/leave events)
- **Simple, intuitive UI**
- **Responsive design** for desktop and mobile

## Technologies Used

- **Java 23**
- **Spring Boot 3.4.5**
- **WebSocket** for live communication
- **Lombok** to reduce boilerplate code
- **Spring DevTools** for hot-reloading in development
- **Maven** for build automation and dependency management

## Project Structure

```
src/
├── main/
│   ├── java/
│   │   └── com/
│   │       └── example/
│   │           └── demo/
│   │               ├── controller/
│   │               │   └── ChatController.java
│   │               ├── model/
│   │               │   └── ChatMessage.java
│   │               └── ChatApplication.java
│   └── resources/
│       ├── static/
│       │   ├── css/main.css
│       │   ├── js/main.js
│       │   └── index.html
│       └── application.properties
└── test/
```

## API Endpoints

- **/chat.sendMessage** - Send messages to all users
- **/chat.addUser** - Add a new user to the chat

All messages are published to the `/topic/public` destination.

## How It Works

1. Users connect to the WebSocket server.
2. On join, usernames are stored in the session.
3. Messages are broadcast to all connected clients.
4. Join/leave events are also broadcast to everyone in real-time.

## Getting Started

### Prerequisites

- **JDK 23** or later
- **Maven 3.6+** (or compatible)

### Installation

1. **Clone the repository:**
   ```sh
   [git clone https://github.com/yourusername/ChatApplication.git](https://github.com/Jose-Daniel-Lopez/Real-Time-Chat-Web-App.git)
   ```
2. **Navigate to the project directory:**
   ```sh
   cd ChatApplication
   ```
3. **Build the project:**
   ```sh
   mvn clean install
   ```
4. **Run the application:**
   ```sh
   mvn spring-boot:run
   ```
5. **Open your browser at:**
   ```
   http://localhost:8080
   ```

## Usage

1. Enter your username when prompted.
2. Start chatting in the room.
3. Watch real-time updates as users join or leave.

## Development

Spring Boot DevTools is enabled for hot-reloading. Java class changes trigger automatic restarts; static resource changes are reflected instantly.

### Building for Production

To create a standalone JAR:

```sh
mvn clean package
```

The JAR will be in the `target` directory.

## Screenshots

![Image 1](https://i.imgur.com/Pd1HCVA.jpg)

![Image 2](https://media.discordapp.net/attachments/595710068876378112/1370803587466399785/CleanShot_2025-05-10_at_18.43.512x.png?ex=6820d3d3&is=681f8253&hm=8c13c312f9287c92ea62923bbfbc5dca7fac2a88baf761e5adcbe37d03a0f6d3&=&format=webp&quality=lossless&width=2224&height=1445)

![Image 3](https://i.imgur.com/HGeCd0B.jpg)

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

This project is open for everyone to use, modify, and share. No license or contract applies.

## Acknowledgments

- The Spring Boot team for their excellent framework
- The WebSocket protocol for enabling real-time communication
