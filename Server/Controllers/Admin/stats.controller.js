import User from "../../models/user.model"


const GetAdminStats = async (req, res) => {
    try {
        const users = await User.find();
        if (!user || user.length === 0 ) {
            return res.status(400).json({ message: "No users found" });
        }

        const usercount = users.length;

        return res.status(200).json({
            message: "stats fetched success fully",
            totalusers : usercount,
        });

    } catch (err) {
        return res.status(500).json({ message: "server error" });
    }
}


module.exports({
    GetAdminStats
})