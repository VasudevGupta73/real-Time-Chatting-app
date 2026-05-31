import React from 'react';
import dp from '../assets/dp.jpg';
import { IoMdCamera } from "react-icons/io";
import { useSelector, useDispatch } from 'react-redux';
import { IoIosArrowRoundBack } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { serverUrl } from '../main';
import { setUserData } from '../../redux/userSlice';
function Profile() {
    const userData = useSelector((state) => state.user.userData);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [name, setName] = React.useState(userData?.name || '');
    const [frontendImage, setFrontendImage] = React.useState(userData?.image || dp);
    const [backendImage, setBackendImage] = React.useState(userData?.image || dp);
    const [loading, setLoading] = React.useState(false);
    const image = React.useRef(null);

    React.useEffect(() => {
        setName(userData?.name || '');
        setFrontendImage(userData?.image || dp);
        setBackendImage(userData?.image || dp);
    }, [userData]);

    const handleImage = (e) => {
        const file = e.target.files[0];

        if (!file) return;

        setFrontendImage(URL.createObjectURL(file));
        setBackendImage(file);
    };
    const handleProfile = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("name", name);
            if (backendImage instanceof File) {
                formData.append("image", backendImage);
            }
            let result = await axios.put(`${serverUrl}/user/profile`, formData, { withCredentials: true });
            dispatch(setUserData(result.data));

            setLoading(false);
            navigate('/');
        } catch (error) {
            setLoading(false);
            console.error("Profile update failed:", error.response?.data || error.message || error);
        }
    };

    return (
        <div className="w-full h-[100vh] bg-slate-200 flex flex-col items-center justify-start">
            <div className="fixed top-[20px] left-[20px] cursor-pointer">
                <IoIosArrowRoundBack
                    className="w-[50px] h-[50px] text-gray-600"
                    onClick={() => navigate("/")}
                />
            </div>

            <div
                className="bg-[#20c7ff] p-2 rounded-full shadow-gray-400 shadow-lg relative"
                onClick={() => image.current.click()}
            >
                <div className="w-[200px] h-[200px] rounded-full overflow-hidden relative">
                    <img src={frontendImage} alt="profile" className="w-full h-full object-cover" />
                </div>

                <IoMdCamera className="absolute bottom-0 right-0 text-2xl text-gray-500 cursor-pointer" />
            </div>

            <form className="w-[95%] max-w-[100vh] flex flex-col gap-[20px] p-[30px] items-center justify-center" onSubmit={handleProfile}>
                <input
                    type="file"
                    accept="image/*"
                    ref={image}
                    hidden
                    onChange={handleImage}
                />

                <input
                    type="text"
                    placeholder="Enter your name"
                    className="text-gray-600 border border-gray-200 rounded-lg p-[10px] focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                />

                <input
                    type="text"
                    readOnly
                    className="text-gray-400 border border-gray-500 rounded-lg p-[10px] focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                    value={userData?.username || ''}
                />

                <input
                    type="email"
                    readOnly
                    className="text-gray-400 border border-gray-500 rounded-lg p-[10px] focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                    value={userData?.email || ''}
                />

                <button className="w-full bg-[#20c7ff] text-white font-bold py-[10px] rounded-lg hover:bg-[#1aa0c7] transition duration-300 mt-[20px]" disabled={loading}>
                    {loading ? "Updating..." : "Update Profile"}
                </button>
            </form>
        </div>
    );
}

export default Profile;