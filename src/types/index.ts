// filepath: /suryadev-seeds-admin/suryadev-seeds-admin/src/types/index.ts

export interface Seed {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  imageUrl: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

export interface Order {
  id: string;
  userId: string;
  seedId: string;
  quantity: number;
  orderDate: string;
  status: 'pending' | 'completed' | 'canceled';
}

export interface Category {
  id: string;
  name: string;
  description?: string;
}