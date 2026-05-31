import axios from 'axios';
import { useDispatch } from 'react-redux';
import { clearUserData, clearotherUser } from '../../redux/userSlice';
import { serverUrl } from '../main';

const useLogout = () => {
    const dispatch = useDispatch();

    const handleLogout = async () => {
        try {
            await axios.post(`${serverUrl}/auth/logout`, {}, { withCredentials: true });
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            dispatch(clearUserData());
            dispatch(clearotherUser());
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return handleLogout;
};

export default useLogout;
