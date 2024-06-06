export interface RegisterRequest {
    firstName: string;
    lastName: string;
    email: string;
    mobile: string;
    userType: string;
    password: string;
}

export interface LoginRequest {
    email: string;
    password: string;
    userType: string;
}

export interface LogoutRequest {
    userId: string;
}

export interface Errors {
    errors: { [key: string]: string };
}

export interface LoginResponse {
    accessToken: string;
}

export interface SignupResponse {
    endpoint: string;
    message: string;
}

export class User{
    id: string;
    firstName: string;
    lastName: string;
    name: string;
    email: string;
    mobile: string;
    userType: string;
}

export class Role{
    name: string;
}

export interface PasswordResetInitiate {
    email: string;
    action: string;
}

export interface PasswordResetSubmit {
    email: string;
    otp: string;
    password: string;
}

export interface CustomerPreferences{
    customerId: string;
    communicationViaEmail: Boolean;
    communicationViaMobile: Boolean;
    cuisines: string[];
    chefs: string[];
    foods: string[];
}

export interface PersonalDetails {
    customerId: string;
    firstName: string;
    lastName: string;
    mobile: string;
}




