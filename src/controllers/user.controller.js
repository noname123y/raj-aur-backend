  import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.models.js";
import { uploadCloudinary } from "../utils/cloudinary.js";  
import { ApiResponse } from "../utils/apiResponse.js";
import jwt from "jsonwebtoken"
import { asyncHandler } from "../utils/asyncHandler.js"; 

// a method tyo create access and refresh token

const generateAccessAndRefereshTokens = async(userId) =>{
  try {
      const user = await User.findById(userId)
      const accessToken = user.generateAccessToken()
     
      const refreshToken = user.generateRefreshToken()

      user.refreshToken = refreshToken
      await user.save({ validateBeforeSave: false })

      return {accessToken, refreshToken}


  } catch (error) {
    
      throw new ApiError(500, "Something went wrong while generating referesh and access token")
  }
}


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
console.log(req.files)
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

const loginUser=asyncHandler(async(req,res)=>{
  // get the data from req body
  // username or email
  //find the user
  //password check
  // acess and refresh token
  // send cookie

  const{email,username,password}=req.body

  if(!(username || email)){
    throw new ApiError(404,"username or email is required")
  }

  const user=await User.findOne({
    $or:[{username},{email}]
  })

  if(!user){
    throw new ApiError(404,"user do not exist")
  }
     
  const ispasswordvalid= await user.isPasswordCorrect(password)

     if(!ispasswordvalid){
      throw new ApiError(401,"user password do not match")
    }

   const {accessToken,refreshToken}=await generateAccessAndRefereshTokens(user._id)

   const loggedInUser= await User.findById(user._id).
   select("-password -refreshToken")

   //cookies setup
   // only modifiablle by server side using options 
   const options={
    httpOnly:true,
    secure:true
   }
    return res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
      new ApiResponse(
          200, 
          {
              user: loggedInUser ,accessToken, refreshToken
          },
          "User logged In Successfully"
      )
  )
  })

 const logOutuser=asyncHandler(async(req,res)=>{
  console.log(req.user)
  await User.findByIdAndUpdate(
    req.user._id,{
      $unset:{
        refreshToken:1
      }
    },{
      new:true
    }
   )

   const options={
    httpOnly:true,
    secure:true
   }

   return res
   .status(200)
   
   .clearCookie("accessToken",options)
   .clearCookie("refreshToken",options)
   .json(new ApiResponse(200,{},"User logged out sucessfully"))
 }) 

 const refreshaccessToken= asyncHandler(async(req,res)=>{
       const incomingrefreshToken=req.cookies.refreshToken|| req.body

       if(!incomingrefreshToken){
        throw new ApiError(404,"Unauthorized request")
       }

       try {
        const decodedToken=jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET)
        
        const user=await User.findById(decodedToken._id)
         
        if(!user){
         throw new ApiError(401,"Invalid refresh token")
        }
 
        if(incomingrefreshToken!==user?.refreshToken){
         throw new ApiError(401,"refresh token is invalid or used")
        }
 
         const options={
           httpOnly:true,
           secure:true}
 
        const {accessToken,refreshToken}=await generateAccessAndRefereshTokens(user._id)
        
        return res.status(200)
        .cookie("accessToken",accessToken,options)
       .cookie("refreshToken",refreshToken,options)
       .json(  new ApiResponse(
         200,
         {accessToken,refreshToken},
         "access token refreshed"
 
       ))  
       } catch (error) {

        throw new ApiError(401,error?.message|| "Invalid refresh token")

        
       }
    })


export {registerUser,loginUser,logOutuser,refreshaccessToken}



