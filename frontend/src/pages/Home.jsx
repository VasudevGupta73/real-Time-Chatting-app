import React from 'react'
import { useSelector } from 'react-redux'
import SideBar from '../components/SideBar';
import MessageArea from '../components/MessageArea';
const Home = () => {
  const selectedUser = useSelector(state => state.user.selectedUser);
  return (
    <div className="w-full h-screen flex flex-col lg:flex-row overflow-hidden min-h-screen min-w-0 justify-center items-center">
      <div className={`${selectedUser ? 'hidden lg:flex' : 'flex'} lg:w-[35%] lg:max-w-[420px] w-full h-full min-w-0 overflow-hidden`}>
        <SideBar />
      </div>
      <div className={`${selectedUser ? 'flex' : 'hidden'} lg:flex lg:w-[65%] w-full h-full min-w-0`}>
        <MessageArea />
      </div>
    </div>
  )
}

export default Home