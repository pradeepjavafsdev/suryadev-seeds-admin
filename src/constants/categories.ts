export interface Category {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
}

export const categories: Category[] = [
  {
    id: '1',
    name: 'Vegetable Seeds',
    description: 'High-quality vegetable seeds for farming',
  },
  {
    id: '2',
    name: 'Fruit Seeds',
    description: 'Premium fruit seeds for orchards',
  },
  {
    id: '3',
    name: 'Flower Seeds',
    description: 'Beautiful flower seeds for gardens',
  }
];