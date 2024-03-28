import {configureStore} from "@reduxjs/toolkit";
import selectedItemSlice from "./selectedItemSlice";
import calendarViewTypeSlice from "./calendarViewType";

export const store = configureStore({
    middleware: (getDefaultMiddleware) => {
        return getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ["showItem/updateShowItem", "selectedItem/updateSelectedItem", "today/updateToday"],
                ignoredPaths: ["showItem.value", "selectedItem.value", "today.value"]
            }
        });
    },
    reducer: {
        selectedItem: selectedItemSlice.reducer,
        calendarViewType: calendarViewTypeSlice.reducer
    }
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch