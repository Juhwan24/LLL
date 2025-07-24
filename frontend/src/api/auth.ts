import apiClient from './axios';

// 로그인 요청 타입
export interface LoginRequest {
  email: string;
  password: string;
}

// 로그인 응답 타입
export interface LoginResponse {
    email: string;
    name: string;
    message: string;
    token: string;
}

// 개인 회원가입 요청 타입
export interface PersonalSignUpRequest {
    userName: string;
    email: string;
    password: string;
    userType: string;
}

// 기업 회원가입 요청 타입
export interface CompanySignUpRequest {
    userName: string;
    companyName: string;
    email: string;
    password: string;
    userType: string;
}

// 회원가입 요청 타입
export interface SignUpRequest {
  email: string;
  password: string;
  name?: string;
  // 다른 필드들 추가 가능
}

// 로그인 API
export const loginUser = async (credentials: LoginRequest): Promise<LoginResponse> => {
  try {
    const response = await apiClient.post<LoginResponse>('/api/users/login', credentials);
    
    // 토큰이 있다면 localStorage에 저장
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || '로그인에 실패했습니다.');
  }
};

// 개인 회원가입 API
export const signUpPersonal = async (userData: PersonalSignUpRequest): Promise<any> => {
  try {
    const response = await apiClient.post('/api/users/signup/personal', userData);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || '회원가입에 실패했습니다.');
  }
};

// 기업 회원가입 API
export const signUpCompany = async (userData: CompanySignUpRequest): Promise<any> => {
  try {
    const response = await apiClient.post('/api/users/signup/company', userData);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || '회원가입에 실패했습니다.');
  }
};

// 회원가입 API
export const signUpUser = async (userData: SignUpRequest): Promise<any> => {
  try {
    const response = await apiClient.post('/api/users/signup', userData);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || '회원가입에 실패했습니다.');
  }
};

// 로그아웃 API
export const logoutUser = () => {
  localStorage.removeItem('token');
  window.location.href = '/login';
}; 