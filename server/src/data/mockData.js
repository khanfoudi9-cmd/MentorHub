const users = [
  {
    id: 'user_1',
    name: 'Amina Rahman',
    email: 'founder@mentorhub.com',
    password: '$2a$10$E3oz7GfrRrP/hyH7u4MSze5Z7KQ1h0BhR1k5fo8NJh3M4PCYwbsZ2',
    role: 'entrepreneur',
    company: 'Northstar Labs',
  },
  {
    id: 'user_2',
    name: 'Daniel Brooks',
    email: 'mentor@mentorhub.com',
    password: '$2a$10$E3oz7GfrRrP/hyH7u4MSze5Z7KQ1h0BhR1k5fo8NJh3M4PCYwbsZ2',
    role: 'mentor',
    company: 'Growth Advisory',
  },
];

const mentors = [
  {
    id: 'mentor_1',
    name: 'Daniel Brooks',
    role: 'Growth Mentor',
    company: 'Growth Advisory',
    specialties: ['Sales', 'Marketing', 'Customer acquisition'],
    experience: '9 years',
    rating: 4.9,
    availability: 'This week',
    hourlyRate: '$120/hr',
    bio: 'Helps founders refine their growth engine and convert early traction into scalable revenue.',
  },
  {
    id: 'mentor_2',
    name: 'Leah Chen',
    role: 'Product Mentor',
    company: 'LaunchForge',
    specialties: ['Product strategy', 'UX', 'Market validation'],
    experience: '7 years',
    rating: 4.8,
    availability: 'Tomorrow',
    hourlyRate: '$95/hr',
    bio: 'Guides founders through product-market fit and roadmap prioritization.',
  },
  {
    id: 'mentor_3',
    name: 'Marcus Bell',
    role: 'Fundraising Mentor',
    company: 'Capital North',
    specialties: ['Pitch decks', 'Fundraising', 'Investor relations'],
    experience: '11 years',
    rating: 5.0,
    availability: 'Flexible',
    hourlyRate: '$150/hr',
    bio: 'Supports startups preparing for seed rounds and strategic investor conversations.',
  },
];

const dashboardMetrics = {
  revenue: '$86.4K',
  users: '12.5K',
  retention: '74%',
  businessHealth: 'Strong',
};

const matches = [
  {
    id: 'match_1',
    mentorId: 'mentor_1',
    reason: 'Strong fit for customer acquisition strategy',
    score: 96,
  },
  {
    id: 'match_2',
    mentorId: 'mentor_2',
    reason: 'Ideal for refining MVP and onboarding flow',
    score: 89,
  },
  {
    id: 'match_3',
    mentorId: 'mentor_3',
    reason: 'Useful for early-stage fundraising preparation',
    score: 82,
  },
];

const sessions = [
  {
    id: 'session_1',
    mentorId: 'mentor_1',
    title: 'Growth sprint review',
    date: '2026-10-04T14:00:00.000Z',
    duration: 60,
    type: 'video',
    status: 'confirmed',
  },
  {
    id: 'session_2',
    mentorId: 'mentor_2',
    title: 'Product roadmap session',
    date: '2026-10-08T10:30:00.000Z',
    duration: 45,
    type: 'chat',
    status: 'scheduled',
  },
];

const businessPlans = [
  {
    id: 'plan_1',
    title: 'Lean Startup Overview',
    category: 'Validation',
    description: 'A step-by-step template for validating demand, testing pricing, and refining the first product iteration.',
  },
  {
    id: 'plan_2',
    title: 'Go-to-Market Blueprint',
    category: 'Marketing',
    description: 'Use this plan to align messaging, acquisition channels, and conversion milestones for your launch.',
  },
  {
    id: 'plan_3',
    title: 'Fundraising Story Deck',
    category: 'Finance',
    description: 'A structured storytelling and financial pitch plan for founders preparing to raise capital.',
  },
];

export const generateToken = (user) => {
  return jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET || 'mentorhub-super-secret-key');
};

export const findUserByEmail = (email) => users.find((user) => user.email.toLowerCase() === email.toLowerCase());
export const findMentorById = (id) => mentors.find((mentor) => mentor.id === id);
export const findSessionById = (id) => sessions.find((session) => session.id === id);
export const findPlanById = (id) => businessPlans.find((plan) => plan.id === id);

export const getDashboardSummary = () => ({
  metrics: dashboardMetrics,
  quickWins: [
    'Connect with a growth-focused mentor',
    'Finalize target customer interviews',
    'Update your fundraising story deck',
  ],
});

export const getMatchRecommendations = () =>
  matches.map((match) => ({
    ...match,
    mentor: findMentorById(match.mentorId),
  }));

export const getUpcomingSessions = () =>
  sessions.map((session) => ({
    ...session,
    mentor: findMentorById(session.mentorId),
  }));

export const createSession = ({ mentorId, title, date, duration, type }) => {
  const newSession = {
    id: `session_${Date.now()}`,
    mentorId,
    title,
    date,
    duration,
    type,
    status: 'pending',
  };

  sessions.push(newSession);
  return {
    ...newSession,
    mentor: findMentorById(mentorId),
  };
};

export const createPlan = ({ title, category, description }) => {
  const newPlan = {
    id: `plan_${Date.now()}`,
    title,
    category,
    description,
  };

  businessPlans.push(newPlan);
  return newPlan;
};

export { users, mentors, sessions, businessPlans, matches, dashboardMetrics };

