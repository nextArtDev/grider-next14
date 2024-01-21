import { configureStore } from '@reduxjs/toolkit'
import { themeReducer } from './slices/themeSlice'
import { modalReducer } from './slices/modalSlice'
import { useSelector, TypedUseSelectorHook } from 'react-redux'
// import ratingsReducer from './slices/ratingsSlice'
export const store = configureStore({
  reducer: {
    themeReducer,
    modalReducer,
    // ratings: ratingsReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

//modifying useSelector
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
