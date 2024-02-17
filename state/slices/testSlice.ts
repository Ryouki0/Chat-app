
import { createSlice } from "@reduxjs/toolkit";

interface CounterState{
    value: number,
}

const initialState: CounterState = {
    value:14,
}

const counterSlice = createSlice({
    name: 'counter',
    initialState,
    reducers: {
        increment: (state) => {
            state.value += 266;
        },
        decrement: (state) => {
            state.value = 20;
        },
    },
})

export const {increment, decrement} = counterSlice.actions;

export default counterSlice.reducer;