import express from "express";
import makeCreateUser from "../controllers/sign-up";
import makeVerifyEmail from "../controllers/verifyMail";

const router = express.Router();
const createUser = makeCreateUser();
const verifyMail = makeVerifyEmail;

router.post("/register", createUser);
router.get("/verify/:userId/:token", verifyMail);

export default router;
