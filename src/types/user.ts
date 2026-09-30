export interface DeliveryAddress {
  id: string;
  fullName: string;
  street: string;
  aptSuite?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  isLoggedIn: boolean;
  isPrimeMember: boolean;
  selectedAddress?: DeliveryAddress;
  savedAddresses: DeliveryAddress[];
}
