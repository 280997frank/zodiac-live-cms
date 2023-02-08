export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  username: string;
  email: string;
  loginAt: string;
  userId: string;
  fullname: string;
}
