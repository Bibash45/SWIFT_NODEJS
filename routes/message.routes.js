import express from 'express';
import {
  getUserConversations,
  getConversationMessages,
  sendMessage,
  markMessageRead
} from '../controllers/message.controller.js';

const router = express.Router();

router.get('/conversations/:userId', getUserConversations);
router.get('/messages/:conversationId', getConversationMessages);
router.post('/messages', sendMessage);
router.patch('/messages/:messageId/read', markMessageRead);

export default router;
