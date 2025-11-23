
import type { ITelevisionContract, ITelevisionContractCreateRequest, ITelevisionContractFilter, ITelevisionContractListResponse, ITelevisionContractUpdateRequest } from "@/interface/contract/contracts.interface";
import { useHttp } from "@/utils/base.Http"

export const contractService = {
  // Get all television contracts with pagination and filtering
  // getAllTelevisionContracts: async (filter?: ITelevisionContractFilter): Promise<ITelevisionContractListResponse> => {
  //   const params = new URLSearchParams();
    
  //   if (filter?.page) params.append('page', filter.page.toString());
  //   if (filter?.pageSize) params.append('pageSize', filter.pageSize.toString());
  //   if (filter?.search) params.append('search', filter.search);
  //   if (filter?.status) params.append('status', filter.status);
  //   if (filter?.startDate) params.append('startDate', filter.startDate);
  //   if (filter?.endDate) params.append('endDate', filter.endDate);
  //   if (filter?.clientId) params.append('clientId', filter.clientId);
  //   if (filter?.agencyId) params.append('agencyId', filter.agencyId);

  //   const queryString = params.toString();
  //   const url = queryString ? `/api/v1/television-contract?${queryString}` : '/api/v1/television-contract';
    
  //   const response = await useHttp().get(url);
  //   return response.data;
  // },

  getAllTelevisionContracts: async (): Promise<ITelevisionContract[]> => {
    
    const response = await useHttp().get("/television-contract");
    return response.data;
  },

  
  // Get television contract by ID
  getTelevisionContractById: async (contractId: string): Promise<ITelevisionContract> => {
    const response = await useHttp().get(`/television-contract/${contractId}`);
    return response.data.data;
  },

  // Create new television contract
  createTelevisionContract: async (contractData: ITelevisionContractCreateRequest): Promise<{ 
    message: string; 
    contractId: string;
    contractNo: string;
  }> => {
    const response = await useHttp().post("/television-contract", contractData);
    return response.data;
  },

  // Update television contract
  updateTelevisionContract: async (contractId: string, contractData: ITelevisionContractUpdateRequest): Promise<{ 
    message: string;
    updatedAt: string;
  }> => {
    const response = await useHttp().put(`/television-contract/${contractId}`, contractData);
    return response.data;
  },

  // Delete television contract
  deleteTelevisionContract: async (contractId: string): Promise<{ message: string }> => {
    const response = await useHttp().delete(`/television-contract/${contractId}`);
    return response.data;
  },

  // Get contracts by client ID
  getContractsByClientId: async (clientId: string, filter?: ITelevisionContractFilter): Promise<ITelevisionContractListResponse> => {
    const params = new URLSearchParams();
    params.append('clientId', clientId);
    
    if (filter?.page) params.append('page', filter.page.toString());
    if (filter?.pageSize) params.append('pageSize', filter.pageSize.toString());
    if (filter?.search) params.append('search', filter.search);
    if (filter?.startDate) params.append('startDate', filter.startDate);
    if (filter?.endDate) params.append('endDate', filter.endDate);

    const response = await useHttp().get(`/television-contract?${params.toString()}`);
    return response.data;
  },

  // Get contracts by agency ID
  getContractsByAgencyId: async (agencyId: string, filter?: ITelevisionContractFilter): Promise<ITelevisionContractListResponse> => {
    const params = new URLSearchParams();
    params.append('agencyId', agencyId);
    
    if (filter?.page) params.append('page', filter.page.toString());
    if (filter?.pageSize) params.append('pageSize', filter.pageSize.toString());
    if (filter?.search) params.append('search', filter.search);
    if (filter?.startDate) params.append('startDate', filter.startDate);
    if (filter?.endDate) params.append('endDate', filter.endDate);

    const response = await useHttp().get(`/television-contract?${params.toString()}`);
    return response.data;
  },

  // Get contracts by date range
  getContractsByDateRange: async (startDate: string, endDate: string, filter?: ITelevisionContractFilter): Promise<ITelevisionContractListResponse> => {
    const params = new URLSearchParams();
    params.append('startDate', startDate);
    params.append('endDate', endDate);
    
    if (filter?.page) params.append('page', filter.page.toString());
    if (filter?.pageSize) params.append('pageSize', filter.pageSize.toString());
    if (filter?.search) params.append('search', filter.search);
    if (filter?.clientId) params.append('clientId', filter.clientId);
    if (filter?.agencyId) params.append('agencyId', filter.agencyId);

    const response = await useHttp().get(`/television-contract?${params.toString()}`);
    return response.data;
  },

  // Duplicate contract
  duplicateContract: async (contractId: string): Promise<{ 
    message: string; 
    newContractId: string;
    newContractNo: string;
  }> => {
    const response = await useHttp().post(`/television-contract/${contractId}/duplicate`);
    return response.data;
  },

  // Update contract status
  updateContractStatus: async (contractId: string, status: string): Promise<{ 
    message: string;
    status: string;
    updatedAt: string;
  }> => {
    const response = await useHttp().patch(`/television-contract/${contractId}/status`, { status });
    return response.data;
  },

  // Export contract as PDF
  exportContractAsPdf: async (contractId: string): Promise<Blob> => {
    const response = await useHttp().get(`/television-contract/${contractId}/export/pdf`, {
      responseType: 'blob'
    });
    return response.data;
  },

  // Get contract statistics
  getContractStatistics: async (): Promise<{
    totalContracts: number;
    activeContracts: number;
    draftContracts: number;
    completedContracts: number;
    cancelledContracts: number;
    totalRevenue: number;
    monthlyRevenue: Array<{ month: string; revenue: number }>;
  }> => {
    const response = await useHttp().get('/television-contract/statistics');
    return response.data;
  }
};

