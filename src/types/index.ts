export interface Product {
  id?: string;
  product_id?: string;
  name?: string;
  product_name?: string;
  price: number;
  image_url?: string;
  image?: string;
  description?: string;
  short_description?: string;
  details?: string;
  requirements?: string;
  version?: string;
  platform?: string;
  features?: string[];
  supported_platforms?: string;
  supported_launchers?: string;
  recommendations?: string;
  product_version?: string;
  has_spoofer?: boolean;
  language?: string;
  stock_quantity?: number;
  is_active?: boolean;
  category?: string;
  price_one_week?: number;
  price_one_month?: number;
  price_three_months?: number;
  price_lifetime?: number;
  created_at?: string;
  updated_at?: string;
}

export interface CartProduct extends Product {
  keyType: string;
  keyPrice: number;
}

export interface CartItem {
  id: string;
  product: CartProduct;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
}

export interface User {
  id: number;
  username: string;
  email: string;
  role: 'user' | 'admin' | 'dev';
  profile_pic?: string;
  display_name?: string;
  is_admin?: boolean;
  created_at?: string;
  last_login?: string;
  is_active?: boolean;
}