import { configureStore } from "@reduxjs/toolkit"
import userSlice from "./userSlice"
import mapSlice from "./mapSlice"
const store = configureStore({
    reducer: {
        user:userSlice,
        map:mapSlice,
    }
})

export default store