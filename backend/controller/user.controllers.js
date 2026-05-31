import uploadOnCloudinary from '../config/cloudinary.js';
import User from '../models/user.model.js';
export const getCurrentUser = async (req, res) => {
    try {
        const userId = req.userId;

        // Fetch user details from the database using the userId
        const user = await User.findById(userId).select('-password'); // Exclude password
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error", error });
    }
};

export default getCurrentUser;

export const editProfile = async (req, res) => {
    try {

        let { name } = req.body;
        let image;
        if (req.file) {
            image = await uploadOnCloudinary(req.file.path);
        }

        const updateData = {};
        if (typeof name !== 'undefined') updateData.name = name;
        if (typeof image !== 'undefined') updateData.image = image;

        let user = await User.findByIdAndUpdate(req.userId, updateData, { new: true }).select('-password');
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json(user);

    } catch (error) {
        console.error("Edit profile failed:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

export const getOtherUsers = async (req, res) => {
    try {
        const userId = req.userId;
        const users = await User.find({ _id: { $ne: userId } }).select('-password');

        return res.status(200).json({
            message: "All other users",
            users
        });
    } catch (error) {
        console.error(error);
        return   res.status(500).json({ message: "Internal server error", error });
    }
};  
export const search=async(req,res)=>{
    try{
        const query = req.query.search;
        if(!query) return res.status(400).json({message:"Please provide a search query"});

        let users=await User.find({
            _id: { $ne: req.userId },
            $or:[
                {name:{$regex:query,$options:"i"}},
                {userName:{$regex:query,$options:"i"}}
            ]
        }).select("-password");
        return res.status(200).json({
            message: "Search results",
            users
        });
    }
    catch(error){
        return res.status(500).json({ message: "Internal server error", error });
    }
}