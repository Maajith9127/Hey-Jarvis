
import { WebSocketServer } from 'ws';
import dotenv from 'dotenv';
dotenv.config();

let wss = null;

function initWebSocketServer(port = process.env.EXTERNAL_WS_PORT || 3001) {
    if (wss) {
        console.log("WebSocket server already initialized");
        return wss;
    }

    wss = new WebSocketServer({ port });

    wss.on('connection', socket => {
        console.log(' New WebSocket client connected');
        socket.send(JSON.stringify({
            type: "main-init-ack",
            message: "Connected to WebSocket server"
        }));

        socket.on('message', data => {
            console.log(' Client message:', data.toString());
        });

        socket.on('close', () => {
            console.log(' Client disconnected');
        });
    });

    console.log(` WebSocket server listening on ws://localhost:${port}`);
    return wss;
}

function getWss() {
    return wss;
}

export { initWebSocketServer, getWss };
