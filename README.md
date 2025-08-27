# SpringBoot Real-Time Chat Web Application

A real-time chat application built with Spring Boot and WebSocket technology, allowing users to communicate instantly in a shared chat room.

## Features

- **Real-time messaging** using WebSocket connections
- **User join/leave notifications** broadcast to all users
- **Responsive design** with Bootstrap CSS framework
- **Modern UI** with Google Fonts and Bootstrap Icons
- **Spring Boot backend** with WebSocket configuration
- **Production-ready** with proper context path configuration

## Technology Stack

- **Java 21**
- **Spring Boot 3.4.5**
- **WebSocket** for live communication
- **Lombok** to reduce boilerplate code
- **Spring DevTools** for hot-reloading in development
- **Maven** for build automation and dependency management

## WebSocket Endpoints

The application exposes the following WebSocket endpoints:

- **/ws** - WebSocket connection endpoint
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

- **JDK 21** or later
- **Maven 3.6+** (or compatible)

### Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/Jose-Daniel-Lopez/SpringBoot-RealTimeChat-WebApplication.git
   ```
2. **Navigate to the project directory:**
   ```sh
   cd SpringBoot-RealTimeChat-WebApplication
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
   http://localhost:8080/jose-chatapp
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

The JAR file will be created in the `target/` directory.

## Production Deployment

The application is configured with a context path `/jose-chatapp` for production deployment. Static resources (CSS/JS) use absolute paths to ensure proper loading in production environments.

### Configuration

- **Context Path:** `/jose-chatapp` (configured in `application.properties`)
- **Static Resources:** Served under the context path
- **WebSocket Endpoint:** Available at `/jose-chatapp/ws`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).
