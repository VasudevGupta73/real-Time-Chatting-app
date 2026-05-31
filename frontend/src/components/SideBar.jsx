import React, { useState } from "react";
import dp from "../assets/dp.jpg";
import { useSelector, useDispatch } from "react-redux";
import { IoIosSearch, IoMdClose, IoMdLogOut } from "react-icons/io";
import useLogout from "../customHookes/useLogout";
import { useNavigate } from "react-router-dom";
import { setSearchData, clearSearchData, setSelectedUser } from "../../redux/userSlice";
import { serverUrl } from "../main";
import { useEffect } from "react";
import axios from "axios"

const SideBar = () => {
  const { userData, otherUsers, selectedUser, onlineUser, searchData } = useSelector(
    (state) => state.user
  );

  const handleLogout = useLogout();
  const [search, setSearch] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [input,setSearchinput]=useState("");
  const handleSearch = async () => {
    try {
        const res = await axios.get(`${serverUrl}/user/search?search=${input}`);
        dispatch(setSearchData(res.data.users));
        console.log(res.data.users);
    } catch (error) {
        console.error("Search failed", error);
    }
}
useEffect(()=>{
  if(input)
    handleSearch();
  else
    dispatch(clearSearchData());
},[input])

  const handleSearchSelect = (user) => {
    dispatch(setSelectedUser(user));
    dispatch(clearSearchData());
    setSearch(false);
    setSearchinput("");
  };


  return (
    <div
      className={`w-full h-screen bg-[#f8fafc] border-r border-gray-100 relative flex flex-col z-10 ${
        selectedUser ? "hidden lg:flex" : "flex"
      }`}
    >
      {/* Header */}
      <div className="w-full h-[230px] shrink-0 bg-gradient-to-br from-[#00c6ff] to-[#0072ff] shadow-blue-500/20 shadow-2xl flex flex-col rounded-b-[40px] px-[30px] relative z-20">
        <h1 className="text-white font-extrabold text-[28px] pt-[30px] tracking-wide drop-shadow-sm">
          Chatters
        </h1>

        <div className="flex justify-between w-full items-center mt-[25px]">
          <div className="flex items-center gap-4">
            <div className="relative cursor-pointer" onClick={() => navigate("/profile")}>
              <div className="w-[60px] h-[60px] rounded-full bg-white/20 p-[3px] shadow-inner backdrop-blur-md">
                <img
                  src={userData?.image || dp}
                  alt="profile"
                  className="w-full h-full rounded-full object-cover border-2 border-white"
                />
              </div>
              <div className="absolute bottom-1 right-1 w-3.5 h-3.5 bg-green-400 border-2 border-white rounded-full" />
            </div>

            <div className="flex flex-col">
              <span className="text-white/80 text-[12px] font-semibold tracking-wider uppercase">
                Welcome back
              </span>
              <h1 className="text-white font-bold text-[22px] leading-tight drop-shadow-md">
                {userData?.name || "User"}
              </h1>
            </div>
          </div>

          <button
            onClick={() => {
              const next = !search;
              setSearch(next);
              if (!next) {
                setSearchinput("");
                dispatch(clearSearchData());
              }
            }}
            className={`flex justify-center items-center w-[48px] h-[48px] rounded-full backdrop-blur-md transition-all duration-300 shadow-lg cursor-pointer ${
              search
                ? "bg-white text-[#0072ff] rotate-90"
                : "bg-white/20 hover:bg-white/30 text-white hover:scale-105"
            }`}
          >
            {search ? <IoMdClose size={24} /> : <IoIosSearch size={24} />}
          </button>
        </div>

        {/* Search Bar */}
        <div
          className={`absolute -bottom-[26px] left-1/2 -translate-x-1/2 w-[85%] transition-all duration-500 ease-out ${
            search
              ? "opacity-100 translate-y-0 scale-100 pointer-events-auto"
              : "opacity-0 -translate-y-6 scale-95 pointer-events-none"
          }`}
        >
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search for friends or messages..."
              className="w-full py-4 pl-6 pr-14 rounded-full bg-white shadow-xl shadow-blue-900/10 focus:outline-none focus:ring-[3px] focus:ring-[#00c6ff]/40 text-gray-700 font-medium placeholder-gray-400 transition-all border border-gray-100"
              onChange={(e)=>setSearchinput(e.target.value)}
              value={input}
            />

            <button className="absolute right-2 top-1/2 -translate-y-1/2 w-[42px] h-[42px] bg-gradient-to-r from-[#00c6ff] to-[#0072ff] hover:shadow-lg hover:scale-105 rounded-full flex items-center justify-center transition-all duration-300">
              <IoIosSearch className="text-white" size={22} />
            </button>
          </div>

          {/* Search Results Dropdown */}
          {searchData && searchData.length > 0 && input && (
            <div className="absolute top-[62px] left-0 w-full bg-white rounded-2xl shadow-2xl shadow-blue-900/15 border border-gray-100 overflow-hidden z-50 animate-in">
              <div className="max-h-[240px] overflow-y-auto
                [&::-webkit-scrollbar]:w-1.5
                [&::-webkit-scrollbar-track]:bg-transparent
                [&::-webkit-scrollbar-thumb]:bg-gray-200
                [&::-webkit-scrollbar-thumb]:rounded-full">
                {searchData.map((user) => (
                  <div
                    key={user._id}
                    onClick={() => handleSearchSelect(user)}
                    className="flex items-center gap-3 px-5 py-3 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 cursor-pointer transition-all duration-200 border-b border-gray-50 last:border-b-0 group"
                  >
                    <div className="relative shrink-0">
                      <img
                        src={user.image || dp}
                        alt={user.name}
                        className="w-[42px] h-[42px] rounded-full object-cover border-2 border-gray-100 group-hover:border-blue-300 transition-colors"
                      />
                      {onlineUser?.includes(user._id) && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                      )}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <h3 className="text-gray-800 font-semibold text-[14px] truncate group-hover:text-blue-700 transition-colors">
                        {user.name || "Unknown User"}
                      </h3>
                      {user.userName && (
                        <span className="text-gray-400 text-[12px] truncate">@{user.userName}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {searchData && searchData.length === 0 && input && (
            <div className="absolute top-[62px] left-0 w-full bg-white rounded-2xl shadow-2xl shadow-blue-900/15 border border-gray-100 z-50 px-5 py-4 text-center">
              <p className="text-gray-400 text-sm">No users found</p>
            </div>
          )}
        </div>
      </div>

      {/* Users List */}
      <div
        className="flex-1 min-h-0 overflow-y-auto px-[20px] pt-[45px] pb-6 space-y-2 z-10
        [&::-webkit-scrollbar]:w-1.5
        [&::-webkit-scrollbar-track]:bg-transparent
        [&::-webkit-scrollbar-thumb]:bg-gray-200
        [&::-webkit-scrollbar-thumb]:rounded-full
        hover:[&::-webkit-scrollbar-thumb]:bg-gray-300"
      >
        <h2 className="text-gray-500 font-semibold text-sm mb-4 px-2 uppercase tracking-wide">
          Recent Chats
        </h2>

        {otherUsers?.users?.length > 0 ? (
          otherUsers.users.map((user) => (
            <div
              key={user._id}
              onClick={() => dispatch(setSelectedUser(user))}
              className="flex items-center gap-4 p-3.5 rounded-[20px] bg-transparent hover:bg-white hover:shadow-sm cursor-pointer transition-all duration-200 border border-transparent hover:border-gray-100 group"
            >
              <div className="relative shrink-0">
                <img
                  src={user.image || dp}
                  alt={user.name}
                  className="w-[52px] h-[52px] rounded-full object-cover border border-gray-100 group-hover:border-blue-200 transition-colors"
                />
                {onlineUser?.includes(user._id) && (
                  <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full" />
                )}
              </div>

              <div className="flex flex-col flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1">
                  <h2 className="text-gray-800 font-bold text-[15px] truncate">
                    {user.name || "Unknown User"}
                  </h2>
                  <span className="text-gray-400 text-[11px] font-medium">
                    2m ago
                  </span>
                </div>

                <p className="text-gray-500 text-[13px] truncate group-hover:text-gray-700 transition-colors">
                  Hey there! Let&apos;s chat on Chatters.
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-40 text-gray-400">
            <p>No other users found.</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="shrink-0 p-4 border-t border-gray-200/50 bg-[#f8fafc] z-10">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 text-gray-500 hover:text-red-500 transition-all duration-300 font-semibold p-2.5 rounded-[15px] hover:bg-red-50 w-full group"
        >
          <div className="p-2 bg-gray-200/50 rounded-full group-hover:bg-red-100 transition-colors">
            <IoMdLogOut size={22} className="translate-x-0.5" />
          </div>
          <span>Log Out</span>
        </button>
      </div>
    </div>
  );
};

export default SideBar;