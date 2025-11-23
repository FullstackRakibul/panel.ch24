export interface ITelevisionContractFilter {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
  startDate?: string; // YYYY-MM-DD
  endDate?: string; // YYYY-MM-DD
  contractStartFrom?: string; // YYYY-MM-DD
  contractEndTo?: string; // YYYY-MM-DD
  clientId?: string;
  agencyId?: string;
  minAmount?: number;
  maxAmount?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ITelevisionContractListResponse {
  data: ITelevisionContract[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface ITelevisionContract {
  guid: string;
  televisionContractNo: string;
  contractDate: string;
  contractStartDate: string;
  contractEndDate: string;
  contractedClientId: string | null;
  contractedAgencyId: string | null;
  vat: number | null;
  vatRate: number | null;
  total: number | null;
  remarks: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  
  // Nested objects
  contractedClient?: IClientSimple | null;
  contractedAgency?: IAgencySimple | null;
  products?: ITelevisionContractProduct[];
  onAirDescriptions?: ITelevisionContractOnAirDescription[];
}

export interface IClientSimple {
  guid: string;
  clintName: string;
  email?: string | null;
  phone?: string | null;
}

export interface IAgencySimple {
  guid: string;
  agencyName?: string | null;
  email?: string | null;
}

export interface ITelevisionContractProduct {
  guid: string;
  contractProductName?: string | null;
  contractProductDescription?: string | null;
  quantity: number | null;
  vat: number | null;
  vatRate: number | null;
  total: number | null;
  remarks?: string | null;
  createdAt?: string | null;
  productItems?: ITelevisionContractProductItem[];
}

export interface ITelevisionContractProductItem {
  guid: string;
  particularsName?: string | null;
  rate: number | null;
  remarks?: string | null;
  vat: number | null;
  vatRate: number | null;
  createdAt?: string | null;
}

export interface ITelevisionContractOnAirDescription {
  guid: string;
  onAirDuration?: string | null;
  descriptionType?: string | null;
  descriptionText?: string | null;
  displayOrder?: string | null;
  descriptionTypeName?: string | null;
  descriptionTypeDescription?: string | null;
  remarks?: string | null;
  extra?: string | null;
  createdAt?: string | null;
  transmissionSchedule?: ITransmissionSchedule[];
}

export interface ITransmissionSchedule {
  guid: string;
  dateValue?: string | null;
  durationInMinute?: number | null;
  remarks?: string | null;
  createdAt?: string | null;
}

// Request DTOs
export interface ITelevisionContractCreateRequest extends Omit<ITelevisionContractRequest, 'guid'> {}
export interface ITelevisionContractUpdateRequest extends ITelevisionContractRequest {}

export interface ITelevisionContractRequest {
  guid: string;
  televisionContractNo: string;
  contractDate: string;
  contractStartDate: string;
  contractEndDate: string;
  contractedClientId: string | null;
  contractedAgencyId: string | null;
  vat: number | null;
  vatRate: number | null;
  total: number | null;
  remarks?: string | null;
  products?: ITelevisionContractProductRequest[];
  onAirDescriptions?: ITelevisionContractOnAirDescriptionRequest[];
}

export interface ITelevisionContractProductRequest {
  contractProductName?: string | null;
  contractProductDescription?: string | null;
  quantity: number | null;
  vat: number | null;
  vatRate: number | null;
  total: number | null;
  remarks?: string | null;
  productItems?: ITelevisionContractProductItemsRequest[];
}

export interface ITelevisionContractProductItemsRequest {
  guid: string;
  particularsName?: string | null;
  rate: number | null;
  remarks?: string | null;
  vat: number | null;
  vatRate: number | null;
}

export interface ITelevisionContractOnAirDescriptionRequest {
  guid?: string | null;
  onAirDuration?: string | null;
  descriptionType?: string | null;
  descriptionText?: string | null;
  descriptionTypeName?: string | null;
  descriptionTypeDescription?: string | null;
  remarks?: string | null;
  createdAt?: string;
  statusId?: number;
  isDeleted?: boolean;
  transmissionSchedule?: ITelevisionContractOnAirDescriptionTransmissionScheduleRequest[];
}

export interface ITelevisionContractOnAirDescriptionTransmissionScheduleRequest {
  guid: string;
  onAirDescriptionId: string;
  dateValue?: string | null;
  durationInMinute?: number | null;
  remarks?: string | null;
}