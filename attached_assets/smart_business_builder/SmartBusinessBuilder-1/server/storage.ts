import { users, modules, userProgress, businessModels, businessClarity, productDesign, launchPlan, feedbackLoop, progressTracker, type User, type InsertUser, type Module, type InsertModule, type UserProgress, type InsertUserProgress, type BusinessModel, type InsertBusinessModel, type BusinessClarity, type InsertBusinessClarity, type ProductDesign, type InsertProductDesign, type LaunchPlan, type InsertLaunchPlan, type FeedbackLoop, type InsertFeedbackLoop, type ProgressTracker, type InsertProgressTracker } from "@shared/schema";
import { writeFileSync, readFileSync, existsSync } from "fs";
import { join } from "path";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getModule(moduleId: string): Promise<Module | undefined>;
  createModule(module: InsertModule): Promise<Module>;
  getAllModules(): Promise<Module[]>;
  
  getUserProgress(userId: number, moduleId: string): Promise<UserProgress | undefined>;
  createUserProgress(progress: InsertUserProgress): Promise<UserProgress>;
  updateUserProgress(userId: number, moduleId: string, updates: Partial<UserProgress>): Promise<UserProgress | undefined>;
  
  getBusinessModel(id: number): Promise<BusinessModel | undefined>;
  getBusinessModelsByUser(userId: string): Promise<BusinessModel[]>;
  createBusinessModel(model: InsertBusinessModel): Promise<BusinessModel>;
  
  getBusinessClarity(userId: number): Promise<BusinessClarity | undefined>;
  createBusinessClarity(clarity: InsertBusinessClarity): Promise<BusinessClarity>;
  
  getProductDesign(userId: number): Promise<ProductDesign | undefined>;
  createProductDesign(design: InsertProductDesign): Promise<ProductDesign>;
  
  getLaunchPlan(userId: number): Promise<LaunchPlan | undefined>;
  createLaunchPlan(plan: InsertLaunchPlan): Promise<LaunchPlan>;
  
  getFeedbackLoop(userId: number): Promise<FeedbackLoop | undefined>;
  createFeedbackLoop(loop: InsertFeedbackLoop): Promise<FeedbackLoop>;
  
  getProgressTracker(userId: number): Promise<ProgressTracker | undefined>;
  createProgressTracker(tracker: InsertProgressTracker): Promise<ProgressTracker>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private modules: Map<string, Module>;
  private userProgress: Map<string, UserProgress>;
  private businessModels: Map<number, BusinessModel>;
  private businessClarities: Map<number, BusinessClarity>;
  private productDesigns: Map<number, ProductDesign>;
  private launchPlans: Map<number, LaunchPlan>;
  private feedbackLoops: Map<number, FeedbackLoop>;
  private progressTrackers: Map<number, ProgressTracker>;
  private currentUserId: number;
  private currentModuleId: number;
  private currentProgressId: number;
  private currentBusinessModelId: number;
  private currentBusinessClarityId: number;
  private currentProductDesignId: number;
  private currentLaunchPlanId: number;
  private currentFeedbackLoopId: number;
  private currentProgressTrackerId: number;

  constructor() {
    this.users = new Map();
    this.modules = new Map();
    this.userProgress = new Map();
    this.businessModels = new Map();
    this.businessClarities = new Map();
    this.productDesigns = new Map();
    this.launchPlans = new Map();
    this.feedbackLoops = new Map();
    this.progressTrackers = new Map();
    this.currentUserId = 1;
    this.currentModuleId = 1;
    this.currentProgressId = 1;
    this.currentBusinessModelId = 1;
    this.currentBusinessClarityId = 1;
    this.currentProductDesignId = 1;
    this.currentLaunchPlanId = 1;
    this.currentFeedbackLoopId = 1;
    this.currentProgressTrackerId = 1;
    
    // Load existing data on startup
    this.loadData();
    
    // Initialize with Module 1A
    this.modules.set("1A", {
      id: this.currentModuleId++,
      moduleId: "1A",
      title: "Intro Explainer Panel",
      status: "active",
      createdAt: new Date(),
    });
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

  async getModule(moduleId: string): Promise<Module | undefined> {
    return this.modules.get(moduleId);
  }

  async createModule(insertModule: InsertModule): Promise<Module> {
    const id = this.currentModuleId++;
    const module: Module = { 
      ...insertModule, 
      id,
      createdAt: new Date(),
    };
    this.modules.set(insertModule.moduleId, module);
    return module;
  }

  async getAllModules(): Promise<Module[]> {
    return Array.from(this.modules.values());
  }

  async getUserProgress(userId: number, moduleId: string): Promise<UserProgress | undefined> {
    const key = `${userId}-${moduleId}`;
    return this.userProgress.get(key);
  }

  async createUserProgress(insertProgress: InsertUserProgress): Promise<UserProgress> {
    const id = this.currentProgressId++;
    const progress: UserProgress = {
      ...insertProgress,
      id,
      createdAt: new Date(),
      completedAt: insertProgress.completed ? new Date() : null,
    };
    const key = `${insertProgress.userId}-${insertProgress.moduleId}`;
    this.userProgress.set(key, progress);
    return progress;
  }

  async updateUserProgress(userId: number, moduleId: string, updates: Partial<UserProgress>): Promise<UserProgress | undefined> {
    const key = `${userId}-${moduleId}`;
    const existing = this.userProgress.get(key);
    if (!existing) return undefined;

    const updated: UserProgress = {
      ...existing,
      ...updates,
      completedAt: updates.completed && !existing.completed ? new Date() : existing.completedAt,
    };
    this.userProgress.set(key, updated);
    return updated;
  }

  async getBusinessModel(id: number): Promise<BusinessModel | undefined> {
    return this.businessModels.get(id);
  }

  async getBusinessModelsByUser(userId: string): Promise<BusinessModel[]> {
    const allModels = Array.from(this.businessModels.values());
    console.log(`Storage has ${allModels.length} total models`);
    if (allModels.length > 0) {
      console.log("All stored userIds:", allModels.map(m => m.userId));
    }
    return allModels.filter(model => model.userId === userId);
  }

  async createBusinessModel(insertModel: InsertBusinessModel): Promise<BusinessModel> {
    const id = this.currentBusinessModelId++;
    const model: BusinessModel = {
      ...insertModel,
      id,
      createdAt: new Date(),
      warnings: insertModel.warnings || null,
      suggestions: insertModel.suggestions || null,
    };
    this.businessModels.set(id, model);
    this.saveData(); // Persist to file
    return model;
  }

  async getBusinessClarity(userId: number): Promise<BusinessClarity | undefined> {
    return Array.from(this.businessClarities.values()).find(clarity => clarity.userId === userId);
  }

  async createBusinessClarity(insertClarity: InsertBusinessClarity): Promise<BusinessClarity> {
    const id = this.currentBusinessClarityId++;
    const clarity: BusinessClarity = {
      ...insertClarity,
      id,
      createdAt: new Date(),
    };
    
    this.businessClarities.set(id, clarity);
    this.saveData();
    return clarity;
  }

  async getProductDesign(userId: number): Promise<ProductDesign | undefined> {
    return Array.from(this.productDesigns.values()).find(design => design.userId === userId);
  }

  async createProductDesign(insertDesign: InsertProductDesign): Promise<ProductDesign> {
    const id = this.currentProductDesignId++;
    const design: ProductDesign = {
      ...insertDesign,
      id,
      createdAt: new Date(),
    };
    
    this.productDesigns.set(id, design);
    this.saveData();
    return design;
  }

  async getLaunchPlan(userId: number): Promise<LaunchPlan | undefined> {
    return Array.from(this.launchPlans.values()).find(plan => plan.userId === userId);
  }

  async createLaunchPlan(insertPlan: InsertLaunchPlan): Promise<LaunchPlan> {
    const id = this.currentLaunchPlanId++;
    const plan: LaunchPlan = {
      ...insertPlan,
      id,
      createdAt: new Date(),
    };
    
    this.launchPlans.set(id, plan);
    this.saveData();
    return plan;
  }

  async getFeedbackLoop(userId: number): Promise<FeedbackLoop | undefined> {
    return Array.from(this.feedbackLoops.values()).find(loop => loop.userId === userId);
  }

  async createFeedbackLoop(insertLoop: InsertFeedbackLoop): Promise<FeedbackLoop> {
    const id = this.currentFeedbackLoopId++;
    const loop: FeedbackLoop = {
      ...insertLoop,
      id,
      createdAt: new Date(),
    };
    
    this.feedbackLoops.set(id, loop);
    this.saveData();
    return loop;
  }

  async getProgressTracker(userId: number): Promise<ProgressTracker | undefined> {
    return Array.from(this.progressTrackers.values()).find(tracker => tracker.userId === userId);
  }

  async createProgressTracker(insertTracker: InsertProgressTracker): Promise<ProgressTracker> {
    const id = this.currentProgressTrackerId++;
    const tracker: ProgressTracker = {
      ...insertTracker,
      id,
      createdAt: new Date(),
    };
    
    this.progressTrackers.set(id, tracker);
    this.saveData();
    return tracker;
  }

  private getDataFilePath(): string {
    return join(process.cwd(), 'storage-data.json');
  }

  private loadData(): void {
    try {
      const filePath = this.getDataFilePath();
      if (existsSync(filePath)) {
        const data = JSON.parse(readFileSync(filePath, 'utf8'));
        
        // Load business models
        if (data.businessModels) {
          this.businessModels = new Map();
          for (const [id, model] of Object.entries(data.businessModels)) {
            const parsedModel = model as any;
            parsedModel.createdAt = new Date(parsedModel.createdAt);
            this.businessModels.set(parseInt(id), parsedModel);
          }
          this.currentBusinessModelId = Math.max(...Array.from(this.businessModels.keys()), 0) + 1;
        }

        // Load business clarities
        if (data.businessClarities) {
          this.businessClarities = new Map();
          for (const [id, clarity] of Object.entries(data.businessClarities)) {
            const parsedClarity = clarity as any;
            parsedClarity.createdAt = new Date(parsedClarity.createdAt);
            this.businessClarities.set(parseInt(id), parsedClarity);
          }
          this.currentBusinessClarityId = Math.max(...Array.from(this.businessClarities.keys()), 0) + 1;
        }
        
        console.log(`Loaded ${this.businessModels.size} business models and ${this.businessClarities.size} business clarities from storage`);
      }
    } catch (error) {
      console.error('Error loading data from file:', error);
    }
  }

  private saveData(): void {
    try {
      const data = {
        businessModels: Object.fromEntries(this.businessModels.entries()),
        businessClarities: Object.fromEntries(this.businessClarities.entries())
      };
      const filePath = this.getDataFilePath();
      writeFileSync(filePath, JSON.stringify(data, null, 2));
    } catch (error) {
      console.error('Error saving data to file:', error);
    }
  }
}

export const storage = new MemStorage();
