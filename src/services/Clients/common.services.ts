import type { IClient, IClientCreateRequest, IClientType } from "@/interface/clients/clients.interface";
import { useHttp } from "@/utils/base.Http"

// services/client.service.ts

export const clientService = {
  // Get all clients with full details
  getAllClientsInfo: async (): Promise<IClient[]> => {
    const response = await useHttp().get("/clients");
    return response.data;
  },

  // Get client by ID
  getClientById: async (clientId: string): Promise<IClient> => {
    const response = await useHttp().get(`/clients/${clientId}`);
    return response.data;
  },

  // Create new client
  createClient: async (clientData: IClientCreateRequest): Promise<{ message: string; clientId: string }> => {
    const response = await useHttp().post("/clients", clientData);
    return response.data;
  },

  // Update client
  updateClient: async (clientId: string, clientData: IClientCreateRequest): Promise<{ message: string }> => {
    const response = await useHttp().put(`/clients/${clientId}`, clientData);
    return response.data;
  },

  // Delete client
  deleteClient: async (clientId: string): Promise<{ message: string }> => {
    const response = await useHttp().delete(`/clients/${clientId}`);
    return response.data;
  },

  // Get client types
  getClientTypes: async (): Promise<IClientType[]> => {
    const response = await useHttp().get("/clients/clientTypes");
    return response.data;
  },

  // Get clients by status
  getClientsByStatus: async (statusName: string): Promise<IClient[]> => {
    const response = await useHttp().get(`/clients/status/${statusName}`);
    return response.data;
  }
};