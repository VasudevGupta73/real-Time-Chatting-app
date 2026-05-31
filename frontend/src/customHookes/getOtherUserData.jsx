import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setotherUser } from "../../redux/userSlice";
import { serverUrl } from "../main";

const useOtherUserData = () => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const { userData } = useSelector((state) => state.user);

    useEffect(() => {
        const fetchOtherUsers = async () => {
            // Only fetch if a user is actually logged in
            if (!userData) {
                setLoading(false);
                return;
            }

            try {
                const result = await axios.get(`${serverUrl}/user/others`, {
                    withCredentials: true
                });

                dispatch(setotherUser(result.data));
            } catch (err) {
                console.error("Error fetching other users:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchOtherUsers();
    }, [dispatch, userData]); // Reacting to userData changes!

    return loading;
};

export { useOtherUserData };