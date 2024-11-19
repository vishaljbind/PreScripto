import jwt from "jsonwebtoken";

// User authentication middleware
const authUser = async (req, res, next) => {
  try {
    const { utoken } = req.headers;
    if (!utoken) {
      return res.json({
        success: false,
        message: "Not Authorized, Login Again",
      });
    }

    const token_decoded = jwt.verify(utoken, process.env.JWT_SECRET);
    if (!token_decoded) {
      return res.json({
        success: false,
        message: "Session Expired, Login Again",
      });
    }
    //get id from token and pass to user controller
    req.body.userId = token_decoded.id;
    next();
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export default authUser;