// Additional services for related entities
export const clientService = {
  // Get all clients for dropdown
  getClientsList: async (): Promise<Array<{ guid: string; name: string; code: string }>> => {
    const response = await useHttp().get("/clients");
    return response.data;
  },

  // Search clients by name or code
  searchClients: async (searchTerm: string): Promise<Array<{ guid: string; name: string; code: string }>> => {
    const response = await useHttp().get(`/clients/search?q=${encodeURIComponent(searchTerm)}`);
    return response.data;
  }
};

export const agencyService = {
  // Get all agencies for dropdown
  getAgenciesList: async (): Promise<Array<{ guid: string; name: string; code: string }>> => {
    const response = await useHttp().get("/agencies");
    return response.data;
  },

  // Search agencies by name or code
  searchAgencies: async (searchTerm: string): Promise<Array<{ guid: string; name: string; code: string }>> => {
    const response = await useHttp().get(`/agencies/search?q=${encodeURIComponent(searchTerm)}`);
    return response.data;
  }
};

// Utility functions for contract operations
export const contractUtils = {
  // Generate contract number
  generateContractNumber: (): string => {
    const prefix = 'TV-CON';
    const timestamp = new Date().getTime().toString().slice(-6);
    const random = Math.random().toString(36).substring(2, 5).toUpperCase();
    return `${prefix}-${timestamp}-${random}`;
  },

  // Calculate contract totals
  calculateContractTotals: (contract: ITelevisionContractCreateRequest) => {
    let productsTotal = 0;
    
    contract.products?.forEach(product => {
      let productItemsTotal = 0;
      
      product.productItems?.forEach(item => {
        const itemTotal = (item.rate || 0) + ((item.rate || 0) * ((item.vatRate || 0) / 100));
        productItemsTotal += itemTotal;
      });
      
      product.total = productItemsTotal * (product.quantity || 0);
      productsTotal += product.total;
    });
    
    const vatAmount = productsTotal * (contract.vatRate || 0 / 100);
    const grandTotal = productsTotal + vatAmount;
    
    return {
      productsTotal,
      vatAmount,
      grandTotal
    };
  },

  // Validate contract data
  validateContract: (contract: ITelevisionContractCreateRequest): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (!contract.televisionContractNo?.trim()) {
      errors.push('Contract number is required');
    }

    if (!contract.contractDate) {
      errors.push('Contract date is required');
    }

    if (!contract.contractStartDate) {
      errors.push('Start date is required');
    }

    if (!contract.contractEndDate) {
      errors.push('End date is required');
    }

    if (!contract.contractedClientId && !contract.contractedAgencyId) {
      errors.push('Either client or agency must be selected');
    }

    if (contract.products?.length === 0) {
      errors.push('At least one product is required');
    }

    contract.products?.forEach((product, index) => {
      if (!product.contractProductName?.trim()) {
        errors.push(`Product ${index + 1}: Name is required`);
      }

      if (product.productItems?.length === 0) {
        errors.push(`Product ${index + 1}: At least one item is required`);
      }

      product.productItems?.forEach((item, itemIndex) => {
        if (!item.particularsName?.trim()) {
          errors.push(`Product ${index + 1}, Item ${itemIndex + 1}: Particulars name is required`);
        }

        if (!item.rate || item.rate <= 0) {
          errors.push(`Product ${index + 1}, Item ${itemIndex + 1}: Rate must be greater than 0`);
        }
      });
    });

    return {
      isValid: errors.length === 0,
      errors
    };
  },

  // Format contract for display
  formatContractForDisplay: (contract: ITelevisionContract) => {
    return {
      ...contract,
      contractDateFormatted: new Date(contract.contractDate).toLocaleDateString('en-BD'),
      contractStartDateFormatted: new Date(contract.contractStartDate).toLocaleDateString('en-BD'),
      contractEndDateFormatted: new Date(contract.contractEndDate).toLocaleDateString('en-BD'),
      totalFormatted: new Intl.NumberFormat('en-BD', {
        style: 'currency',
        currency: 'BDT'
      }).format(contract.total || 0),
      status: contract.remarks?.toLowerCase().includes('draft') ? 'Draft' : 'Active'
    };
  }
};

export default contractService;