import jwt from "jsonwebtoken";

//
const authAdmin = async (req, res, next) => {
  try {
    const { atoken } = req.headers;
    if (!atoken)
      return res.status(400).json({ error: "Not authorized login" });

    const token_decode = jwt.verify(atoken, process.env.JWT_SECRET);

    if(token_decode !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD)
      return res.status(400).json({ error: "Not authorized login" });


  } catch (err) {
    console.log(err);
  }
};

export default authAdmin;
