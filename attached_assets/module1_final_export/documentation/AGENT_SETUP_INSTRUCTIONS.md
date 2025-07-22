# 🎯 AGENT SETUP INSTRUCTIONS - Module 1 Export

## FOR REPLIT AGENT: Complete Setup Guide

This package contains a fresh, clean export of THE IDEA-TO-LAUNCH KIT™ Module 1 with no server conflicts or issues.

### 🚀 **Quick Setup Process**

**Step 1: Project Setup**
```bash
# Copy all files maintaining directory structure
# Install all dependencies
npm install
```

**Step 2: Environment Setup**
```bash
# Add to Replit Secrets:
OPENAI_API_KEY=user_provided_key
DATABASE_URL=postgresql_connection_string
```

**Step 3: Database Setup**
```bash
# Push schema to database
npm run db:push
```

**Step 4: Start Application**
```bash
# Start development server
npm run dev
```

### 🎨 **Critical Design Requirements**

**Brand Colors (Must Match Exactly):**
- Primary Purple: `#6B46C1`
- Secondary Orange: `#EA580C`
- Gradient: `linear-gradient(135deg, #6B46C1 0%, #EA580C 100%)`

**Layout Requirements:**
- Fixed purple sidebar on desktop
- Collapsible mobile navigation
- Card-based content layout
- Purple section numbers in circles
- Real-time progress indicators

### 🤖 **AI Integration Requirements**

**Working AI Sections:**
- Section 1.1: Business Filter
- Section 1.3: Clarity Prompts
- Section 1.4: Offer Builder
- Section 1.6: Name & Logo Builder

**AI Features Required:**
- Permanent "Your AI Response Space" boxes
- "Get AI Response" buttons that work
- Custom editable prompts
- Responses save to database automatically

### 📊 **Database Schema**

The `shared/schema.ts` file contains complete PostgreSQL schema with JSON fields for:
- `business_filter` - Business viability responses + AI
- `edna_reflection` - DNA mode reflections
- `clarity_prompts` - Business concept fields + AI
- `offer_builder` - Offer framework + AI
- `viability_scores` - 8-factor scoring
- `branding_results` - Branding inputs + AI

### 📱 **Responsive Requirements**

**Desktop:**
- Fixed sidebar with progress tracking
- Main content in cards
- DNA toggle in top right

**Mobile:**
- Collapsible navigation
- Stacked card layout
- Touch-friendly interactions

### ✅ **Success Verification**

The setup is successful when:

**Visual:**
- Purple/orange gradient throughout
- Professional card-based layout
- Progress sidebar shows all 7 sections
- Clean, minimal design

**Functional:**
- DNA toggle changes content
- Progress updates as sections complete
- AI responses generate successfully
- Data auto-saves continuously
- Mobile responsive behavior works

**Technical:**
- No console errors
- Database saves all inputs
- API endpoints respond properly
- Session management works

### 🔧 **File Structure Verification**

Ensure these key files are in place:
```
client/src/
├── components/ui/ (49 UI components)
├── components/workbook/ (11 Module 1 components)
├── hooks/ (3 custom hooks)
├── lib/ (3 utility files)
├── types/ (1 TypeScript definitions)
├── pages/ (1 main workbook page)
├── App.tsx
└── main.tsx

shared/schema.ts (database schema)
server/ (5 backend files)
styles/index.css (complete styling)
config/ (8 configuration files)
```

### 🎯 **Expected Result**

When complete, you'll have an identical Module 1 workbook that:
- Looks exactly like the original (purple/orange design)
- Functions exactly like the original (AI, progress, auto-save)
- Performs exactly like the original (responsive, fast, reliable)

The user should experience no difference from the original implementation.