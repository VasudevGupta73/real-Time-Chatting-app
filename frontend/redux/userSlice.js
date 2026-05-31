import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
    name: 'user',
    initialState: {
        userData: null,
        otherUsers:null,
        selectedUser:null,
        socket:null,
        onlineUser:null,
        searchData:null,
    },
    reducers: {
        setUserData: (state, action) => {
            state.userData = action.payload;
        },
        clearUserData: (state) => {
            state.userData = null;
        },

        setotherUser:(state,action)=>{
            state.otherUsers = action.payload;
        },
        clearotherUser:(state)=>{
            state.otherUsers = null;
        },
        setSelectedUser:(state,action)=>{
            state.selectedUser = action.payload;
        },
        clearSelectedUser:(state)=>{
            state.selectedUser = null;
        },  
        setSocket:(state,action)=>{
            state.socket = action.payload;
        },
        clearSocket:(state)=>{
            state.socket = null;
        },
        setOnlineUser:(state,action)=>{
            state.onlineUser = action.payload;
        },
        clearOnlineUser:(state)=>{
            state.onlineUser = null;
        },
        setUsers:(state,action)=>{
            state.users = action.payload;
        },
         clearUsers:(state)=>{
            state.users = null;
        },
        setSearchData:(state,action)=>{
            state.searchData = action.payload;
        },
        clearSearchData:(state)=>{
            state.searchData = null;
        },  
    },
});
export const { setUserData, clearUserData,setotherUser,clearotherUser, setSelectedUser, clearSelectedUser,setSocket,clearSocket,setOnlineUser,clearOnlineUser,setUsers,clearUsers,setSearchData,clearSearchData } = userSlice.actions;
export default userSlice.reducer;