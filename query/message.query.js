import db from "../config/db.config.js";

// 1. Get conversations for user
export const getConversationsByUserId = async (userId) => {
  const [rows] = await db.query(
    `SELECT DISTINCT c.*
     FROM conversations c
     JOIN conversationParticipants cp ON c.id = cp.conversationId
     WHERE cp.userId = ?
     ORDER BY c.updatedAt DESC`,
    [userId]
  );
  return rows;
};

// 2. Get messages in a conversation
export const getMessagesByConversationId = async (conversationId) => {
  const [rows] = await db.query(
    `SELECT * FROM messages
     WHERE conversationId = ?
     ORDER BY sentAt ASC`,
    [conversationId]
  );
  return rows;
};

// 3. Insert a message
export const insertMessage = async (conversationId, senderId, content) => {
  const [result] = await db.query(
    `INSERT INTO messages (conversationId, senderId, content, sentAt)
     VALUES (?, ?, ?, NOW())`,
    [conversationId, senderId, content]
  );
  const [messageRow] = await db.query(
    `SELECT * FROM messages WHERE id = ?`,
    [result.insertId]
  );
  return messageRow[0];
};

// 4. Update message status to READ
export const updateMessageStatusToRead = async (messageId, userId) => {
  await db.query(
    `INSERT INTO messageStatuses (messageId, userId, status)
     VALUES (?, ?, 'READ')
     ON DUPLICATE KEY UPDATE status = 'READ', updatedAt = NOW()`,
    [messageId, userId]
  );
};
