import React, { useEffect, useState } from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import Profile from './pages/Profile'
import Home from './pages/Home'
import Files from './pages/Files'
import { setOnlineUser, setSocket, setUserData } from '../redux/userSlice'
import { serverUrl } from './main'
import { useCurrentUser } from './customHookes/CurrentUser'
import { useOtherUserData } from './customHookes/getOtherUserData';
import {io} from "socket.io-client";

function App() {
  const dispatch = useDispatch()
  const {userData,socket,onlineUser} = useSelector((state) => state.user);

  const loading = useCurrentUser();
  const otherUsersLoading = useOtherUserData();
  
  useEffect(()=>{
      if(!userData){
        setSocket(null);
        return;
      }

      const socketio = io(serverUrl.replace(/\/api\/?$/, ''),{
        query:{
          userId:userData._id,
        }
      });
      dispatch(setSocket(socketio));
      socketio.on("getOnlineUsers",(users)=>{
        dispatch(setOnlineUser(users));

      })
      socketio.on("disconnect",()=>{

      })

      return () => {
        socketio.close();
      };
  },[userData]);
  if (loading || otherUsersLoading) {
    return <div className="w-full h-screen flex items-center justify-center">
      <div className="text-xl">Loading...</div>
    </div>;
  }


  return (
    <Routes>

      <Route path='/login' element={!userData ? <Login /> : <Navigate to='/' replace />} />
      <Route path='/signup' element={!userData ? <SignUp /> : <Navigate to='/' replace />} />
      <Route path='/' element={userData ? <Home /> : <Navigate to='/login' replace />} />
      <Route path='/files' element={userData ? <Files /> : <Navigate to='/login' replace />} />
      <Route path='/profile' element={userData ? <Profile /> : <Navigate to='/login' replace />} />
    </Routes>
  )
}

export default App