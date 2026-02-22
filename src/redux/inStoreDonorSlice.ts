import { createSlice } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";

export interface InStoreDonorState {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  categories: string[];
  itemDetails: string;
  estimatedValue: string;
}

const initialState: InStoreDonorState = {
  name: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  zipCode: "",
  categories: [],
  itemDetails: "",
  estimatedValue: "",
};

export const inStoreDonorSlice = createSlice({
  name: "inStoreDonor",
  initialState,
  reducers: {
    updateInStoreName: (state, action) => {
      state.name = action.payload;
    },
    updateInStoreEmail: (state, action) => {
      state.email = action.payload;
    },
    updateInStorePhone: (state, action) => {
      state.phone = action.payload;
    },
    updateInStoreAddress: (state, action) => {
      state.address = action.payload;
    },
    updateInStoreCity: (state, action) => {
      state.city = action.payload;
    },
    updateInStoreState: (state, action) => {
      state.state = action.payload;
    },
    updateInStoreZipCode: (state, action) => {
      state.zipCode = action.payload;
    },
    updateInStoreCategories: (state, action) => {
      state.categories = action.payload;
    },
    updateInStoreItemDetails: (state, action) => {
      state.itemDetails = action.payload;
    },
    updateInStoreEstimatedValue: (state, action) => {
      state.estimatedValue = action.payload;
    },
    clearInStoreAll: () => {
      storage.removeItem("persist:inStoreDonor");
      return initialState;
    },
  },
});

export const {
  updateInStoreName,
  updateInStoreEmail,
  updateInStorePhone,
  updateInStoreAddress,
  updateInStoreCity,
  updateInStoreState,
  updateInStoreZipCode,
  updateInStoreCategories,
  updateInStoreItemDetails,
  updateInStoreEstimatedValue,
  clearInStoreAll,
} = inStoreDonorSlice.actions;

export default inStoreDonorSlice.reducer;
