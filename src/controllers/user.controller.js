  import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.models.js";
import { uploadCloudinary } from "../utils/cloudinary.js";  
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js"; 
const registerUser= asyncHandler(async(req,res)=>{
 // get user dsetails
 // validation- not empty
 // check if user alredy exist-email or username
 // check for image,avatar
 //upload them on cloudinary,avatar
 // create user object-create entry in db
 // remove password and refresh token feild from response
 // check for user creation
 // return response


 const{fullname,email,username,password}=req.body
 console.log("email:",email);

 if([fullname,email,username,password].some((feild)=>(
  feild.trim()===""
 ))){
  throw new ApiError(400,"all feild is required")
 }
 // validating the user
const existeduser=await User.findOne({
  $or:[{ username },{ email }]
})

if(existeduser){
  throw new ApiError(409,"User already exist")
}
//extracting the local path of avatar and coverImage
const avavtarLocalPath=req.files?.avatar[0]?.path

let CoverImageLocalPath;
if(req.files && Array.isArray(req.files.coverImage)  && req.files.coverImage.length>0){
  CoverImageLocalPath=req.files.coverImage[0].path;
}
//console.log(req.files)
if(!avavtarLocalPath){
  throw new ApiError(400,"Avatar file is required")
};
//upload on cloudinary
const avatar=await uploadCloudinary(avavtarLocalPath);
const coverImage=await uploadCloudinary(CoverImageLocalPath)

//check if avatar is uploaded or not
if(!avatar){
  throw new ApiError(400,"Avatar is not loaded")
}

//entery into database
const user=await User.create({
fullname,
avatar:avatar.url,
coverImage:coverImage?.url|| "",
email,
password,
username:username.toLowerCase()


})

const createdUser= await User.findById(user._id).select(
  "-password -refreshToken"
)
if(!createdUser){
  throw new ApiError(500,"something went wrong while registring the user")
}

return res.status(201).json(
  new ApiResponse(200,createdUser,"User registered sucessfully")

)


})

export {registerUser}



  