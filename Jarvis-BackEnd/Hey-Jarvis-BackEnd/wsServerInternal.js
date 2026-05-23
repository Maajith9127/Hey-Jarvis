// import { WebSocketServer } from 'ws';

// let internalWss = null;

// function initInternalWebSocketServer(port = 3005) {
//     if (internalWss) {
//         console.log("Internal WebSocket server already initialized");
//         return internalWss;
//     }

//     internalWss = new WebSocketServer({ port });

//     internalWss.on('connection', socket => {
//         console.log(' New internal WebSocket client connected');
//         socket.send(JSON.stringify({ type: "internal-init-ack", message: "Connected to Internal WebSocket Server" }));

//         socket.on('message', data => {
//             console.log(' Internal client message:', data.toString());
//         });

//         socket.on('close', () => {
//             console.log(' Internal client disconnected');
//         });
//     });

//     console.log(`Internal WebSocket server listening on ws://localhost:${port}`);
//     return internalWss;
// }

// function getInternalWss() {
//     return internalWss;
// }

// export { initInternalWebSocketServer, getInternalWss };



import { WebSocketServer } from 'ws';
import dotenv from 'dotenv';
dotenv.config();

let internalWss = null;

function initInternalWebSocketServer(port = process.env.INTERNAL_WS_PORT || 3005) {
    if (internalWss) {
        console.log("Internal WebSocket server already initialized");
        return internalWss;
    }

    internalWss = new WebSocketServer({ port });

    internalWss.on('connection', socket => {
        console.log(' New internal WebSocket client connected');
        socket.send(JSON.stringify({
            type: "internal-init-ack",
            message: "Connected to Internal WebSocket Server"
        }));

        socket.on('message', data => {
            console.log(' Internal client message:', data.toString());
        });

        socket.on('close', () => {
            console.log(' Internal client disconnected');
        });
    });

    console.log(`Internal WebSocket server listening on ws://localhost:${port}`);
    return internalWss;
}

function getInternalWss() {
    return internalWss;
}

export { initInternalWebSocketServer, getInternalWss };
