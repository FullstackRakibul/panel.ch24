import type { IAgency, ICreateAgency, IUpdateAgency } from '@/interface/agency/agencies.interface';
import { channelApiHttpJson, useHttp } from '@/utils/base.Http';



export const agencyService = {
  getAllAgencies: async(): Promise<IAgency[]> =>{
    const response = await channelApiHttpJson().get<{ data: IAgency[] }>('/agencies');
    return response.data.data;
  },



  getAgencyById: async(guid: string): Promise<IAgency> => {
    const response = await useHttp().get<IAgency>(`/agencies/${guid}`);
    return response.data;
  },

  createAgency: async(agencyData: ICreateAgency): Promise<IAgency> => {
    const response = await useHttp().post<IAgency>('/agencies', agencyData);
    return response.data;
  },

  updateAgency: async(guid: string, agencyData: IUpdateAgency): Promise<IAgency> => {
    const response = await useHttp().put<IAgency>(`/agencies/${guid}`, agencyData);
    return response.data;
  },

  deleteAgency: async(guid: string): Promise<void> => {
    await useHttp().delete(`/agencies/${guid}`);
  }
};