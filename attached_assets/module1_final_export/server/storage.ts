import { 
  users, 
  workbookSessions,
  type User, 
  type InsertUser, 
  type WorkbookSession, 
  type InsertWorkbookSession,
  type UpdateWorkbookSession 
} from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getWorkbookSession(id: number): Promise<WorkbookSession | undefined>;
  createWorkbookSession(session: InsertWorkbookSession): Promise<WorkbookSession>;
  updateWorkbookSession(id: number, updates: UpdateWorkbookSession): Promise<WorkbookSession | undefined>;
  getWorkbookSessionByUser(userId: number): Promise<WorkbookSession | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private workbookSessions: Map<number, WorkbookSession>;
  private currentUserId: number;
  private currentSessionId: number;

  constructor() {
    this.users = new Map();
    this.workbookSessions = new Map();
    this.currentUserId = 1;
    this.currentSessionId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getWorkbookSession(id: number): Promise<WorkbookSession | undefined> {
    return this.workbookSessions.get(id);
  }

  async createWorkbookSession(insertSession: InsertWorkbookSession): Promise<WorkbookSession> {
    const id = this.currentSessionId++;
    const session: WorkbookSession = { 
      ...insertSession, 
      id,
      dnaMode: insertSession.dnaMode || "architect",
      energyLevel: insertSession.energyLevel || 7,
      businessFilter: insertSession.businessFilter || { problem: null, person: null, profit: null, pull: null },
      ednaReflection: insertSession.ednaReflection || { architectReflection1: "", architectReflection2: "", alchemistReflection1: "", alchemistReflection2: "" },
      clarityPrompts: insertSession.clarityPrompts || { businessIdea: "", audience: "", problem: "", transformation: "", vehicle: "", emotion: "", blocker: "", aiResponse: "", clarityReflection: "" },
      offerBuilder: insertSession.offerBuilder || { 
        transformation: "", 
        vehicle: "", 
        price: "", 
        timeline: "", 
        promise: "",
        offerChecklist: {
          transformationClear: false,
          vehicleValuable: false,
          priceProfitable: false,
          urgencyReason: false,
          repeatableProfitable: false
        }
      },
      viabilityScores: insertSession.viabilityScores || { 
        clarity: 3, 
        demand: 3, 
        differentiation: 3, 
        deliveryFeasibility: 3, 
        emotionalPull: 3, 
        buyerUrgency: 3, 
        profitPotential: 3, 
        founderFit: 3,
        totalScore: 24
      },
      brandingData: insertSession.brandingData || { 
        businessSummary: "", 
        targetAudience: "", 
        productService: "", 
        nameOptions: [],
        finalName: "", 
        tagline: "", 
        brandColors: "", 
        logoConceptSelected: "",
        namingCriteria: {
          domainAvailable: false,
          shortLength: false,
          memorable: false,
          noSpellingConfusion: false,
          alignedWithOffer: false,
          visualPotential: false,
          socialHandlesAvailable: false,
          noTrademarkConflicts: false
        }
      },
      completedSections: insertSession.completedSections || []
    };
    this.workbookSessions.set(id, session);
    return session;
  }

  async updateWorkbookSession(id: number, updates: UpdateWorkbookSession): Promise<WorkbookSession | undefined> {
    const existing = this.workbookSessions.get(id);
    if (!existing) return undefined;

    const updated: WorkbookSession = { ...existing, ...updates };
    this.workbookSessions.set(id, updated);
    return updated;
  }

  async getWorkbookSessionByUser(userId: number): Promise<WorkbookSession | undefined> {
    return Array.from(this.workbookSessions.values()).find(
      (session) => session.userId === userId
    );
  }
}

export const storage = new MemStorage();
