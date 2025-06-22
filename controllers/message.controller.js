import {
  getConversationsByUserId,
  getMessagesByConversationId,
  insertMessage,
  updateMessageStatusToRead,
} from "../query/message.query.js";
import { isValidId } from "../utils/integerIsValid.js";

// GET /conversations/:userId
export const getUserConversations = async (req, res) => {

  const userId = Number(req.params.userId);
  if (!isValidId(userId)) {
    return res.status(400).json({ success: false, message: "Invalid userId" });
  }

  try {
    const conversations = await getConversationsByUserId(userId);
    res.json({ success: true, data: conversations });
  } catch (err) {
    console.error("Error getting conversations:", err);
    res
      .status(500)
      .json({ success: false, message: "Failed to get conversations" });
  }
};

// GET /messages/:conversationId
export const getConversationMessages = async (req, res) => {
  const conversationId = Number(req.params.conversationId);
  if (!isValidId(conversationId)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid conversationId" });
  }

  try {
    const messages = await getMessagesByConversationId(conversationId);
    res.json({ success: true, data: messages });
  } catch (err) {
    console.error("Error getting messages:", err);
    res.status(500).json({ success: false, message: "Failed to get messages" });
  }
};

// POST /messages
export const sendMessage = async (req, res) => {
  const { conversationId, senderId, content } = req.body;
  if (
    !isValidId(conversationId) ||
    !isValidId(senderId) ||
    typeof content !== "string"
  ) {
    return res.status(400).json({ success: false, message: "Invalid input" });
  }

  try {
    const result = await insertMessage(conversationId, senderId, content);
    res.status(201).json({
      success: true,
      message: "Message sent",
      data: result,
    });
  } catch (err) {
    console.error("Error sending message:", err);
    res.status(500).json({ success: false, message: "Failed to send message" });
  }
};

// PATCH /messages/:messageId/read
export const markMessageRead = async (req, res) => {
  const messageId = Number(req.params.messageId);
  const { userId } = req.body;

  if (!isValidId(messageId) || !isValidId(userId)) {
    return res.status(400).json({ success: false, message: "Invalid IDs" });
  }

  try {
    await updateMessageStatusToRead(messageId, userId);
    res.json({ success: true, message: "Message marked as read" });
  } catch (err) {
    console.error("Error updating read status:", err);
    res.status(500).json({ success: false, message: "Failed to mark as read" });
  }
};
