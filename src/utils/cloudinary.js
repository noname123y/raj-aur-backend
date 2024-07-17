import {v2 as cloudinary} from "cloudinary"
import fs from 'fs'


    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,

        api_key: process.env.CLOUDUINARY_API_KEY, 
        api_secret: process.env.CLOUDUINARY_API_SECRET // Click 'View Credentials' below to copy your API secret
    });
    
   const uploadCloudinary=async(localFilePath)=>{
    try{
        if(!localFilePath){
            return null;
        }
        //uploading file on cloudinary
         const response=await cloudinary.uploader.upload(localFilePath,
            {
                resource_type:"auto"
            }
        )
        //cloud has been uploaded sucessfully
        console.log("file has been uploaded sucessfully",response.url)
       return response;
    }
    catch(error){
        fs.unlinlSync(localFilePath)
        // remove the locally saved temporary file as the upload operation got failed
        return null
    }
   }

   export {uploadCloudinary}