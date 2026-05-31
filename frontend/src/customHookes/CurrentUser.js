import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setUserData } from "../../redux/userSlice";
import { serverUrl } from "../main";

const useCurrentUser = () => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const result = await axios.get(`${serverUrl}/user/current`, {
                    withCredentials: true
                });
                dispatch(setUserData(result.data));
            } catch (err) {
                console.error("Error fetching current user:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchCurrentUser();
    }, [dispatch]);

    return loading;
};

export { useCurrentUser };