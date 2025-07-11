# Standalone E-DNA Quiz App - Step by Step Guide

## 🎯 Project Overview
Create a standalone quiz-only application with landing page → quiz → results flow using React frontend and Supabase backend.

## 📋 Step-by-Step Instructions

### **STEP 1: Create New Replit Project**
1. Go to Replit.com
2. Click "Create Repl"
3. Choose "React" template
4. Name it: "entrepreneurial-dna-quiz"

### **STEP 2: Setup Supabase Database**
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Create new project
3. Copy the provided SQL migration file: `supabase_migration.sql`
4. In Supabase → SQL Editor → paste the entire migration file
5. Run the migration (this creates all tables and data)
6. Go to Settings → API → copy your project URL and anon key

### **STEP 3: Install Required Packages**
In Replit console, run:
```bash
npm install @supabase/supabase-js
npm install @radix-ui/react-slot
npm install class-variance-authority
npm install clsx
npm install tailwind-merge
npm install lucide-react
npm install wouter
```

### **STEP 4: Setup Environment Variables**
In Replit Secrets (🔒 icon):
- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anon key

### **STEP 5: Copy Brand Assets**
1. Download the Brandscaling logo from: `attached_assets/FullLogo.png`
2. Upload to your project's `public` folder
3. Copy the CSS theme file: `brandscaling_theme_colors.css`
4. Add to your main CSS file

### **STEP 6: File Structure Setup**
Create these folders in `src`:
```
src/
├── components/
│   ├── ui/
│   └── quiz/
├── lib/
├── pages/
└── hooks/
```

### **STEP 7: Key Files to Create**

#### **A. Supabase Client (`src/lib/supabase.ts`)**
```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

#### **B. Landing Page (`src/pages/Landing.tsx`)**
- Hero section with Brandscaling branding
- "Take Your DNA Quiz" button
- Brief description of the quiz
- Same color scheme as main app

#### **C. Quiz Component (`src/components/quiz/Quiz.tsx`)**
- Fetch questions from Supabase
- Display questions one by one
- Store answers in state
- Calculate scores based on authentic logic

#### **D. Results Page (`src/pages/Results.tsx`)**
- Display DNA type and subtype
- Show personality profile
- Option to retake quiz
- Share results functionality

### **STEP 8: Database Functions**
Create these functions in `src/lib/quizService.ts`:

```typescript
// Fetch all quiz questions
export async function getQuizQuestions()

// Submit quiz answers and get results
export async function submitQuizAnswers(answers: any)

// Calculate DNA type based on Q1-Q6
export function calculateDNAType(answers: any)

// Calculate subtype based on Q13-Q22
export function calculateSubtype(answers: any, dnaType: string)
```

### **STEP 9: Scoring Logic Implementation**
Use the exact same algorithms:
- **Q1-Q6**: 4+ architect answers = Architect, 4+ alchemist = Alchemist, <4 either = Blurred
- **Q13-Q22**: Count subtype answers within valid DNA category
- **Defaults**: master-strategist (architect), visionary-oracle (alchemist), overthinker (blurred)

### **STEP 10: UI Components**
Create these components:
- `Button` - Branded button with theme colors
- `Card` - Quiz question cards
- `Progress` - Quiz progress indicator
- `Badge` - DNA type/subtype badges

### **STEP 11: Styling**
1. Use the provided `brandscaling_theme_colors.css`
2. Apply same color scheme:
   - Architect: Blue/Purple theme
   - Alchemist: Orange/Pink theme
   - Brandscaling gradient for main elements
3. Use Inter font family
4. Responsive design for mobile

### **STEP 12: Routing Setup**
```typescript
// App.tsx routes
<Router>
  <Route path="/" component={Landing} />
  <Route path="/quiz" component={Quiz} />
  <Route path="/results" component={Results} />
</Router>
```

### **STEP 13: Testing Data**
All authentic data is already in the Supabase migration:
- ✅ 22 authentic questions
- ✅ All answer options with DNA type mapping
- ✅ 12 subtype profiles
- ✅ Calculation rules
- ✅ Scoring algorithms

### **STEP 14: Launch Checklist**
- [ ] Database migration successful
- [ ] Environment variables set
- [ ] Quiz loads questions from Supabase
- [ ] Scoring logic works correctly
- [ ] Results display properly
- [ ] Mobile responsive
- [ ] Brandscaling theme applied
- [ ] Logo displays correctly

## 🎨 **Brand Guidelines**
- **Primary Colors**: Architect Blue (#4F7CFF), Alchemist Orange (#FF7A00)
- **Logo**: Use provided FullLogo.png
- **Typography**: Inter font family
- **Style**: Clean, professional, modern
- **Gradients**: Use provided CSS gradient classes

## 📊 **Key Features**
1. **Landing Page**: Professional introduction to E-DNA Quiz
2. **22-Question Quiz**: Authentic questions with exact scoring
3. **Results Page**: Full DNA type and subtype profiles
4. **Responsive Design**: Works on all devices
5. **Fast Performance**: Direct Supabase connection
6. **Anonymous Usage**: No login required

## 🔧 **Technical Stack**
- **Frontend**: React + TypeScript + Vite
- **Backend**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS + Custom theme
- **Icons**: Lucide React
- **Routing**: Wouter
- **State**: React hooks

## 🚀 **Deployment**
1. Test locally in Replit
2. Deploy via Replit (automatic)
3. Your quiz will be live at: `your-repl-name.your-username.repl.co`

## 📝 **Important Notes**
- All quiz data is authentic from your main platform
- Scoring algorithms are identical
- No dummy or placeholder content
- Complete standalone functionality
- Same branding and visual identity

This creates a professional, standalone E-DNA Quiz that matches your main platform's quality and authenticity!