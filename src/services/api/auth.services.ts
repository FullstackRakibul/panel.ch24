import { useHttp } from "../../utils/base.Http"
import type { LoginRequest, LoginResponse, User, RegisterRequest } from "../../interface/Auth/index"

const http = useHttp()

export class AuthService {
  private http = http

  // Login user
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await this.http.post<LoginResponse>("/auth/login", credentials)
    return response.data
  }

  
  // Register user
  async register(userData: RegisterRequest): Promise<LoginResponse> {
    const response = await this.http.post<LoginResponse>("/auth/register", userData)
    return response.data
  }

  // Get current user profile
  async getProfile(): Promise<User> {
    const response = await this.http.get<User>("/auth/profile")
    return response.data
  }

  // Update user profile
  async updateProfile(userData: Partial<User>): Promise<User> {
    const response = await this.http.put<User>("/auth/profile", userData)
    return response.data
  }

  // Logout user
  async logout(): Promise<void> {
    try {
      await this.http.post("/auth/logout")
    } catch (error) {
      // Even if logout fails on server, we should clear local tokens
      console.warn("Logout request failed, but clearing local tokens:", error)
    }
  }

  // Refresh token
  async refreshToken(refreshToken: string): Promise<LoginResponse> {
    const response = await this.http.post<LoginResponse>("/auth/refresh", {
      refresh_token: refreshToken,
    })
    return response.data
  }

  // Forgot password
  async forgotPassword(email: string): Promise<{ message: string }> {
    const response = await this.http.post<{ message: string }>("/auth/forgot-password", { email })
    return response.data
  }

  // Reset password
  async resetPassword(data: {
    token: string
    email: string
    password: string
    password_confirmation: string
  }): Promise<{ message: string }> {
    const response = await this.http.post<{ message: string }>("/auth/reset-password", data)
    return response.data
  }

  // Verify email
  async verifyEmail(token: string): Promise<{ message: string }> {
    const response = await this.http.post<{ message: string }>("/auth/verify-email", { token })
    return response.data
  }

  // Resend verification email
  async resendVerification(): Promise<{ message: string }> {
    const response = await this.http.post<{ message: string }>("/auth/resend-verification")
    return response.data
  }
}

// Export singleton instance
export const authService = new AuthService()
