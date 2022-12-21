import Post from "../models/Post.js";
import User from "../models/User.js";

//Read
export const getUser = async (req, res) => {
    try {
        
        const { id } = req.params;
        const user = await User.findById(id);
        if(user.posts){
            user?.posts.map((post) => Post.findById(post))
        } 
        delete user.password;
        res.status(200).json(user);

    } catch (error) {
        res.status(500).json({
            success:false,
            message: error.message
        });
    }
};

export const getUserFriends = async (req, res) => {
    try {
        
        const { id } = req.params;
        const user = await User.findById(id);

        const friends = await Promise.all(
            user.friends.map((friendId) => {
                const friendDetails = User.findById(friendId);
                return friendDetails;
            })
        );

        const formattedFriends = friends.map(
            ({ _id, firstName, lastName, picturePath, occupation, location }) => {
                return {
                    _id,
                    firstName,
                    lastName,
                    picturePath,
                    occupation,
                    location,
                };
            }
        )

        res.status(200).json(formattedFriends);

    } catch (error) {
        res.status(500).json({
            success:false,
            message: error.message
        });
    }
};

//Update

export const addRemoveFriend = async (req, res) => {
    try {
        const { id, friendId } = req.params;

        const user = await User.findById(id);
        const friend = await User.findById(friendId);

        if (user.friends.includes(friendId)) {
            user.friends = user.friends.filter((id) => id !== friendId);
            friend.friends = friend.friends.filter((id) => id !== id);
        } else {
            user.friends.push(friendId);
            friend.friends.push(id);
        }

        await user.save();

        await friend.save();

        const friends = await Promise.all(
          user.friends.map((friendId) => {
            const userFriend = User.findById(friendId);
            return userFriend
          })
        );

        const formattedFriends = friends.map(
          ({ _id, firstName, lastName, picturePath, occupation, location }) => {
            return {
              _id,
              firstName,
              lastName,
              picturePath,
              occupation,
              location,
            };
          }
        );

        res.status(200).json(formattedFriends);

    } catch (error) {
        res.status(500).json({
            success:false,
            message: error.message
        });
    }
};
