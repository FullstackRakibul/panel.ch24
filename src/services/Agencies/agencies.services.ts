import type { AgencyInterface, CreateAgencyInterface } from "@/interface/agency/agencies.interface";
import { createHttpClient } from "@/utils/base.Http";


// export const getAllAgenciesInfoService = async ()=>{

//   const apiInstance = createHttpClient();
//   return await apiInstance.get("/agency")   

// }


export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
}

// Simulated agency data
const mockAgencyData: AgencyInterface[] = [
  {
    id: "agency-1",
    AgencyName: "Creative Minds Studio",
    Tagline: "Your Vision, Our Creativity",
    Location: "Dhaka, Bangladesh",
    Slogan: "Transforming Ideas into Reality",
    Logo: "https://via.placeholder.com/150?text=CMS",
    Email: "contact@creativeminds.com",
    Phone: "+8801700000001",
    PortfolioURL: "https://creativeminds.com",
    CompanySize: 50,
    Rating: "4.8",
    ReviewCount: "120",
    Budget: "500000",
  },
  {
    id: "agency-2",
    AgencyName: "Digital Horizon Ltd",
    Tagline: "Digital Excellence Assured",
    Location: "Chittagong, Bangladesh",
    Slogan: "Innovation at Scale",
    Logo: "https://via.placeholder.com/150?text=DHL",
    Email: "hello@digitalhorizon.com",
    Phone: "+8801700000002",
    PortfolioURL: "https://digitalhorizon.com",
    CompanySize: 30,
    Rating: "4.5",
    ReviewCount: "95",
    Budget: "300000",
  },
]

export const getAllAgenciesInfoService = async (): Promise<ApiResponse<CreateAgencyInterface[]>> => {
  try {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 600))

    console.log("[v0] Agency List Data: ", mockAgencyData)

    return {
      success: true,
      // data: mockAgencyData,
    }
  } catch (error) {
    console.error("[v0] Error fetching agencies:", error)
    return {
      success: false,
      message: "Failed to fetch agencies",
    }
  }
}

export const createAgencyService = async (
  agencyData: CreateAgencyInterface,
): Promise<ApiResponse<CreateAgencyInterface>> => {
  try {
    await new Promise((resolve) => setTimeout(resolve, 500))

    const newAgency: CreateAgencyInterface = {
      ...agencyData,
      // id: `agency-${Date.now()}`,
    }

    return {
      success: true,
      data: newAgency,
    }
  } catch (error) {
    console.error("[v0] Error creating agency:", error)
    return {
      success: false,
      message: "Failed to create agency",
    }
  }
}

export const updateAgencyService = async (
  id: string,
  agencyData: CreateAgencyInterface,
): Promise<ApiResponse<CreateAgencyInterface>> => {
  try {
    await new Promise((resolve) => setTimeout(resolve, 500))

    return {
      success: true,
      // data: { ...agencyData, id },
    }
  } catch (error) {
    console.error("[v0] Error updating agency:", error)
    return {
      success: false,
      message: "Failed to update agency",
    }
  }
}

export const deleteAgencyService = async (id: string): Promise<ApiResponse<null>> => {
  try {
    await new Promise((resolve) => setTimeout(resolve, 500))

    return {
      success: true,
    }
  } catch (error) {
    console.error("[v0] Error deleting agency:", error)
    return {
      success: false,
      message: "Failed to delete agency",
    }
  }
}
