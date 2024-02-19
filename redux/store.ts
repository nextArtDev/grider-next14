import { configureStore } from '@reduxjs/toolkit'
import { cardReducer } from './slices/cardSlice'
import { modalReducer } from './slices/modalSlice'
import { useSelector, TypedUseSelectorHook } from 'react-redux'
// import localStorageMiddleware from './slices/localStorageMiddleware'
// import ratingsReducer from './slices/ratingsSlice'
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
}

const persistedReducer = persistReducer(persistConfig, cardReducer)
export const store = configureStore({
  reducer: {
    cardReducer: persistedReducer,
    modalReducer,
    // ratings: ratingsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  // middleware: (getDefaultMiddleware) => [
  //   ...getDefaultMiddleware(),
  //   localStorageMiddleware,
  // ],
})

export let persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

//modifying useSelector
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
