import jwt from "jsonwebtoken";
import createError from "../utils/createError.js";
import prisma from "../config/prisma.js";

export const authCheck = async (req, res, next) => {
  try {
    const headerToken = req.headers.authorization;

    if (!headerToken) {
      return res.status(401).json({ message: "No Token, Authorization" });
    }

    const token = headerToken.split(" ")[1];
    const decode = await jwt.verify(token, process.env.SECRET_KEY);
    req.user = decode;

    const user = await prisma.user.findFirst({
      where: {
        email: req.user.email,
      },
    });

    if (!user.enable) {
      createError(400, "This account not access");
    }

    next();
  } catch (error) {
    next(error);
  }
};

export const adminCheck = async (req, res, next) => {
  try {
    const { email } = req.user;

    const adminUser = await prisma.user.findFirst({
      where: {
        email: email
      }
    })
    
    if(!adminUser || adminUser.role.toLowerCase() !== 'admin') {
      createError(403, 'Access denied: Admin Only!')
    }
    
    next();
  } catch (error) {
    console.log(error);
    next(error);
  }
};
