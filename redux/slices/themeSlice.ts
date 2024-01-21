import { createSlice, PayloadAction } from '@reduxjs/toolkit'
type InitialState = {
  theme: string
}
const initialState: InitialState = { theme: 'light' }
const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme(state) {
      state.theme = state.theme === 'dark' ? 'light' : 'dark'
    },
  },
})

export const { toggleTheme } = themeSlice.actions
export const themeReducer = themeSlice.reducer
