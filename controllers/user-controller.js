const Otp = require("otp-process");
const ResponseHandler = require('../utils/ResponseHandler');
let Response = new ResponseHandler(400);

class UserController {
    // for sending signup otp
    async sendOtp(req , res){
        Response.setResponseObject(res);
        
        // destructuring the body
        const {email , mobile} = req.body;

        // validation
        if(!email && !mobile){
            return Response.NeedError("Email or Mobile required");
        };

        // creating otp
        const otp = Otp.createOtp(4 , {data : email?email:mobile} , 1 , process.env.OTP_SECRET);

        // cheking where to send otp
        // if user requested with email
        if(email){
            // validating otp
            if(otp.error){
                return Response.NeedError(otp.error);
            };

            // sent otp to email but here i am consoling the otp
            console.log(otp.otp);
        }
        // if user requested with mobile
        else if(mobile){
            // validating otp
            if(otp.error){
                return res.json({msg:otp.error , flag : false});
            };

            // sent otp to mobile but here i am consoling the otp
            console.log(otp.otp);
        }

        // sending response
        return Response.NeedExec("Otp sent successfully", {
            hash:otp.hash,
            data:otp.data,
        });
    };

    // verify otp and create otp
    async verifyOtp(req , res){
        Response.setResponseObject(res);
        // destructuring data
        const {hash , data , otp} = req.body;

        // validating
        if(!hash || !data || !otp){
            return Response.NeedError("All fields are required");
        };

        // verifying otp
        const isVerify = Otp.verify(hash , data , otp , process.env.OTP_SECRET);

        if(isVerify.error){
            return Response.NeedError(isVerify.error);
        }

        // now user verified you can also verify one more time by the code given below
        
        if(isVerify.flag){
            console.log("Success");
        }

    }
}

module.exports = new UserController();