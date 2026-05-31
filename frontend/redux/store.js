import { configureStore } from '@reduxjs/toolkit';
import userSlice from './userSlice';
import messageSlice from './messageSlice';
const store = configureStore({
    reducer: {
        user: userSlice,
        message:messageSlice,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['user/setSocket'],
                ignoredPaths: ['user.socket'],
            },
        }),
});

export default store;

// use dispatch is used for performing actions on the data
// use selector is used for accessing the data elments from the store