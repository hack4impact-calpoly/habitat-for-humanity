import { createSlice } from '@reduxjs/toolkit'
import { RootState } from './store'


export interface DonationState {
    name: string;
    dimesions: string;
    address: string;
    city: string;
    zipCode: string;
    pickup: string;
  }
  
const initialState: DonationState = {
    name: "",
    dimesions: "",
    address: "",
    city: "",
    zipCode: "",
    pickup: "",
};

// state.donation.name
export const donationSlice = createSlice({
  name: 'donation',
  initialState: initialState,
  reducers: {
    setName: (state, action) => {
      state.name = action.payload
    },
    setDimensions: (state, action) => {
        state.dimesions = action.payload
    },
    setAdress: (state, action) => {
        state.address = action.payload
    },
    setCity: (state, action) => {
        state.city = action.payload
    },
    setZip: (state, action) => {
        state.zipCode = action.payload
    },
    setPickup: (state, action) => {
        state.pickup = action.payload
    },
  },
})

export const { setName, setDimensions, setAdress } = donationSlice.actions

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectItemName = (state: RootState) => state.donation.name;

export default donationSlice.reducer
