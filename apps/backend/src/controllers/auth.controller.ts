import type { Request, Response } from "express";
import { prisma } from "@orch8/db";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs"
import "dotenv/config"


const JWT_SECRET = process.env.JWT_SECRET || "vasanth"

export const signup = async (req: Request, res: Response) => {
    try {
        const { username, password, email } = req.body;

        const exists = await prisma.user.findUnique({
            where: { email }
        })

        if (exists) {
            return res.status(404).json({ msg: "User already exists" })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword
            }
        })

        const token = jwt.sign({ id: user.id, email: user.email}, JWT_SECRET);

        res.cookie("jwt", token, {
            httpOnly: true,
            secure: false,
            maxAge: 7*24*60*60*1000
        })

        res.json({
            msg: "User created Successfully",
            user: {id: user.id, email: user.email},
            token: token
        })
    } catch (error) {
        res.status(500).json({ msg: "error in signingUp"})
    }
}


export const signin = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ msg: "email and password requried"})
        }

        const user = await prisma.user.findUnique({
            where: { email }
        })

        if (!user) {
            return res.status(400).json({ msg: "user not found"})
        }

        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            return res.status(400).json({ msg: "invalid Password"})
        }

        const token = jwt.sign({ id: user.id, email: user.email}, JWT_SECRET);

        res.cookie("jwt", token, {
            httpOnly:true,
            secure: false,
            maxAge: 7*24*60*60*1000
        })

        res.json({
            msg: "signin Sucessfull",
            user: { id: user.id, email: user.email},
            token: token
        })
    } catch (error) {
        res.status(500).json({
            msg: "error in signing in"
        })
    }
}


export const signout = async (req: Request, res: Response) => {
    res.clearCookie("jwt");
    res.json({ msg: "signout successfully"})
}


export const getMe = async (req: Request, res: Response) => {
    res.json({
        authenticated: true,
        user: req.user
    })
}