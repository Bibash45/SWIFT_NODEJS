import express from 'express';
import {
  registerUser,
  getUsers,
  getUserByFieldController,
  updateUserByField,
  deleteUserByField
} from '../controllers/user.controller.js';

const router = express.Router();

router.post('/register', registerUser);
router.get('/all', getUsers);
router.get('/get', getUserByFieldController);
router.put('/update', updateUserByField);
router.delete('/delete', deleteUserByField);

export default router;
