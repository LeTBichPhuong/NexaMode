import { Product, Order, User, OrderStatus } from '../types';
import { MOCK_PRODUCTS, BRANDS } from '../constants';

const KEYS = {
  PRODUCTS: 'styleai_products',
  ORDERS: 'styleai_orders',
  USERS: 'styleai_users',
  BRANDS: 'styleai_brands',
  CURRENT_USER: 'styleai_current_user',
  DB_VERSION: 'styleai_db_version' // Khóa mới cho phiên bản
};

// Tăng phiên bản này mỗi khi bạn thay đổi cấu trúc dữ liệu hoặc dữ liệu mẫu
const CURRENT_DB_VERSION = '2.0'; 

class LocalDB {
  constructor() {
    this.init();
  }

  private init() {
    // Kiểm tra phiên bản DB
    const savedVersion = localStorage.getItem(KEYS.DB_VERSION);
    
    if (savedVersion !== CURRENT_DB_VERSION) {
      console.log(`Lệch phiên bản DB: Cục bộ ${savedVersion} so với Hiện tại ${CURRENT_DB_VERSION}. Đang đặt lại dữ liệu...`);
      // Buộc đặt lại Sản phẩm để lấy các Thương hiệu mới
      localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(MOCK_PRODUCTS));
      // Đặt lại Thương hiệu về hằng số mặc định
      localStorage.setItem(KEYS.BRANDS, JSON.stringify(BRANDS));
      localStorage.setItem(KEYS.DB_VERSION, CURRENT_DB_VERSION);
    } else {
        // Kiểm tra dự phòng nếu thiếu sản phẩm
        if (!localStorage.getItem(KEYS.PRODUCTS)) {
             localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(MOCK_PRODUCTS));
        }
        // Kiểm tra dự phòng cho thương hiệu
        if (!localStorage.getItem(KEYS.BRANDS)) {
             localStorage.setItem(KEYS.BRANDS, JSON.stringify(BRANDS));
        }
    }

    // Khởi tạo đơn hàng nếu trống
    if (!localStorage.getItem(KEYS.ORDERS)) {
      localStorage.setItem(KEYS.ORDERS, JSON.stringify([]));
    }
    // Khởi tạo người dùng nếu trống
    if (!localStorage.getItem(KEYS.USERS)) {
      localStorage.setItem(KEYS.USERS, JSON.stringify([]));
    }
  }

  // --- THƯƠNG HIỆU ---
  getBrands(): string[] {
    const data = localStorage.getItem(KEYS.BRANDS);
    return data ? JSON.parse(data) : BRANDS;
  }

  addBrand(name: string): string[] {
    const brands = this.getBrands();
    if (!brands.includes(name)) {
        const updated = [...brands, name];
        localStorage.setItem(KEYS.BRANDS, JSON.stringify(updated));
        return updated;
    }
    return brands;
  }

  deleteBrand(name: string): string[] {
    const brands = this.getBrands();
    const updated = brands.filter(b => b !== name);
    localStorage.setItem(KEYS.BRANDS, JSON.stringify(updated));
    return updated;
  }

  // --- SẢN PHẨM ---
  getProducts(): Product[] {
    const data = localStorage.getItem(KEYS.PRODUCTS);
    return data ? JSON.parse(data) : [];
  }

  addProduct(product: Product): Product {
    const products = this.getProducts();
    const newProduct = { ...product, id: Date.now() }; // Đảm bảo ID duy nhất
    const updated = [newProduct, ...products];
    localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(updated));
    return newProduct;
  }

  updateProduct(product: Product): Product {
    const products = this.getProducts();
    const updated = products.map(p => p.id === product.id ? product : p);
    localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(updated));
    return product;
  }

  deleteProduct(id: number): void {
    const products = this.getProducts();
    const updated = products.filter(p => p.id !== id);
    localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(updated));
  }

  // --- ĐƠN HÀNG ---
  getOrders(): Order[] {
    const data = localStorage.getItem(KEYS.ORDERS);
    return data ? JSON.parse(data) : [];
  }

  addOrder(order: Order): Order {
    const orders = this.getOrders();
    const updated = [order, ...orders];
    localStorage.setItem(KEYS.ORDERS, JSON.stringify(updated));
    return order;
  }

  updateOrderStatus(orderId: string, status: OrderStatus): void {
    const orders = this.getOrders();
    const updated = orders.map(o => o.id === orderId ? { ...o, status } : o);
    localStorage.setItem(KEYS.ORDERS, JSON.stringify(updated));
  }

  // --- NGƯỜI DÙNG ---
  getUsers(): User[] {
    const data = localStorage.getItem(KEYS.USERS);
    return data ? JSON.parse(data) : [];
  }

  saveUser(user: User): User {
    const users = this.getUsers();
    const existing = users.find(u => u.email === user.email);
    
    if (existing) {
        return existing;
    }

    const updated = [...users, user];
    localStorage.setItem(KEYS.USERS, JSON.stringify(updated));
    
    // Tự động đăng nhập
    localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user));
    return user;
  }

  loginUser(email: string): User | null {
      if (email === 'admin@styleai.com') {
          const adminUser: User = {
              name: 'Quản Trị Viên',
              email: 'admin@styleai.com',
              avatar: 'https://ui-avatars.com/api/?name=Admin&background=111827&color=fff'
          };
          return adminUser;
      }

      const users = this.getUsers();
      const user = users.find(u => u.email === email);
      if (user) {
          localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user));
          return user;
      }
      return null;
  }

  getCurrentUser(): User | null {
      const data = localStorage.getItem(KEYS.CURRENT_USER);
      return data ? JSON.parse(data) : null;
  }

  logoutUser(): void {
      localStorage.removeItem(KEYS.CURRENT_USER);
  }
}

export const db = new LocalDB();