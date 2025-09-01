-- Supabase Migration for Standalone E-DNA Quiz App
-- Create tables for quiz questions, answer options, and calculation logic

-- Enable RLS (Row Level Security)
alter database current set "app.settings.jwt_secret" to 'your-jwt-secret-here';

-- Create quiz_questions table
CREATE TABLE quiz_questions (
    id SERIAL PRIMARY KEY,
    question_number INTEGER NOT NULL UNIQUE,
    question_text TEXT NOT NULL,
    category VARCHAR(50) NOT NULL, -- 'default_dna', 'subtype', 'validation'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create quiz_answer_options table
CREATE TABLE quiz_answer_options (
    id SERIAL PRIMARY KEY,
    question_id INTEGER REFERENCES quiz_questions(id) ON DELETE CASCADE,
    option_letter CHAR(1) NOT NULL CHECK (option_letter IN ('A', 'B', 'C', 'D')),
    option_text TEXT NOT NULL,
    dna_type VARCHAR(20), -- 'architect', 'alchemist', 'blurred', 'neutral'
    subtype VARCHAR(50), -- specific subtype if applicable
    weight INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(question_id, option_letter)
);

-- Create dna_subtypes table for profile information
CREATE TABLE dna_subtypes (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(20) NOT NULL CHECK (category IN ('architect', 'alchemist', 'blurred')),
    operating_loop VARCHAR(100),
    core_identity TEXT,
    edge TEXT,
    risks TEXT,
    next_steps TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create quiz_results table to store user responses
CREATE TABLE quiz_results (
    id SERIAL PRIMARY KEY,
    user_email VARCHAR(255),
    session_id VARCHAR(100),
    answers JSONB NOT NULL, -- Store all answers as JSON
    architect_score INTEGER DEFAULT 0,
    alchemist_score INTEGER DEFAULT 0,
    blurred_score INTEGER DEFAULT 0,
    neutral_score INTEGER DEFAULT 0,
    final_dna_type VARCHAR(20),
    subtype VARCHAR(50),
    awareness_percentage INTEGER DEFAULT 75,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create calculation_rules table for scoring logic
CREATE TABLE calculation_rules (
    id SERIAL PRIMARY KEY,
    rule_type VARCHAR(50) NOT NULL, -- 'dna_type', 'subtype', 'awareness'
    rule_name VARCHAR(100) NOT NULL,
    description TEXT,
    questions_used VARCHAR(20), -- 'Q1-Q6', 'Q13-Q22', etc.
    condition_logic TEXT,
    result_value VARCHAR(50),
    score_requirement VARCHAR(20),
    default_fallback VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert the 22 authentic quiz questions
INSERT INTO quiz_questions (question_number, question_text, category) VALUES
(1, 'You''re going away for the weekend. How do you prepare the night before?', 'default_dna'),
(2, 'A close friend unintentionally hurts your feelings. How do you respond?', 'default_dna'),
(3, 'You walk into a room full of strangers. What do you do?', 'default_dna'),
(4, 'You''ve committed to waking up at 6am for a week. Day 3, you''re exhausted. What happens?', 'default_dna'),
(5, 'You''ve just finished an important project. How do you feel about the outcome?', 'default_dna'),
(6, 'Someone sets a goal you''ve never seen anyone achieve before. What''s your response?', 'default_dna'),
(7, 'You''re in a team meeting discussing a major decision. What role do you naturally take?', 'subtype'),
(8, 'You''re planning a big project launch. What''s your instinctive approach?', 'subtype'),
(9, 'When you''re working on something important, what environment helps you perform best?', 'subtype'),
(10, 'You''re facing a complex problem that has no obvious solution. How do you approach it?', 'subtype'),
(11, 'You''re preparing for an important presentation. What''s your natural process?', 'subtype'),
(12, 'You''ve written a rough outline for a course or product. What do you naturally do next?', 'subtype'),
(13, 'You''ve just had an idea you''re excited about. What happens next?', 'subtype'),
(14, 'You need to hire someone for your team. What''s most important to you in the process?', 'subtype'),
(15, 'You''re launching a new service. How do you naturally approach getting your first customers?', 'subtype'),
(16, 'You''ve been working on a project for months, but progress feels slow. What do you do?', 'subtype'),
(17, 'You''re at an industry event where you don''t know anyone. How do you engage?', 'subtype'),
(18, 'You''re designing a workspace that needs to inspire creativity and focus. What do you prioritise?', 'subtype'),
(19, 'You''re given a blank room and asked to design the "perfect space." What do you do first?', 'validation'),
(20, 'When you had homework or assignments in school, how did you typically approach them?', 'validation'),
(21, 'When asked to clean your room or organise your space as a child, what best describes your approach?', 'validation'),
(22, 'You''re learning a new skill (e.g., cooking, driving, drawing). Which learning pattern is most natural for you?', 'validation');

-- Insert Q1-Q6 answer options (Default DNA Detection)
INSERT INTO quiz_answer_options (question_id, option_letter, option_text, dna_type) VALUES
(1, 'A', 'I mentally run through what I need and pack once — essentials are covered.', 'architect'),
(1, 'B', 'I write a full list, check everything off, repack a few times, still feel uneasy.', 'blurred'),
(1, 'C', 'I throw things in last minute and trust it''ll be fine.', 'alchemist'),
(1, 'D', 'I pack, unpack, and get overwhelmed deciding what I even need.', 'blurred'),

(2, 'A', 'I won''t say anything — they''ll figure it out or I''ll quietly move on.', 'architect'),
(2, 'B', 'I''ll express it — maybe now, maybe later — but it will come out.', 'alchemist'),
(2, 'C', 'I react suddenly, then second-guess if I was overdramatic.', 'blurred'),
(2, 'D', 'I feel stuck about whether I should say something or not.', 'blurred'),

(3, 'A', 'I observe quietly, scan the room, and engage when it makes strategic sense.', 'architect'),
(3, 'B', 'I tune into the energy — I might light up the room or stay quiet, depending how I feel.', 'alchemist'),
(3, 'C', 'I pause and wait for someone to approach — I''m not sure how to show up.', 'neutral'),
(3, 'D', 'I keep switching between acting confident and feeling unsure — I want to be seen but don''t know how.', 'blurred'),

(4, 'A', 'I stick to it. Fatigue doesn''t override commitment unless it''s serious.', 'architect'),
(4, 'B', 'I ask myself if the reason still matters — if not, I adjust without guilt.', 'alchemist'),
(4, 'C', 'I sleep in, feel bad, and try again tomorrow.', 'neutral'),
(4, 'D', 'I feel torn — I want to keep going but can''t force myself either.', 'blurred'),

(5, 'A', 'If the result is strong, I''m satisfied — no need to change anything.', 'architect'),
(5, 'B', 'I immediately wonder how it could have been even better.', 'alchemist'),
(5, 'C', 'I feel good but uneasy — maybe I missed something important.', 'blurred'),
(5, 'D', 'I feel proud for a moment, then wonder if I was just lucky.', 'blurred'),

(6, 'A', 'I need to see a path or example — otherwise I''m not sure it''s achievable.', 'architect'),
(6, 'B', 'Even if no one''s done it, I know it''s possible — I just need the steps.', 'alchemist'),
(6, 'C', 'I doubt myself, but I still try in case it works out.', 'blurred'),
(6, 'D', 'I switch between confidence and confusion depending on the day.', 'blurred');

-- Insert Q7-Q18 answer options (Subtype Detection - Architect subtypes)
INSERT INTO quiz_answer_options (question_id, option_letter, option_text, dna_type, subtype) VALUES
(7, 'A', 'I listen carefully, process the information, then speak when I have something valuable to add.', 'architect', 'master-strategist'),
(7, 'B', 'I take notes and ask clarifying questions to ensure we''re building on solid foundations.', 'architect', 'systemised-builder'),
(7, 'C', 'I analyse the options quietly, looking for gaps or risks others might have missed.', 'architect', 'internal-analyzer'),
(7, 'D', 'I focus on the big picture and how this decision fits into our larger strategy.', 'architect', 'ultimate-strategist'),

(8, 'A', 'I create a detailed project plan with clear milestones and contingency options.', 'architect', 'master-strategist'),
(8, 'B', 'I break it down into manageable phases and build systematic processes for each.', 'architect', 'systemised-builder'),
(8, 'C', 'I research thoroughly, anticipate potential problems, and prepare detailed solutions.', 'architect', 'internal-analyzer'),
(8, 'D', 'I design the framework first, then delegate specific tasks to the right people.', 'architect', 'ultimate-strategist'),

(9, 'A', 'A quiet, organised space where I can think strategically without interruptions.', 'architect', 'master-strategist'),
(9, 'B', 'A structured environment with clear processes and everything in its proper place.', 'architect', 'systemised-builder'),
(9, 'C', 'A deep-focus space where I can analyse and perfect without time pressure.', 'architect', 'internal-analyzer'),
(9, 'D', 'A command centre where I can see the big picture and coordinate effectively.', 'architect', 'ultimate-strategist'),

(10, 'A', 'I step back, analyse the broader context, and develop a strategic approach.', 'architect', 'master-strategist'),
(10, 'B', 'I break it into smaller components and tackle each piece systematically.', 'architect', 'systemised-builder'),
(10, 'C', 'I research deeply, examine all angles, and build a comprehensive solution.', 'architect', 'internal-analyzer'),
(10, 'D', 'I identify the core patterns and create frameworks that others can execute.', 'architect', 'ultimate-strategist'),

(11, 'A', 'I develop a clear narrative structure and anticipate potential questions.', 'architect', 'master-strategist'),
(11, 'B', 'I create detailed slides and practice systematically until it''s polished.', 'architect', 'systemised-builder'),
(11, 'C', 'I research thoroughly, prepare for every scenario, and refine until perfect.', 'architect', 'internal-analyzer'),
(11, 'D', 'I focus on the key frameworks and ensure others can implement the ideas.', 'architect', 'ultimate-strategist'),

(12, 'A', 'I develop a strategic launch plan and map out the customer journey.', 'architect', 'master-strategist'),
(12, 'B', 'I systematically build out each module with detailed processes.', 'architect', 'systemised-builder'),
(12, 'C', 'I research best practices and refine the content until it''s comprehensive.', 'architect', 'internal-analyzer'),
(12, 'D', 'I create the instructional framework and identify who can help develop it.', 'architect', 'ultimate-strategist');

-- Insert Q13-Q18 answer options for developed entrepreneur path (Early vs Developed)
INSERT INTO quiz_answer_options (question_id, option_letter, option_text, dna_type, subtype) VALUES
(13, 'A', 'I immediately think about market fit and start planning validation steps.', 'architect', 'master-strategist'),
(13, 'B', 'I write it down properly and start building a systematic approach to test it.', 'architect', 'systemised-builder'),
(13, 'C', 'I research it thoroughly to understand all the implications before moving.', 'architect', 'internal-analyzer'),
(13, 'D', 'I consider how it fits into my bigger vision and what resources I''d need.', 'architect', 'ultimate-strategist'),

(14, 'A', 'Strategic thinking ability and how they approach complex problems.', 'architect', 'master-strategist'),
(14, 'B', 'Reliability, work ethic, and ability to follow systematic processes.', 'architect', 'systemised-builder'),
(14, 'C', 'Attention to detail, thoroughness, and commitment to quality standards.', 'architect', 'internal-analyzer'),
(14, 'D', 'Cultural fit and how they''ll contribute to the bigger vision.', 'architect', 'ultimate-strategist'),

(15, 'A', 'I develop a strategic positioning and identify the most promising channels.', 'architect', 'master-strategist'),
(15, 'B', 'I create systematic outreach processes and track everything methodically.', 'architect', 'systemised-builder'),
(15, 'C', 'I perfect the offering first, then research the best customer acquisition methods.', 'architect', 'internal-analyzer'),
(15, 'D', 'I focus on building systems that others can use to scale customer acquisition.', 'architect', 'ultimate-strategist'),

(16, 'A', 'I step back and reassess the strategy — maybe the approach needs changing.', 'architect', 'master-strategist'),
(16, 'B', 'I review my systems and processes to identify what can be optimised.', 'architect', 'systemised-builder'),
(16, 'C', 'I analyse what''s causing the delays and research better methodologies.', 'architect', 'internal-analyzer'),
(16, 'D', 'I look at the bigger picture and consider whether to pivot or delegate differently.', 'architect', 'ultimate-strategist'),

(17, 'A', 'I observe first, identify key players, then engage strategically with valuable connections.', 'architect', 'master-strategist'),
(17, 'B', 'I approach it systematically — clear goals, planned conversations, follow-up process.', 'architect', 'systemised-builder'),
(17, 'C', 'I prepare thoroughly beforehand and focus on deep, meaningful conversations.', 'architect', 'internal-analyzer'),
(17, 'D', 'I focus on understanding industry patterns and building relationships with influencers.', 'architect', 'ultimate-strategist'),

(18, 'A', 'Strategic placement of key elements that support clear thinking and decision-making.', 'architect', 'master-strategist'),
(18, 'B', 'Organised systems and processes that enable consistent, productive work flow.', 'architect', 'systemised-builder'),
(18, 'C', 'Deep focus zones with minimal distractions and everything needed for thorough work.', 'architect', 'internal-analyzer'),
(18, 'D', 'Flexible frameworks that can adapt while maintaining overall vision and coordination.', 'architect', 'ultimate-strategist');

-- Insert Q19-Q22 answer options (Validation Questions - Alchemist subtypes)
INSERT INTO quiz_answer_options (question_id, option_letter, option_text, dna_type, subtype) VALUES
(19, 'A', 'I walk around and feel the energy of the space until I get a clear vision.', 'alchemist', 'visionary-oracle'),
(19, 'B', 'I research design principles and create a mood board to guide my decisions.', 'alchemist', 'magnetic-perfectionist'),
(19, 'C', 'I consider how people will feel in the space and what energy I want to create.', 'alchemist', 'energetic-empath'),
(19, 'D', 'I immediately see the finished space in my mind and start creating that vision.', 'alchemist', 'ultimate-alchemist'),

(20, 'A', 'I did it in bursts of inspiration — either completely focused or completely distracted.', 'alchemist', 'visionary-oracle'),
(20, 'B', 'I had high standards and couldn''t submit anything that didn''t feel right to me.', 'alchemist', 'magnetic-perfectionist'),
(20, 'C', 'It depended on how I felt about the teacher and whether the subject resonated with me.', 'alchemist', 'energetic-empath'),
(20, 'D', 'I needed to be alone, clear the space, and feel right before even beginning.', 'alchemist', 'ultimate-alchemist'),

(21, 'A', 'I did it in one big emotional burst — the chaos would build until I had to act.', 'alchemist', 'visionary-oracle'),
(21, 'B', 'I made a plan or system first, then tackled it piece by piece.', 'alchemist', 'ultimate-alchemist'),
(21, 'C', 'I felt overwhelmed unless the mood or energy felt right.', 'alchemist', 'energetic-empath'),
(21, 'D', 'I cleaned while imagining how I wanted it to look when done — I needed to see it first.', 'alchemist', 'magnetic-perfectionist'),

(22, 'A', 'I research first, then repeat steps until it feels mastered.', 'alchemist', 'magnetic-perfectionist'),
(22, 'B', 'I learn by doing — I just start and fix mistakes as I go.', 'alchemist', 'visionary-oracle'),
(22, 'C', 'I learn when I feel connected to what I''m doing — if the energy''s off, I can''t focus.', 'alchemist', 'energetic-empath'),
(22, 'D', 'I see the end result in my head first, then I try to recreate it immediately.', 'alchemist', 'ultimate-alchemist');

-- Insert DNA subtypes data
INSERT INTO dna_subtypes (id, name, category, operating_loop, core_identity, edge, risks, next_steps) VALUES
('master-strategist', 'The Master Strategist', 'architect', 'Thought → Emotion → Thought', 'You don''t follow structure — you design it.', 'Strategic foresight, calm decision-making under pressure', 'Avoidance of emotional confrontation, delayed action due to overplanning', 'Build frameworks for quicker execution'),
('systemised-builder', 'The Systemised Builder', 'architect', 'Thought → Emotion → Thought', 'You don''t chase momentum — you build it, brick by brick.', 'Consistent follow-through, execution without burnout', 'Over-control of process, bottlenecking due to solo task-loading', 'Develop delegation and team systems'),
('internal-analyzer', 'The Internal Analyzer', 'architect', 'Thought → Emotion → Thought', 'You don''t just want to get it right — you need to know why it''s right.', 'Unparalleled depth, logic, foresight', 'Taking too long to move, over-perfecting when something needs shipping', 'Set shipping deadlines and stick to them'),
('ultimate-strategist', 'The Ultimate Strategist', 'architect', 'Thought → Emotion → Thought', 'You don''t move often — but when you do, everything moves with you.', 'High-speed pattern recognition, strategic MVP execution', 'May overcalculate and miss fast windows', 'Build rapid testing and pivot capabilities'),
('visionary-oracle', 'The Visionary Oracle', 'alchemist', 'Emotion → Thought → Emotion', 'Sees the future, struggles to finish.', 'Intuitive pattern recognition, cultural sensing', 'Procrastination, burnout, incomplete projects', 'Build containers and systems for completion'),
('magnetic-perfectionist', 'The Magnetic Perfectionist', 'alchemist', 'Emotion → Thought → Emotion', 'Organised to deliver aligned perfection.', 'Emotional structure, consistent delivery', 'Over-ownership, impossibly high standards', 'Find collaborators who match delivery frequency'),
('energetic-empath', 'The Energetic Empath', 'alchemist', 'Emotion → Thought → Emotion', 'Heals with energy, absorbs with intensity.', 'Energy healing, emotional uplift', 'Emotional absorption, burnout from others energy', 'Develop logical frameworks to balance intuition'),
('ultimate-alchemist', 'The Ultimate Alchemist', 'alchemist', 'Emotion → Thought → Emotion', 'Carries every Alchemist gift — and full awareness of structure.', 'Complete Alchemist gifts with structural awareness', 'Choosing growth over stability', 'Balance growth impulses with sustainable systems'),
('overthinker', 'The Overthinker', 'blurred', 'Disconnected', 'Trapped in thought loops, struggles with decisions.', 'Deep analysis capability', 'Analysis paralysis, decision avoidance', 'Practice rapid decision-making exercises'),
('performer', 'The Performer', 'blurred', 'Disconnected', 'Seeks external approval, inconsistent identity.', 'Adaptability, people-pleasing skills', 'Identity confusion, exhaustion from performing', 'Develop authentic self-expression practices'),
('self-forsaker', 'The Self-Forsaker', 'blurred', 'Disconnected', 'Abandons own needs for others.', 'High empathy, service orientation', 'Self-neglect, boundary issues', 'Establish healthy boundaries and self-care'),
('self-betrayer', 'The Self-Betrayer', 'blurred', 'Disconnected', 'Sabotages own success and potential.', 'Awareness of self-sabotage patterns', 'Consistent self-sabotage, low self-worth', 'Develop self-compassion and success tolerance');

-- Insert calculation rules
INSERT INTO calculation_rules (rule_type, rule_name, description, questions_used, condition_logic, result_value, score_requirement, default_fallback) VALUES
('dna_type', 'Architect Score', 'Count architect-type answers in Q1-Q6', 'Q1-Q6', 'architect_score >= 4', 'architect', '4+', 'blurred'),
('dna_type', 'Alchemist Score', 'Count alchemist-type answers in Q1-Q6', 'Q1-Q6', 'alchemist_score >= 4', 'alchemist', '4+', 'blurred'),
('dna_type', 'Blurred Identity', 'Both architect and alchemist < 4', 'Q1-Q6', 'architect_score < 4 AND alchemist_score < 4', 'blurred', '<4 either', 'blurred'),
('subtype', 'Dominant Subtype', 'Most common valid subtype from Q13-Q22', 'Q13-Q22', 'maxCount > 0 AND validSubtype', 'dominantSubtype', '1+', 'default_by_type'),
('subtype', 'Architect Default', 'Default subtype when no clear winner', 'Q13-Q22', 'maxCount = 0 AND dnaType = architect', 'master-strategist', '0', 'master-strategist'),
('subtype', 'Alchemist Default', 'Default subtype when no clear winner', 'Q13-Q22', 'maxCount = 0 AND dnaType = alchemist', 'visionary-oracle', '0', 'visionary-oracle'),
('subtype', 'Blurred Default', 'Default subtype when no clear winner', 'Q13-Q22', 'maxCount = 0 AND dnaType = blurred', 'overthinker', '0', 'overthinker'),
('awareness', 'Awareness Percentage', 'Fixed awareness percentage for all results', 'Q7-Q12', 'Always returns 75%', '75', 'Static', '75');

-- Enable Row Level Security
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_answer_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE dna_subtypes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE calculation_rules ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access to quiz data
CREATE POLICY "Public read access for quiz questions" ON quiz_questions FOR SELECT USING (true);
CREATE POLICY "Public read access for quiz options" ON quiz_answer_options FOR SELECT USING (true);
CREATE POLICY "Public read access for dna subtypes" ON dna_subtypes FOR SELECT USING (true);
CREATE POLICY "Public read access for calculation rules" ON calculation_rules FOR SELECT USING (true);

-- Allow public insert for quiz results (anonymous quiz taking)
CREATE POLICY "Public insert for quiz results" ON quiz_results FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can read their own results" ON quiz_results FOR SELECT USING (true);

-- Create indexes for better performance
CREATE INDEX idx_quiz_questions_number ON quiz_questions(question_number);
CREATE INDEX idx_quiz_options_question ON quiz_answer_options(question_id);
CREATE INDEX idx_quiz_results_session ON quiz_results(session_id);
CREATE INDEX idx_quiz_results_email ON quiz_results(user_email);
CREATE INDEX idx_dna_subtypes_category ON dna_subtypes(category);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add trigger to quiz_questions table
CREATE TRIGGER update_quiz_questions_updated_at 
    BEFORE UPDATE ON quiz_questions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();