import { WebSocketServer, WebSocket } from "ws";
import http from "http";
import url from "url";

const rooms = new Map<string, Set<WebSocket>>();

let wss: WebSocketServer;

export function setupWebSocket(server: http.Server): WebSocketServer {
  wss = new WebSocketServer({ server, path: "/ws" });

  wss.on("connection", (ws: WebSocket, req) => {
    const query = url.parse(req.url || "", true).query;
    const assignmentId = query.assignmentId as string;

    if (!assignmentId) {
      ws.close(4000, "Missing assignmentId");
      return;
    }

    // Join room
    if (!rooms.has(assignmentId)) {
      rooms.set(assignmentId, new Set());
    }
    rooms.get(assignmentId)!.add(ws);
    console.log(`[WS] Client joined room: ${assignmentId}`);

    ws.on("close", () => {
      const room = rooms.get(assignmentId);
      if (room) {
        room.delete(ws);
        if (room.size === 0) {
          rooms.delete(assignmentId);
        }
      }
      console.log(`[WS] Client left room: ${assignmentId}`);
    });

    ws.on("error", (err) => {
      console.error(`[WS] Error in room ${assignmentId}:`, err.message);
    });

    // Send initial ack
    ws.send(JSON.stringify({ event: "connected", assignmentId }));
  });

  console.log("✅ WebSocket server initialized");
  return wss;
}

export function emitToRoom(assignmentId: string, data: object): void {
  const room = rooms.get(assignmentId);
  if (!room) return;

  const message = JSON.stringify(data);
  for (const client of room) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  }
}

export function getWSS(): WebSocketServer | undefined {
  return wss;
}
