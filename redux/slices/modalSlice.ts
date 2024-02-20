import { createSlice, PayloadAction } from '@reduxjs/toolkit'
type InitialState = {
  isOpen: boolean
}
const initialState = {
  isOpen: false,
} as InitialState
const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    onOpen: (state) => {
      state.isOpen = true
    },
    onClose: (state) => {
      state.isOpen = false
    },
  },
})

export const { onOpen, onClose } = modalSlice.actions
export const modalReducer = modalSlice.reducer
