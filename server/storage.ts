import { users, type User, type InsertUser } from "@shared/schema";

export interface IStorage {
  createUser(user: InsertUser): Promise<User>;
  getUser(walletAddress: string): Promise<User | undefined>;
  updateUserAnalysis(
    walletAddress: string,
    riskProfile: User["riskProfile"],
    recommendations: User["recommendations"]
  ): Promise<User>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private currentId: number;

  constructor() {
    this.users = new Map();
    this.currentId = 1;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = {
      ...insertUser,
      id,
      riskProfile: null,
      recommendations: null,
    };
    this.users.set(id, user);
    return user;
  }

  async getUser(walletAddress: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.walletAddress === walletAddress
    );
  }

  async updateUserAnalysis(
    walletAddress: string,
    riskProfile: User["riskProfile"],
    recommendations: User["recommendations"]
  ): Promise<User> {
    const user = await this.getUser(walletAddress);
    if (!user) throw new Error("User not found");
    
    const updatedUser = {
      ...user,
      riskProfile,
      recommendations,
    };
    this.users.set(user.id, updatedUser);
    return updatedUser;
  }
}

export const storage = new MemStorage();
