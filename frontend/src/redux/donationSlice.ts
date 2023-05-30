import { createSlice } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web

export interface DonationState {
  personName: string,
  email: string,
  phoneNumber: string,
  name: string;
  dimensions: string;
  photos: string[];
  address: string;
  city: string;
  state: string;
  zipCode: number;
  dropoff: boolean;
  pickupTimes: Event[];
}

export interface Event {
  start: string;
  end: string;
}

const initialState: DonationState = {
  personName: "",
  email: "",
  phoneNumber: "",
  name: "",
  dimensions: "",
  photos: [],
  address: "",
  city: "",
  state: "",
  zipCode: 0,
  dropoff: true,
  pickupTimes: [],
};

// state.donation.name
export const donationSlice = createSlice({
  name: "donation",
  initialState,
  reducers: {
    updatepersonName: (state, action) => {
      state.personName = action.payload;
    },
    updateEmail: (state, action) => {
      state.email = action.payload;
    },
    updatephoneNumber: (state, action) => {
      state.phoneNumber = action.payload;
    },
    updateName: (state, action) => {
      state.name = action.payload;
    },
    updateDimensions: (state, action) => {
      state.dimensions = action.payload;
    },
    updatePhotos: (state, action) => {
      state.photos = action.payload;
    },
    updateAddress: (state, action) => {
      state.address = action.payload;
    },
    updateCity: (state, action) => {
      state.city = action.payload;
    },
    updateState: (state, action) => {
      state.state = action.payload;
    },
    updateZip: (state, action) => {
      state.zipCode = action.payload;
    },
    updateDropoff: (state, action) => {
      state.dropoff = action.payload;
    },
    updatePickupTimes: (state, action) => {
      state.pickupTimes = action.payload;
    },
    clearAll: () => {
      storage.removeItem("persist:donation");
      return initialState;
    },
  },
});

export const {
  updateName,
  updateDimensions,
  updatePhotos,
  updateAddress,
  updateCity,
  updateZip,
  updateDropoff,
  updatePickupTimes,
  clearAll,
} = donationSlice.actions;

export default donationSlice.reducer;
