import prisma from "../config/prisma.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import createError from '../utils/createError.js'

export const register = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check Email in DB already?
    const user = await prisma.user.findFirst({
      where: {
        email: email
      }
    })
    if(user) {
      createError(400, 'Email already exist!')
    }

    // HashPassword
    const hashPassword = await bcrypt.hash(password, 10)

    // Register
    await prisma.user.create({
      data: {
        email: email,
        password: hashPassword
      }
    })

    res.send("Register Successfully!");
  } catch (error) {
    next(error)
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check email
    const user = await prisma.user.findFirst({
      where: {
        email: email
      }
    })
    if(!user || !user.enable) {
      createError(400, 'User Not found or not Enabled!')
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password)
    if(!isMatch) {
      createError(400, 'Password Invalid!')
    }

    // Create payload
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role
    }

    // Generate token
    await jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '1d'}, (err, token) => {
      if(err) {
        createError(500, 'Server Error token')
        return res.status(500).json({ message: 'Server Error token'})
      }
      res.json({ payload, token })
    })
  } catch (error) {
    next(error);
  }
};

export const currentUser = async (req, res, next) => {
  try {
    const user = await prisma.user.findFirst({
      where: {
        email: req.user.email
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      }
    })
    res.json(user);
  } catch (error) {
    next(error);
  }
};
