export const mockStudent = {
  name: "Alex Johnson",
  level: "B2",
  email: "alex@example.com",
  avatar: "AJ",
  totalScore: 8420,
  attendance: 92,
  completedLessons: 47,
  totalLessons: 60,
  streak: 12,
};

export const modules = [
  { id: "grammar", name: "Grammar", icon: "BookOpen", progress: 78, lessons: 24, color: "from-indigo-500 to-blue-500" },
  { id: "vocabulary", name: "Vocabulary", icon: "Library", progress: 65, lessons: 32, color: "from-blue-500 to-cyan-500" },
  { id: "speaking", name: "Speaking Lab", icon: "Mic", progress: 45, lessons: 18, color: "from-violet-500 to-purple-500" },
  { id: "pragmatic", name: "Pragmatic Tasks", icon: "MessageSquare", progress: 30, lessons: 15, color: "from-pink-500 to-rose-500" },
  { id: "reading", name: "Reading", icon: "BookMarked", progress: 82, lessons: 28, color: "from-emerald-500 to-teal-500" },
  { id: "listening", name: "Listening", icon: "Headphones", progress: 70, lessons: 22, color: "from-amber-500 to-orange-500" },
];

export const recommended = [
  { title: "Phrasal Verbs in Business Context", duration: "15 min", level: "B2", type: "Vocabulary" },
  { title: "Conditional Sentences Mastery", duration: "25 min", level: "B2", type: "Grammar" },
  { title: "Job Interview Roleplay", duration: "20 min", level: "B2", type: "Speaking" },
];

export const mockStudents = [
  { id: 1, name: "Sarah Chen", level: "B2", score: 89, lastActive: "2h ago", lessons: 47 },
  { id: 2, name: "Marco Rossi", level: "B1", score: 76, lastActive: "1d ago", lessons: 31 },
  { id: 3, name: "Yuki Tanaka", level: "C1", score: 94, lastActive: "30m ago", lessons: 62 },
  { id: 4, name: "Diego Hernandez", level: "A2", score: 68, lastActive: "3h ago", lessons: 18 },
  { id: 5, name: "Priya Patel", level: "B2", score: 85, lastActive: "5h ago", lessons: 44 },
  { id: 6, name: "Lucas MÃ¼ller", level: "C1", score: 91, lastActive: "1h ago", lessons: 58 },
  { id: 7, name: "AmÃ©lie Dubois", level: "B1", score: 79, lastActive: "2d ago", lessons: 28 },
];

export const mockHomework = [
  { id: 1, title: "Essay: My Future Career", due: "Tomorrow", assigned: 24, submitted: 18 },
  { id: 2, title: "Listening Quiz - Unit 5", due: "Friday", assigned: 24, submitted: 22 },
  { id: 3, title: "Speaking Recording: Daily Routine", due: "Next Mon", assigned: 24, submitted: 9 },
];

export const adminStats = {
  totalUsers: 12847,
  activeCourses: 38,
  revenue: 184230,
  signups: 312,
};

export const signupChartData = [
  { month: "Jan", signups: 180, revenue: 12400 },
  { month: "Feb", signups: 220, revenue: 15200 },
  { month: "Mar", signups: 280, revenue: 18900 },
  { month: "Apr", signups: 260, revenue: 17800 },
  { month: "May", signups: 312, revenue: 22100 },
  { month: "Jun", signups: 358, revenue: 24800 },
];

export const usageData = [
  { day: "Mon", students: 420, teachers: 38 },
  { day: "Tue", students: 510, teachers: 42 },
  { day: "Wed", students: 480, teachers: 40 },
  { day: "Thu", students: 590, teachers: 45 },
  { day: "Fri", students: 620, teachers: 48 },
  { day: "Sat", students: 380, teachers: 22 },
  { day: "Sun", students: 290, teachers: 18 },
];

export const adminUsers = [
  { id: 1, name: "Emma Wilson", role: "Teacher", email: "emma@lms.com", status: "Active", joined: "Mar 2024" },
  { id: 2, name: "James Park", role: "Student", email: "james@lms.com", status: "Active", joined: "Jan 2025" },
  { id: 3, name: "Olivia Brown", role: "Teacher", email: "olivia@lms.com", status: "Active", joined: "Sep 2023" },
  { id: 4, name: "Noah Davis", role: "Student", email: "noah@lms.com", status: "Inactive", joined: "Dec 2024" },
  { id: 5, name: "Ava Martinez", role: "Student", email: "ava@lms.com", status: "Active", joined: "Feb 2025" },
  { id: 6, name: "Liam Anderson", role: "Teacher", email: "liam@lms.com", status: "Active", joined: "Aug 2024" },
];

export const quizQuestions = [
  {
    q: "Choose the correct form: 'If I _____ rich, I would travel the world.'",
    options: ["am", "was", "were", "be"],
    correct: 2,
  },
  {
    q: "What does 'to break the ice' mean?",
    options: ["To shatter frozen water", "To start a conversation in a social situation", "To end a friendship", "To cool down a drink"],
    correct: 1,
  },
  {
    q: "Select the sentence with correct grammar:",
    options: ["She don't like coffee.", "She doesn't likes coffee.", "She doesn't like coffee.", "She not like coffee."],
    correct: 2,
  },
  {
    q: "Which preposition fits: 'I'm interested _____ learning languages.'",
    options: ["on", "in", "at", "for"],
    correct: 1,
  },
  {
    q: "The past participle of 'write' is:",
    options: ["wrote", "writed", "writen", "written"],
    correct: 3,
  },
];

export const grammarTopics = [
  { id: "present-simple", title: "Present Simple Tense", description: "Used for habits, routines, general truths, and permanent situations. Formed with the base verb (add -s/-es for he/she/it).", wordwallIds: ["2077865", "23372957"] },
  { id: "past-simple", title: "Past Simple Tense", description: "Used for completed actions at a specific time in the past. Regular verbs add -ed; irregular verbs have unique forms.", wordwallIds: ["13781736", "13635868"] },
  { id: "future-simple", title: "Future Simple Tense", description: "Used for future predictions, spontaneous decisions, and promises. Formed with will + base verb.", wordwallIds: ["5567831", "59641533"] },
  { id: "present-continuous", title: "Present Continuous Tense", description: "Used for actions happening right now or around the current time. Formed with am/is/are + verb-ing.", wordwallIds: ["35913723", "29887669"] },
  { id: "past-continuous", title: "Past Continuous Tense", description: "Used for ongoing actions in the past, often interrupted by another event. Formed with was/were + verb-ing.", wordwallIds: ["98166121", "99489046"] },
  { id: "future-continuous", title: "Future Continuous Tense", description: "Used for actions that will be in progress at a specific future time. Formed with will be + verb-ing.", wordwallIds: ["8621627", "1202887"] },
  { id: "present-perfect", title: "Present Perfect Tense", description: "Used for past actions with present relevance or life experiences. Formed with have/has + past participle.", wordwallIds: ["32479514", "2674479"] },
  { id: "past-perfect", title: "Past Perfect Tense", description: "Used for actions completed before another past event. Formed with had + past participle.", wordwallIds: ["25890534", "1959908"] },
  { id: "future-perfect", title: "Future Perfect Tense", description: "Used for actions that will be completed before a specific future time. Formed with will have + past participle.", wordwallIds: ["67106354", "27645031"] },
];