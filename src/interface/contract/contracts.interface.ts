// In contracts.interface.ts - Add these interfaces

export interface ITelevisionContractCreateRequest {
  guid?: string
  televisionContractNo: string
  contractDate: string
  contractStartDate: string
  contractEndDate: string
  contractedClientId: string | null
  contractedAgencyId: string | null
  vat: number
  vatRate: number
  total: number
  remarks?: string | null
  products: ITelevisionContractProductRequest[]
  onAirDescriptions: ITelevisionContractOnAirDescriptionRequest[]
}

export interface ITelevisionContractUpdateRequest extends ITelevisionContractCreateRequest {
  guid: string
}

export interface ITelevisionContractProductRequest {
  contractProductName: string
  contractProductDescription?: string | null
  quantity: number
  vat: number
  vatRate: number
  total: number
  remarks?: string | null
  productItems: ITelevisionContractProductItemRequest[]
}

export interface ITelevisionContractProductItemRequest {
  guid?: string
  particularsName: string
  rate: number
  remarks?: string | null
  vat: number
  vatRate: number
}

export interface ITelevisionContractOnAirDescriptionRequest {
  guid?: string
  onAirDuration: string
  descriptionType: string
  descriptionText: string
  descriptionTypeName?: string | null
  descriptionTypeDescription?: string | null
  remarks?: string | null
  createdAt?: string
  statusId?: number
  isDeleted?: boolean
  transmissionSchedule: ITransmissionScheduleRequest[]
}

export interface ITransmissionScheduleRequest {
  guid?: string
  onAirDescriptionId?: string
  dateValue: string
  durationInMinute: number
  remarks?: string | null
}


///////////////////////

export interface ITelevisionContractFilter {
  page?: number
  pageSize?: number
  search?: string
  status?: string
  startDate?: string
  endDate?: string
  contractStartFrom?: string
  contractEndTo?: string
  clientId?: string
  agencyId?: string
  minAmount?: number
  maxAmount?: number
  sortBy?: string
  sortOrder?: "asc" | "desc"
}

export interface ITelevisionContractListResponse {
  data: ITelevisionContract[]
  totalCount: number
  page: number
  pageSize: number
  totalPages: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

export interface ITelevisionContract {
  guid: string
  televisionContractNo: string
  contractDate: string
  contractStartDate: string
  contractEndDate: string
  contractedClientId: string | null
  contractedAgencyId: string | null
  vat: number | null
  vatRate: number | null
  total: number | null
  remarks: string | null
  createdAt?: string | null
  updatedAt?: string | null

  contractedClient?: IClientSimple | null
  contractedAgency?: IAgencySimple | null
  products?: ITelevisionContractProduct[]
  onAirDescriptions?: ITelevisionContractOnAirDescription[]
}

export interface IClientSimple {
  guid: string
  clintName: string
  email?: string | null
  phone?: string | null
}

export interface IAgencySimple {
  guid: string
  agencyName?: string | null
  email?: string | null
}

export interface ITelevisionContractProduct {
  guid: string
  contractProductName?: string | null
  contractProductDescription?: string | null
  quantity: number | null
  vat: number | null
  vatRate: number | null
  total: number | null
  remarks?: string | null
  createdAt?: string | null
  productItems?: ITelevisionContractProductItem[]
}

export interface ITelevisionContractProductItem {
  guid: string
  particularsName?: string | null
  rate: number | null
  remarks?: string | null
  vat: number | null
  vatRate: number | null
  createdAt?: string | null
}

export interface ITelevisionContractOnAirDescription {
  guid: string
  onAirDuration?: string | null // Month name like "October 2025"
  descriptionType?: string | null // "Branding Package" or custom name
  descriptionText?: string | null // Description details
  descriptionTypeName?: string | null
  descriptionTypeDescription?: string | null
  remarks?: string | null
  createdAt?: string | null
  statusId?: number
  isDeleted?: boolean
  transmissionSchedule?: ITransmissionSchedule[]
}

export interface ITransmissionSchedule {
  guid: string
  onAirDescriptionId?: string | null
  dateValue?: string | null // Multiple dates like "01,02,03..."
  durationInMinute?: number | null
  remarks?: string | null
  createdAt?: string | null
}

// Request DTOs
export interface ITelevisionContractCreateRequest extends Omit<ITelevisionContractRequest, "guid"> {
  guid?: string
}

export interface ITelevisionContractRequest {
  guid: string
  televisionContractNo: string
  contractDate: string
  contractStartDate: string
  contractEndDate: string
  contractedClientId: string | null
  contractedAgencyId: string | null
  vat: number | null
  vatRate: number | null
  total: number | null
  remarks?: string | null
  products?: ITelevisionContractProductRequest[]
  onAirDescriptions?: ITelevisionContractOnAirDescriptionRequest[]
}


export interface ITelevisionContractProductItemsRequest {
  guid: string
  particularsName?: string | null
  rate: number | null
  remarks?: string | null
  vat: number | null
  vatRate: number | null
}



export interface ITelevisionContractOnAirDescriptionTransmissionScheduleRequest {
  guid: string
  onAirDescriptionId?: string
  dateValue?: string | null
  durationInMinute?: number | null
  remarks?: string | null
}
