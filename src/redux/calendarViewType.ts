import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "./store";
import {CalendarViewType} from "../base/enum"

interface CalendarViewTypeInterface {
    value: CalendarViewType
}

const initialState: CalendarViewTypeInterface = {
    value: CalendarViewType.MONTH
};

const calendarViewTypeSlice = createSlice({
    name: 'calendarViewTypeSlice',
    initialState,
    reducers: {
        updateCalendarViewType: (state, action: PayloadAction<CalendarViewType>) => {
            state.value = action.payload;
        }
    }
});

export default calendarViewTypeSlice;
export const {updateCalendarViewType} = calendarViewTypeSlice.actions;
export const selectCalendarViewType = (state: RootState) => state.calendarViewType.value;