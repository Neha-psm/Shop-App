/*import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ShopItem, BasketItem } from '../types';*/

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
//import { createSlice } from '@reduxjs/toolkit';
import type { ShopItem, BasketItem } from '../types';
//import { shopApi } from '../api/shopApi';


interface ShopState {
  inventory: ShopItem[];
  basket: BasketItem[];
}

const initialState: ShopState = {
  inventory: [
    { id: '1', name: 'Bread',   price: 1.10,    stock: 10 },
    { id: '2', name: 'Milk',    price: 0.50,    stock: 10 },
    { id: '3', name: 'Cheese',  price: 0.90,    stock: 10 },
    { id: '4', name: 'Soup',    price: 0.60,    stock: 10 },
    { id: '5', name: 'Butter',  price: 1.20,    stock: 10 },
  ],
  basket: [],
};


// Helper: 
const applyComboDiscounts = (basket: BasketItem[]) => {
  basket.forEach((item) => {
    item.subtotal = item.quantity* item.price;
    switch(item.id)
    {
      case '1': //if added 1 Soup ('4') then discounts 1 Bread ('1') by 50% .
                const soup = basket.find((item) => item.id === '4');
                const soupQty = soup ? soup.quantity : 0;

                const discountedQty = Math.min(item.quantity, soupQty);
                const regularQty = item.quantity - discountedQty;

                const discountedTotal = discountedQty * (item.price * 0.5);
                const regularTotal = regularQty * item.price;

                item.discountedCount = discountedQty;
                item.totalAmt = Number((discountedTotal + regularTotal).toFixed(2));

               item.discountLabel =
                discountedQty > 0
                  ? `50% off applied to ${discountedQty} of ${item.quantity}`
                  : undefined;
              break;

      case '3': // Buy 1 Get 1 Free for Cheese (every 2nd cheese is free)
                const freeQty = Math.floor(item.quantity / 2);
                const paidQty = item.quantity - freeQty;

                item.discountedCount = freeQty;
                item.totalAmt  = Number((paidQty * item.price).toFixed(2));
                item.discountLabel =
                  (freeQty > 0)
                    ? `Buy 1 Get 1 applied: ${freeQty} free`
                    : `Add 1 more Cheese to get 1 free!`;
              break;

      case '5': //Get a third off on butter. 
                const discountedUnitPrice1 = item.price / 3;
                item.discountedCount = item.quantity;
                item.totalAmt  = Number((discountedUnitPrice1 * item.quantity).toFixed(2));
                item.discountLabel = '1/3 off applied to all Butter';
              break;


      default: 
        item.discountedCount = 0;
        item.totalAmt  = Number((item.price * item.quantity).toFixed(2));
    }
  });
};

const shopSlice = createSlice({
  name: 'shop',
  initialState,
  reducers: {
    addToBasket: (state, action: PayloadAction<string>) => {
      const item = state.inventory.find((i) => i.id === action.payload);
      if (item && item.stock > 0) {
        item.stock -= 1;
        const existing = state.basket.find((c) => c.id === item.id);

        if (existing) {
          existing.quantity += 1;
        } else {
          state.basket.push({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: 1,
            discountedCount: 0,
            subtotal: item.price,
            totalAmt : item.price,
          });
        }

        applyComboDiscounts(state.basket);
      }
    },
    removeFromBasket: (state, action: PayloadAction<string>) => {
      const index = state.basket.findIndex((c) => c.id === action.payload);
      if (index !== -1) {
        const basketItem = state.basket[index];
        const invItem = state.inventory.find((i) => i.id === basketItem.id);
        if (invItem) invItem.stock += 1;

        if (basketItem.quantity > 1) {
          basketItem.quantity -= 1;
        } else {
          state.basket.splice(index, 1);
        }

        applyComboDiscounts(state.basket);
      }
    },
  },
});

export const { addToBasket, removeFromBasket } = shopSlice.actions;
export default shopSlice.reducer;
