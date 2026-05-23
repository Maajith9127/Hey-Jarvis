import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
  const token = req.cookies?.token;
  console.log('Token from cookies:', token);
  

  if (!token) return res.status(401).json({ msg: "Not authenticated" });
  console.log('token:', token);
  

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    return res.status(403).json({ msg: "Token invalid", error: err.message });
  }
};
