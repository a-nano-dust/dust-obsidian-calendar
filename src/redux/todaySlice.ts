import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "./store";
import {DateTime} from "luxon";

interface TodayState {
    value: DateTime
}

const initialState : TodayState = {
    value: DateTime.now()
};

const todaySlice = createSlice({
    name: 'today',
    initialState,
    reducers: {
        updateToday: (state, action: PayloadAction<DateTime>) => {
            state.value = action.payload;
        }
    }
});

export default todaySlice;
export const {updateToday} = todaySlice.actions;
export const selectToday = (state: RootState) => state.today.value;