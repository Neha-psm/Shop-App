export interface ShopItem {
  id: string;
  name: string;
  price: number;
  stock: number;
}

export interface BasketItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  discountedCount: number;
  subtotal: number;
  totalAmt : number;
  discountLabel?: string;
}


//special add for API

export interface OrderReceipt {
  orderId: string;
  total: number;
  timestamp: string;
}

export type RequestStatus = 'idle' | 'loading' | 'succeeded' | 'failed';