export interface Product {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  imageUrl?: string | null;
  isAvailable: boolean;
  isFeatured: boolean;
  categoryId?: string | null;
  category?: { name: string } | null;
  createdAt?: Date;
  updatedAt?: Date | null;
}
