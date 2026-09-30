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
  name: string;
  isPrimeMember: boolean;
  id?: string;
  email?: string;
  isLoggedIn?: boolean;
  selectedAddress?: DeliveryAddress;
  savedAddresses?: DeliveryAddress[];
}
