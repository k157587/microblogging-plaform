const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// In-memory data storage (simulating database)
let users = [
  {
    id: '1',
    username: 'john_doe',
    email: 'john@example.com',
    name: 'John Doe',
    avatar: 'https://via.placeholder.com/40',
    followers: [],
    following: []
  },
  {
    id: '2',
    username: 'jane_smith',
    email: 'jane@example.com',
    name: 'Jane Smith',
    avatar: 'https://via.placeholder.com/40',
    followers: [],
    following: []
  }
];

let tweets = [
  {
    id: '1',
    userId: '1',
    username: 'john_doe',
    name: 'John Doe',
    avatar: 'https://via.placeholder.com/40',
    content: 'Just launched my new project! 🚀',
    timestamp: new Date().toISOString(),
    likes: 5,
    retweets: 2,
    comments: []
  },
  {
    id: '2',
    userId: '2',
    username: 'jane_smith',
    name: 'Jane Smith',
    avatar: 'https://via.placeholder.com/40',
    content: 'Beautiful sunset today! 🌅',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    likes: 12,
    retweets: 3,
    comments: []
  }
];

let comments = [];

// Authentication endpoints
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  // Simulate authentication
  const user = users.find(u => u.email === email);
  if (user && password) { // Simple password check for demo
    res.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        name: user.name,
        avatar: user.avatar
      }
    });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

app.post('/api/auth/register', (req, res) => {
  const { username, email, name, password } = req.body;
  
  // Check if user already exists
  if (users.find(u => u.email === email || u.username === username)) {
    return res.status(400).json({ success: false, message: 'User already exists' });
  }
  
  const newUser = {
    id: uuidv4(),
    username,
    email,
    name,
    avatar: 'https://via.placeholder.com/40',
    followers: [],
    following: []
  };
  
  users.push(newUser);
  
  res.json({
    success: true,
    user: {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      name: newUser.name,
      avatar: newUser.avatar
    }
  });
});

// Tweet endpoints
app.get('/api/tweets', (req, res) => {
  // Sort tweets by timestamp (newest first)
  const sortedTweets = tweets.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  res.json(sortedTweets);
});

app.post('/api/tweets', (req, res) => {
  const { userId, content } = req.body;
  const user = users.find(u => u.id === userId);
  
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }
  
  const newTweet = {
    id: uuidv4(),
    userId,
    username: user.username,
    name: user.name,
    avatar: user.avatar,
    content,
    timestamp: new Date().toISOString(),
    likes: 0,
    retweets: 0,
    comments: []
  };
  
  tweets.unshift(newTweet); // Add to beginning
  res.json({ success: true, tweet: newTweet });
});

app.post('/api/tweets/:id/like', (req, res) => {
  const tweetId = req.params.id;
  const tweet = tweets.find(t => t.id === tweetId);
  
  if (tweet) {
    tweet.likes += 1;
    res.json({ success: true, likes: tweet.likes });
  } else {
    res.status(404).json({ success: false, message: 'Tweet not found' });
  }
});

app.post('/api/tweets/:id/retweet', (req, res) => {
  const tweetId = req.params.id;
  const tweet = tweets.find(t => t.id === tweetId);
  
  if (tweet) {
    tweet.retweets += 1;
    res.json({ success: true, retweets: tweet.retweets });
  } else {
    res.status(404).json({ success: false, message: 'Tweet not found' });
  }
});

// Comment endpoints
app.get('/api/tweets/:id/comments', (req, res) => {
  const tweetId = req.params.id;
  const tweetComments = comments.filter(c => c.tweetId === tweetId);
  res.json(tweetComments);
});

app.post('/api/tweets/:id/comments', (req, res) => {
  const tweetId = req.params.id;
  const { userId, content } = req.body;
  const user = users.find(u => u.id === userId);
  
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }
  
  const newComment = {
    id: uuidv4(),
    tweetId,
    userId,
    username: user.username,
    name: user.name,
    avatar: user.avatar,
    content,
    timestamp: new Date().toISOString()
  };
  
  comments.push(newComment);
  
  // Update tweet comment count
  const tweet = tweets.find(t => t.id === tweetId);
  if (tweet) {
    tweet.comments.push(newComment.id);
  }
  
  res.json({ success: true, comment: newComment });
});

// User endpoints
app.get('/api/users/:id', (req, res) => {
  const userId = req.params.id;
  const user = users.find(u => u.id === userId);
  
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ success: false, message: 'User not found' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
