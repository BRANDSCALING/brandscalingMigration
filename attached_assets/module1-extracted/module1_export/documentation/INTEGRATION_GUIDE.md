# Module 1 Integration Guide

## Step-by-Step Integration Process

### 1. File Structure Setup
Copy the files to your project maintaining this structure:
```
your-project/
├── client/src/
│   ├── components/workbook/
│   │   ├── module1-welcome.tsx
│   │   ├── business-filter.tsx
│   │   ├── edna-reflection.tsx
│   │   ├── clarity-prompts.tsx
│   │   ├── offer-builder.tsx
│   │   ├── viability-scorecard.tsx
│   │   ├── name-logo-builder.tsx
│   │   ├── dna-toggle.tsx
│   │   ├── progress-sidebar.tsx
│   │   └── mobile-progress.tsx
│   ├── hooks/
│   │   └── use-dna-mode.tsx
│   ├── lib/
│   │   └── ai-service.ts
│   └── types/
│       └── workbook.ts
├── shared/
│   └── schema.ts (merge Module 1 portions)
└── server/
    └── openai.ts
```

### 2. Database Schema Integration
Add these fields to your workbook_sessions table:

```typescript
// Module 1 Fields to add to your schema
businessFilter: json("business_filter").$type<{
  problem: boolean | null;
  person: boolean | null;
  profit: boolean | null;
  pull: boolean | null;
  customPrompt?: string;
  aiResponse?: string;
}>(),

ednaReflection: json("edna_reflection").$type<{
  architectReflection1: string;
  architectReflection2: string;
  alchemistReflection1: string;
  alchemistReflection2: string;
}>(),

clarityPrompts: json("clarity_prompts").$type<{
  businessIdea: string;
  audience: string;
  problem: string;
  transformation: string;
  vehicle: string;
  emotion: string;
  blocker: string;
  aiResponse: string;
  clarityReflection: string;
  customPrompt: string;
}>(),

offerBuilder: json("offer_builder").$type<{
  transformation: string;
  vehicle: string;
  price: string;
  timeline: string;
  promise: string;
  aiResponseSpace: string;
  customPrompt: string;
  aiResponse: string;
  offerChecklist: {
    transformationClear: boolean;
    vehicleValuable: boolean;
    priceProfitable: boolean;
    urgencyReason: boolean;
    repeatableProfitable: boolean;
  };
}>(),

viabilityScores: json("viability_scores").$type<{
  clarity: number;
  demand: number;
  differentiation: number;
  deliveryFeasibility: number;
  emotionalPull: number;
  buyerUrgency: number;
  profitPotential: number;
  founderFit: number;
  totalScore: number;
}>(),

brandingResults: json("branding_results").$type<{
  businessDescription: string;
  targetAudience: string;
  brandTone: string;
  keyBenefits: string;
  industry: string;
  selectedBusinessName: string;
  selectedTagline: string;
  selectedColors: string[];
  aiResponse: string;
  customPrompt: string;
}>(),
```

### 3. CSS/Tailwind Configuration
Add these custom colors to your tailwind.config.ts:

```typescript
theme: {
  extend: {
    colors: {
      'brand-purple': '#6B46C1',
      'scale-orange': '#EA580C',
      'strategic-black': '#1F2937',
    },
    backgroundImage: {
      'brand-gradient': 'linear-gradient(135deg, #6B46C1 0%, #EA580C 100%)',
      'brand-gradient-light': 'linear-gradient(135deg, #E0E7FF 0%, #FED7AA 100%)',
    }
  }
}
```

### 4. Router Integration
Add Module 1 routes to your main router:

```typescript
// In your main App.tsx or router file
import Module1Welcome from '@/components/workbook/module1-welcome';
import BusinessFilter from '@/components/workbook/business-filter';
import EdnaReflection from '@/components/workbook/edna-reflection';
import ClarityPrompts from '@/components/workbook/clarity-prompts';
import OfferBuilder from '@/components/workbook/offer-builder';
import ViabilityScorecard from '@/components/workbook/viability-scorecard';
import NameLogoBuilder from '@/components/workbook/name-logo-builder';

// Add routes
<Route path="/module1" component={Module1Welcome} />
<Route path="/workbook" component={YourWorkbookPage} />
```

### 5. API Endpoints
Ensure your server has these endpoints:
- `GET /api/workbook/session` - Get workbook session
- `PATCH /api/workbook/session/:id` - Update workbook session
- `POST /api/workbook/ai-prompt` - AI prompt processing
- `POST /api/workbook/clarity` - Clarity enhancement (optional)
- `POST /api/workbook/branding` - Branding suggestions (optional)

### 6. Environment Variables
Set up required environment variables:
```
OPENAI_API_KEY=your_openai_api_key_here
DATABASE_URL=your_database_url_here
```

### 7. Testing Integration
1. Start your application
2. Navigate to Module 1 welcome page
3. Test DNA mode toggle functionality
4. Complete each section to verify data persistence
5. Test AI integration in sections 1.1, 1.3, 1.4, and 1.6

### Common Integration Issues

**Import Path Errors**: Update import paths to match your project structure
**Missing Dependencies**: Install all required packages listed in README.md
**CSS Classes Missing**: Ensure Tailwind CSS is configured with custom brand colors
**Database Errors**: Run database migrations to add new schema fields
**API Errors**: Verify OpenAI API key is set and endpoints are configured

### Success Verification
Module 1 is successfully integrated when:
- ✅ All 7 sections load without errors
- ✅ Progress tracking works across sections  
- ✅ DNA mode toggle changes content appropriately
- ✅ AI responses generate successfully
- ✅ Data persists between sessions
- ✅ Mobile responsive design works correctly