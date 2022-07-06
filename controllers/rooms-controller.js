const ResponseHandler = require("../utils/ResponseHandler");
const Response = new ResponseHandler(400);
const roomModel = require("../models/room-model");

class RoomsController {
  // create room
  async createRoom(req, res) {
    Response.reset(res);
    // destructuring data
    const { title, type } = req.body;

    // validation
    if (!title || !type) {
      return Response.NeedError("All fields are required");
    } else if (title.length < 10) {
      return Response.NeedError("Title should be greater than 20 characters");
    } else if (title.length > 200) {
      return Response.NeedError(
        "Title should be less than or equal to 200 characters"
      );
    } else if (!["open", "protected", "private"].includes(type)) {
      return Response.NeedError("Room type invalid" , 406);
    }

    // creating room
    let creatingRoom;
    try {
      creatingRoom = await roomModel({
        title,
        type,
        owner: req._id,
        speakers: [req._id],
        all_members: [req._id],
      }).save();

      if (!creatingRoom) {
        return Response.NeedError("Room creation failed");
      }
    } catch (error) {
      return Response.NeedError(error.message, 500);
    }

    Response.NeedExec("Your room has been created successfully", {
      room: creatingRoom,
    });
  }

  // get open rooms
  async getOpenRooms(req, res) {
    Response.reset(res);

    // cheking params
    const roomId = req.params.roomId;
    let rooms;
    try {
        // fetching rooms
        if(roomId){
            rooms = await roomModel
          .find({ _id: roomId })
          // populating users
          .populate("owner")
          .populate("speakers")
          .populate("all_members");
        }else{
            rooms = await roomModel.find()
            // populating users
          .populate("owner")
          .populate("speakers")
          .populate("all_members");
        }

        // validation
        if (!rooms) {
          return Response.NeedError("Sorry, we couldn't fetch the rooms");
        }

        // sending response
      } catch (error) {
        return Response.NeedError("Technical issue occured" , 500);
      }

      return Response.NeedExec("" , {
        rooms
      });
  };

  // getting user rooms
  async getUserRooms(req , res){
    Response.reset(res);

    // visibility option
    const options = req.query.visibility||"open";
    const userId = req._id;

    // validation for option
    if(typeof option ==="string"&& !["open", "protected", "private" , "all"].includes(options) || options === ""){
        return Response.NeedError("Visibility is invalid" , 406);
    }
    // fetching user data
    let rooms;
    try {
        rooms = await roomModel.find(
            // writing condition
            options==="all"?{
                owner : userId
            }:
            {
                owner:userId,
                type:{$in : [...options]}
            }
        );

        if(!rooms){
            return Response.NeedError("We couldn't find the rooms" , 404);
        }

    } catch (error) {
        return Response.NeedError();
    }

    Response.NeedExec("" , {
        rooms
    })
  };

  // update room
  async updateRoom(req , res){
    Response.reset(res);

    // destructuring data
    const {title , type} = req.body;

     // validation
     if (!title && !type) {
      return Response.NeedError("Any field required");
    } else if (title&&title.length < 10) {
      return Response.NeedError("Title should be greater than 20 characters");
    } else if (title&&title.length > 200) {
      return Response.NeedError(
        "Title should be less than or equal to 200 characters"
      );
    } else if (type&&!["open", "protected", "private"].includes(type)) {
      return Response.NeedError("Room type invalid" , 406);
    }

    // finding and updating room
    let message = "type";
    let updatedRoom;
    try{
      if(title && type){
        message = "type and title";
        updatedRoom = await roomModel.updateOne({owner:req._id , _id:req.params.roomId} , {$set:{type , title}} , {new:true});
      }else if(type){
        updatedRoom = await roomModel.updateOne({owner:req._id , _id:req.params.roomId} , {$set:{type}});
      }else{
        message = "title";
        updatedRoom = await roomModel.updateOne({owner:req._id , _id:req.params.roomId},{$set:{title}});
      };

      // returning error
      if(!updatedRoom) return Response.NeedError("Updation failed" , 500);

    }catch(error){
      return Response.NeedError();
    }

    Response.NeedExec(`Room ${message} updated`);
  }
}

module.exports = new RoomsController();
