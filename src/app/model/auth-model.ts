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

export interface ApiResponse {
    endpoint: string;
    message: string;
}

export class Supplier {
    _id: string;
    name: string;
    email: string;
    mobile: string;
    address: Address;
}

export class Customer {
    _id: string;
    name: string;
    email: string;
    mobile: string;
    address: Address;
}

export class Address {
    addressLine1: string;
    addressLine2: string;
    city: string;
    postcode: string;
    country: string;
    latitude: string;
    longitude: string;
}



