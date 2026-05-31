import { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setMessages } from "../../redux/messageSlice";
import { serverUrl } from "../main";

const useGetMessage = () => {
    const dispatch = useDispatch();
    const selectedUser = useSelector(state => state.user?.selectedUser);

    useEffect(() => {
        if (!selectedUser?._id) return;

        const fetchMessages = async () => {
            try {
                const result = await axios.get(
                    `${serverUrl}/message/${selectedUser._id}`,
                    { withCredentials: true }
                );
                if (result.data?.success) {
                    dispatch(setMessages(result.data.messages || []));
                }
            } catch (err) {

            }
        };
        fetchMessages();
    }, [selectedUser?._id, dispatch]);
};

export default useGetMessage;