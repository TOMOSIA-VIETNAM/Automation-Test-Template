/**
 * API Types for Backend Testing
 * Defines request/response interfaces for all API endpoints
 */

// ==================== Generic API Response ====================

export interface APIResponse<T = unknown> {
  code: string;
  msg?: string;
  data?: T;
}

// ==================== Admin API ====================

export interface AdminLoginRequest {
  email: string;
  password: string;
}

export interface AdminData {
  id?: number;
  email: string;
  name?: string;
  role?: string;
}

export type AdminLoginResponse = APIResponse<AdminData>;

// ==================== User API ====================

export interface UserSaveRequest {
  email: string;
  username?: string;
  fname?: string;
  lname?: string;
  phone?: string;
  age?: number | string;
  gender?: string;
  uid?: string;
}

export interface UserChargeRequest {
  email: string;
  charge: number;
}

export interface UserData {
  id?: number;
  email: string;
  username?: string;
  fname?: string;
  lname?: string;
  phone?: string;
  age?: number;
  gender?: string;
  uid?: string;
  credit?: number;
}

export interface UserPageResponse {
  list: UserData[];
  total: number;
}

// ==================== Book API ====================

export interface BookSaveRequest {
  isbn: string;
  name?: string;
  description?: string;
  category?: string;
  publish_date?: string;
  author?: string;
  publisher?: string;
  credit?: number;
  number?: number;
}

export interface BookUpdateRequest extends BookSaveRequest {
  isbn: string;
}

export interface BookData {
  isbn: string;
  name?: string;
  description?: string;
  category?: string;
  publish_date?: string;
  author?: string;
  publisher?: string;
  credit?: number;
  number?: number;
}

// ==================== Borrow API ====================

export interface BorrowSaveRequest {
  email: string;
  isbn: string;
  duration: number;
}

export interface ReturnSaveRequest {
  email: string;
  isbn: string;
  id: number;
}

export interface BorrowData {
  id: number;
  email: string;
  isbn: string;
  duration: number;
  borrow_date?: string;
  return_date?: string;
}

// ==================== Category API ====================

export interface CategorySaveRequest {
  name: string;
  remark?: string;
}

export interface CategoryData {
  id?: number;
  name: string;
  remark?: string;
}
