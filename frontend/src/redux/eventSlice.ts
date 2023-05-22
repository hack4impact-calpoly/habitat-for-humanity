import { createSlice } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web

export interface EventSlice {
  itemName: string;
  donationStatus: string;
  donorId: string;
  itemId: string;
  timeSlots: TimeSlot[];
}

export interface TimeSlot {
  id: string;
  eventStart: string;
  eventEnd: string;
  timeSlotString: string;
  dayString: string;
  volunteer: string;
}

const initialState: EventSlice = {
  itemName: "",
  donationStatus: "",
  donorId: "",
  itemId: "",
  timeSlots: [],
};

// state.donation.name
export const eventSlice = createSlice({
  name: "event",
  initialState,
  reducers: {
    updateDonationStatus: (state, action) => {
      state.donationStatus = action.payload;
    },
    updateTimeSlots: (state, action) => {
      state.timeSlots = action.payload;
    },
    clearTimeSlots: (state) => {
      state.timeSlots = [];
    },
    clearAll: () => {
      storage.removeItem("persist:event");
      return initialState;
    },
  },
});

export const {
  updateDonationStatus,
  updateTimeSlots,
  clearTimeSlots,
  clearAll,
} = eventSlice.actions;

export default eventSlice.reducer;
