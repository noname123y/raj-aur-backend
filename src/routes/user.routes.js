import {Router} from "express";
import { loginUser, logOutuser, refreshaccessToken, registerUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/Auth.middleware.js";

const router= Router();

router.route("/register").post(
    upload.fields([
        {
            name:"avatar",
            maxCount:1
        },
        {
            name:"coverImage",
            maxCount:1
        }

    

    ]),
    registerUser)

router.route("/login").post(loginUser)

router.route("/logOut").post(verifyJWT,logOutuser)
router.route("/refreshToken").post(refreshaccessToken)


export default router;