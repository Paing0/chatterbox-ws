import Message from "../models/Message.js";

const ROOMS = ["Room-1", "Room-2"];

export const getOldMessage = async (req, res) => {
  const { roomName } = req.params;
  if (ROOMS.includes(roomName)) {
    const message = await Message.find({
      room: roomName,
    }).select("username message send_at");
    return res.status(200).json(message);
  } else {
    return res.status(404).json("Room does not exist");
  }
};
