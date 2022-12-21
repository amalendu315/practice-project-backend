import express from 'express';
import { getFeedPosts, getUserPosts, likePost } from '../controllers/posts.js';
import { verifyToken } from '../middlewares/auth.js';

const router = express.Router();

//Read
router.get('/', verifyToken, getFeedPosts);  // Sending all the posts in the db for feed
router.get('/:userId/posts', verifyToken, getUserPosts);  // Sending all the posts of a user

//Update
router.put('/:id/like', verifyToken, likePost);

export default router;