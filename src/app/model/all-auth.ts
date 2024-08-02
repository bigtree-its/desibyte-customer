export interface RegisterRequest {
    name: string;
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
    _id: string;
    name: string;
    email: string;
    mobile: string;
    userType: string;
    businessType?: string;
    businessId?: string;
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

export class AccountActivationRequest {
    accountId: string;
    activationCode: string;
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
    name: string;
    mobile: string;
}




