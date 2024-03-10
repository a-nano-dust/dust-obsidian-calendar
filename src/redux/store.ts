import {configureStore} from "@reduxjs/toolkit";
import selectedItemSlice from "./selectedItemSlice";
import showItemSlice from "./showItemSlice";
import todaySlice from "./todaySlice";

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
        showItem: showItemSlice.reducer,
        selectedItem: selectedItemSlice.reducer,
        today: todaySlice.reducer
    }
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch