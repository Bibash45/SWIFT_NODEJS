import db from "../config/db.config.js";
import { isValidId } from "../utils/integerIsValid.js";

const onlineUsers = new Map(); // userId -> Set of socketIds

const setupSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("3> Socket connected:", socket.id);

    // 1. Register user with multiple sockets support
    socket.on("register", async (userId) => {
      if (!isValidId(userId)) {
        console.error(`❌ Invalid userId in register: ${userId}`);
        return;
      }
      userId = Number(userId);
      if (!onlineUsers.has(userId)) {
        onlineUsers.set(userId, new Set());
      }
      onlineUsers.get(userId).add(socket.id);
      console.log(`🟢 User ${userId} is online (socket ${socket.id})`);

      // Fetch and send unread messages
      try {
        const [unseenMessages] = await db.query(
          `SELECT m.*
           FROM messages m
           JOIN conversationParticipants cp ON m.conversationId = cp.conversationId
           LEFT JOIN messageStatuses ms ON ms.messageId = m.id AND ms.userId = ?
           WHERE cp.userId = ? AND ms.id IS NULL AND m.senderId != ?`,
          [userId, userId, userId]
        );

        unseenMessages.forEach((msg) => {
          io.to(socket.id).emit("receive-message", msg);
        });

        console.log(
          `📦 Sent ${unseenMessages.length} unread messages to user ${userId}`
        );
      } catch (error) {
        console.error("❌ Failed to fetch/send unread messages:", error);
      }
    });

    // 2. Handle sending a message
    socket.on("send-message", async ({ conversationId, senderId, content }) => {
      if (!isValidId(conversationId)) {
        console.error(`❌ Invalid conversationId: ${conversationId}`);
        return;
      }
      if (!isValidId(senderId)) {
        console.error(`❌ Invalid senderId: ${senderId}`);
        return;
      }
      if (typeof content !== "string" || content.trim() === "") {
        console.error("❌ Invalid content");
        return;
      }

      conversationId = Number(conversationId);
      senderId = Number(senderId);
      try {
        // Save message to DB
        const [result] = await db.query(
          "INSERT INTO messages (conversationId, senderId, content, sentAt) VALUES (?, ?, ?, NOW())",
          [conversationId, senderId, content]
        );

        const [newMessageRows] = await db.query(
          "SELECT * FROM messages WHERE id = ?",
          [result.insertId]
        );
        const newMessage = newMessageRows[0];

        // Notify sender (confirm message sent)
        io.to(socket.id).emit("receive-message", newMessage);

        // Get other participants in the conversation
        const [participants] = await db.query(
          "SELECT userId FROM conversationParticipants WHERE conversationId = ? AND userId != ?",
          [conversationId, senderId]
        );

        for (const participant of participants) {
          const socketIds = onlineUsers.get(participant.userId);
          if (socketIds) {
            socketIds.forEach((sockId) => {
              io.to(sockId).emit("receive-message", newMessage);
            });
          }
        }
      } catch (err) {
        console.error("❌ Error sending message:", err);
      }
    });

    // 3. Mark message as delivered
    socket.on("message-delivered", async ({ messageId, userId }) => {
      if (!isValidId(messageId)) {
        console.error(`❌ Invalid messageId: ${messageId}`);
        return;
      }
      if (!isValidId(userId)) {
        console.error(`❌ Invalid userId: ${userId}`);
        return;
      }

      messageId = Number(messageId);
      userId = Number(userId);
      try {
        await db.query(
          "INSERT IGNORE INTO messageStatuses (messageId, userId, status) VALUES (?, ?, 'DELIVERED')",
          [messageId, userId]
        );
      } catch (error) {
        console.error("❌ Error marking message delivered:", error);
      }
    });

    // 4. Mark message as read (new)
    socket.on("message-read", async ({ messageId, userId }) => {
      if (!isValidId(messageId)) {
        console.error(`❌ Invalid messageId for read: ${messageId}`);
        return;
      }
      if (!isValidId(userId)) {
        console.error(`❌ Invalid userId for read: ${userId}`);
        return;
      }

      messageId = Number(messageId);
      userId = Number(userId);

      try {
        // Upsert or insert with status = 'READ'
        await db.query(
          `INSERT INTO messageStatuses (messageId, userId, status) VALUES (?, ?, 'READ')
           ON DUPLICATE KEY UPDATE status = 'READ', updatedAt = NOW()`,
          [messageId, userId]
        );

        // Optionally, notify the sender and other participants about the read receipt
        // First fetch message to get senderId and conversationId
        const [messageRows] = await db.query("SELECT * FROM messages WHERE id = ?", [messageId]);
        if (messageRows.length === 0) return;
        const message = messageRows[0];

        // Notify sender that message was read
        const senderSocketIds = onlineUsers.get(message.senderId);
        if (senderSocketIds) {
          senderSocketIds.forEach(sockId => {
            io.to(sockId).emit("message-read", {
              messageId,
              readerId: userId,
              conversationId: message.conversationId,
            });
          });
        }
      } catch (error) {
        console.error("❌ Error marking message read:", error);
      }
    });

    // 5. Handle disconnect - remove socket from user's socket set
    socket.on("disconnect", () => {
      for (const [userId, socketIds] of onlineUsers) {
        if (socketIds.has(socket.id)) {
          socketIds.delete(socket.id);
          if (socketIds.size === 0) {
            onlineUsers.delete(userId);
            console.log(`🔴 User ${userId} went offline`);
          } else {
            console.log(
              `🟠 User ${userId} disconnected socket ${socket.id}, still online with ${socketIds.size} socket(s)`
            );
          }
          break;
        }
      }
      console.log("❌ Socket disconnected:", socket.id);
    });
  });
};

export default setupSocket;
