import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import SelectedItem from "../entity/SelectedItem";
import {RootState} from "./store";

interface SelectedItemState {
    value: SelectedItem
}

const initialState : SelectedItemState = {
    value: new SelectedItem()
};

const selectedItemSlice = createSlice({
    name: 'selectedItem',
    initialState,
    reducers: {
        updateSelectedItem: (state, action: PayloadAction<SelectedItem>) => {
            state.value = action.payload;
        }
    }
});

export default selectedItemSlice;
export const {updateSelectedItem} = selectedItemSlice.actions;
export const selectSelectedItem = (state: RootState) => state.selectedItem.value;