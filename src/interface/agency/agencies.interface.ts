export interface IAgency {
  guid: string;
  agencyName: string;
  tagline?: string;
  location?: string;
  slogan?: string;
  logo?: string;
  email?: string;
  phone?: string;
  portfolioURL?: string;
  companySize?: number;
  rating?: string;
  reviewCount?: string;
  budget?: string;
  statusId: number;
  createdBy?: string;
  createdAt: Date;
  updatedBy?: string;
  updatedAt?: Date;
}

export interface ICreateAgency {
  agencyName: string;
  tagline?: string;
  location?: string;
  slogan?: string;
  logo?: string;
  email?: string;
  phone?: string;
  portfolioURL?: string;
  companySize?: number;
  rating?: string;
  reviewCount?: string;
  budget?: string;
}

export interface IUpdateAgency {
  agencyName?: string;
  tagline?: string;
  location?: string;
  slogan?: string;
  logo?: string;
  email?: string;
  phone?: string;
  portfolioURL?: string;
  companySize?: number;
  rating?: string;
  reviewCount?: string;
  budget?: string;
}