import jwt from "jsonwebtoken";

/*
	MIDDLEWARE
	- checks if the token is valid through jwt.verify()
		that compares the token with the secret stored in the .env file
	- if valid, continue
*/
function checkToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access denied" });
  }

  try {
    const secret = process.env.JWT_SECRET;
    jwt.verify(token, secret);

    next();
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "Invalid token" });
  }
}

export default checkToken;
