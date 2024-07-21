export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
  [key: string]: any;
}

export interface User {
  _id: string;
  email: string;
  password: string;
  emailVerified?: boolean;
  [key: string]: any;
}

export interface VerifyUserEmailInput {
  token: string;
}

export interface AuthenticateUserInput {
  email: string;
  password: string;
}
