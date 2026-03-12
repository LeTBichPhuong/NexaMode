
export type Gender = 'WOMEN' | 'MEN' | 'KIDS' | 'BABY';

export interface Product {
  id: number;
  name: string;
  brand: string; // Trường mới cho Thương hiệu/Bộ sưu tập
  price: number;
  category: string;
  gender: Gender;
  image: string;
  description: string;
  colors: string[];
  sizes: string[];
  isNew?: boolean;
  isLimited?: boolean;
}

export interface CartItem extends Product {
  cartId: string;
  selectedSize: string;
  selectedColor: string;
  quantity: number;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  shippingAddress: string;
  customerName?: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
}

export interface User {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  avatar?: string;
}

export enum ViewState {
  HOME = 'HOME', // Trang đích đơn giản (Tất cả sản phẩm, không có thanh bên)
  COLLECTION = 'COLLECTION', // Danh sách sản phẩm với thanh bên (Cụ thể theo Giới tính/Thương hiệu)
  PRODUCT_DETAIL = 'PRODUCT_DETAIL',
  CART = 'CART',
  CHECKOUT = 'CHECKOUT',
  PROFILE = 'PROFILE',
  ADMIN_LOGIN = 'ADMIN_LOGIN',
  ADMIN_DASHBOARD = 'ADMIN_DASHBOARD',
  BRAND_LIST = 'BRAND_LIST'
}