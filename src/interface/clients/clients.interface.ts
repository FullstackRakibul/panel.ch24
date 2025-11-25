export interface IClient {
  guid: string;
  clintName: string;
  email?: string;
  phone?: string;
  mobile?: string;
  city?: string;
  location: string;
  country?: string;
  cTypeId: string;
  agencyId?: string;
  taxId?: string;
  tollFreeNumber?: string;
  portfolioURL?: string;
  companyRegistrationDate?: string;
  companyLogo?: string;
  remarks?: string;
  statusId?: string;
  createdAt?: string;
  updatedAt?: string;
  isDeleted?: boolean;
  clientType?: IClientType;
  agency?: IAgency;
  status?: ICommonStatus;
}

export interface IClientCreateRequest {
  clintName: string;
  email?: string;
  phone?: string;
  mobile?: string;
  city?: string;
  location: string;
  country?: string;
  cTypeId: string;
  agencyId?: string | null;
  taxId?: string;
  tollFreeNumber?: string;
  portfolioURL?: string;
  companyRegistrationDate?: string;
  companyLogo?: string;
  remarks?: string;
}

export interface IAgencyCreateRequest {
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

export interface IClientType {
  guid: string;
  cTypeName: string;
  remarks?: string;
  createdAt?: string;
  updatedAt?: string;
  clientCount?: number;
}

export interface IAgency {
  guid: string;
  agencyName?: string;
  email?: string;
  phone?: string;
  location?: string;
}

export interface ICommonStatus {
  guid: string;
  statusName: string;
  description?: string;
  module?: string;
}