import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Cart, CartItem, Service, TimeSlot } from '../../types';

interface CartState {
  cart: Cart;
  isLoading: boolean;
  error: string | null;
}

const initialState: CartState = {
  cart: {
    items: [],
    totalAmount: 0,
    discountAmount: 0,
    finalAmount: 0,
  },
  isLoading: false,
  error: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<{
      service: Service;
      scheduledDate: Date;
      timeSlot: TimeSlot;
      specialInstructions?: string;
    }>) => {
      const { service, scheduledDate, timeSlot, specialInstructions } = action.payload;
      
      // Check if service already exists in cart
      const existingItemIndex = state.cart.items.findIndex(
        item => item.serviceId === service.id
      );

      if (existingItemIndex >= 0) {
        // Update existing item
        state.cart.items[existingItemIndex].quantity += 1;
        state.cart.items[existingItemIndex].scheduledDate = scheduledDate;
        state.cart.items[existingItemIndex].timeSlot = timeSlot;
        state.cart.items[existingItemIndex].specialInstructions = specialInstructions;
      } else {
        // Add new item
        const newItem: CartItem = {
          serviceId: service.id,
          service,
          quantity: 1,
          scheduledDate,
          timeSlot,
          specialInstructions,
        };
        state.cart.items.push(newItem);
      }

      // Recalculate totals
      cartSlice.caseReducers.calculateTotals(state);
    },

    removeFromCart: (state, action: PayloadAction<string>) => {
      const serviceId = action.payload;
      state.cart.items = state.cart.items.filter(item => item.serviceId !== serviceId);
      cartSlice.caseReducers.calculateTotals(state);
    },

    updateCartItemQuantity: (state, action: PayloadAction<{
      serviceId: string;
      quantity: number;
    }>) => {
      const { serviceId, quantity } = action.payload;
      const itemIndex = state.cart.items.findIndex(item => item.serviceId === serviceId);
      
      if (itemIndex >= 0) {
        if (quantity <= 0) {
          state.cart.items.splice(itemIndex, 1);
        } else {
          state.cart.items[itemIndex].quantity = quantity;
        }
        cartSlice.caseReducers.calculateTotals(state);
      }
    },

    updateCartItemTimeSlot: (state, action: PayloadAction<{
      serviceId: string;
      scheduledDate: Date;
      timeSlot: TimeSlot;
    }>) => {
      const { serviceId, scheduledDate, timeSlot } = action.payload;
      const itemIndex = state.cart.items.findIndex(item => item.serviceId === serviceId);
      
      if (itemIndex >= 0) {
        state.cart.items[itemIndex].scheduledDate = scheduledDate;
        state.cart.items[itemIndex].timeSlot = timeSlot;
      }
    },

    updateCartItemInstructions: (state, action: PayloadAction<{
      serviceId: string;
      specialInstructions: string;
    }>) => {
      const { serviceId, specialInstructions } = action.payload;
      const itemIndex = state.cart.items.findIndex(item => item.serviceId === serviceId);
      
      if (itemIndex >= 0) {
        state.cart.items[itemIndex].specialInstructions = specialInstructions;
      }
    },

    applyPromoCode: (state, action: PayloadAction<string>) => {
      const promoCode = action.payload;
      state.cart.promoCode = promoCode;
      // TODO: Implement promo code validation and discount calculation
      cartSlice.caseReducers.calculateTotals(state);
    },

    removePromoCode: (state) => {
      state.cart.promoCode = undefined;
      cartSlice.caseReducers.calculateTotals(state);
    },

    clearCart: (state) => {
      state.cart = {
        items: [],
        totalAmount: 0,
        discountAmount: 0,
        finalAmount: 0,
      };
    },

    calculateTotals: (state) => {
      const totalAmount = state.cart.items.reduce((total, item) => {
        return total + (item.service.price * item.quantity);
      }, 0);

      // TODO: Implement discount calculation based on promo code
      const discountAmount = 0;

      state.cart.totalAmount = totalAmount;
      state.cart.discountAmount = discountAmount;
      state.cart.finalAmount = totalAmount - discountAmount;
    },

    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },

    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateCartItemQuantity,
  updateCartItemTimeSlot,
  updateCartItemInstructions,
  applyPromoCode,
  removePromoCode,
  clearCart,
  setError,
  clearError,
} = cartSlice.actions;

export default cartSlice.reducer;