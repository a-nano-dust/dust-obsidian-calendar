import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "./store";
import {DateTime} from "luxon";


interface ShowItemState {
    value: DateTime
}

const initialState : ShowItemState = {
    value: DateTime.now()
};

const showItemSlice = createSlice({
    name: 'showItem',
    initialState,
    reducers: {
        updateShowItem: (state, action: PayloadAction<DateTime>) => {
            state.value = action.payload;
        }
    }
});

export default showItemSlice;
export const {updateShowItem} = showItemSlice.actions;
export const selectShowItem = (state: RootState) => state.showItem.value;