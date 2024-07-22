import express from "express";
import makeCreateUser from "../controllers/sign-up";
import makeVerifyEmail from "../controllers/verifyMail";
import makeLogin from "../controllers/login";
import { authenticateToken } from "../middlewares/auth";
import { renewAccessToken } from "../config/token/renewToken";
import { logoutUser } from "../controllers/logout";

const router = express.Router();
const createUser = makeCreateUser();
const verifyMail = makeVerifyEmail();
const login = makeLogin();

router.post("/register", createUser);
router.get("/verify/:token", verifyMail);
router.post("/login", login);
router.post("/renew-token", renewAccessToken);
router.get("/protected-route", authenticateToken, (req, res) => {
  res.send("This is a protected route");
});
router.post("/logout", authenticateToken, logoutUser);

export default router;
