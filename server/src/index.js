import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import {
  users,
  mentors,
  sessions,
  businessPlans,
  matches,
  dashboardMetrics,
  generateToken,
  findUserByEmail,
  findMentorById,
  findSessionById,
  findPlanById,
  getDashboardSummary,
  getMatchRecommendations,
  getUpcomingSessions,
  createSession,
  createPlan,
} from './data/mockData.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json());

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'mentorhub-super-secret-key');
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'MentorHub API is running' });
});

app.post('/api/auth/register', async (req, res) => {
  const { name, email, password, role = 'entrepreneur' } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required' });
  }

  const existingUser = findUserByEmail(email);
  if (existingUser) {
    return res.status(409).json({ message: 'User already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = {
    id: `user_${Date.now()}`,
    name,
    email,
    password: hashedPassword,
    role,
    company: role === 'entrepreneur' ? 'New venture' : 'Mentor Studio',
    profileImage: 'https://images.unsplash.com/photo-...' 
  };

  users.push(newUser);

  const token = generateToken(newUser);
  res.status(201).json({
    token,
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      company: newUser.company,
    },
  });
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const user = findUserByEmail(email);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return res.status(401).json({ message: 'Incorrect password' });
  }

  const token = generateToken(user);
  res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      company: user.company,
    },
  });
});

app.get('/api/dashboard', authMiddleware, (req, res) => {
  const summary = getDashboardSummary();
  res.json(summary);
});

app.get('/api/mentors', authMiddleware, (req, res) => {
  res.json(mentors);
});

app.get('/api/matches', authMiddleware, (req, res) => {
  const recommendations = getMatchRecommendations();
  res.json(recommendations);
});

app.get('/api/sessions', authMiddleware, (req, res) => {
  const upcoming = getUpcomingSessions();
  res.json(upcoming);
});

app.post('/api/sessions', authMiddleware, (req, res) => {
  const { mentorId, title, date, duration, type = 'video' } = req.body;

  if (!mentorId || !title || !date) {
    return res.status(400).json({ message: 'mentorId, title, and date are required' });
  }

  const mentor = findMentorById(mentorId);
  if (!mentor) {
    return res.status(404).json({ message: 'Mentor not found' });
  }

  const nextSession = createSession({ mentorId, title, date, duration, type });
  res.status(201).json(nextSession);
});

app.get('/api/plans', authMiddleware, (req, res) => {
  res.json(businessPlans);
});

app.post('/api/plans', authMiddleware, (req, res) => {
  const { title, category, description } = req.body;

  if (!title || !category || !description) {
    return res.status(400).json({ message: 'Title, category, and description are required' });
  }

  const newPlan = createPlan({ title, category, description });
  res.status(201).json(newPlan);
});

app.get('/api/profile', authMiddleware, (req, res) => {
  const user = users.find((item) => item.id === req.user.id) || users[0];
  res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    company: user.company,
    focusAreas: ['Growth strategy', 'Product-market fit', 'Funding'],
  });
});

app.listen(PORT, () => {
  console.log(`MentorHub server is running on http://localhost:${PORT}`);
});

