// filepath: /suryadev-seeds-admin/suryadev-seeds-admin/src/types/index.ts

export interface Seed {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  imageUrl: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  imageUrl: string;
  stock?: number;
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  price: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

export interface CustomerDetails {
  name: string;
  mobileNo: string;
  address: string;
  paymentMethod: 'cash' | 'card' | 'upi';
  finalDiscount?: number;
}

export interface Order {
  id: string;
  userId: string;
  seedId: string;
  quantity: number;
  orderDate: string;
  status: 'pending' | 'completed' | 'canceled';
  orderedBy?: string;
  items?: CartItem[];
  customerDetails?: CustomerDetails;
  totalAmount?: number;
  discount?: number;
  finalAmount?: number;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
}