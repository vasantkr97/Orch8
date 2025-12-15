import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { prisma } from "@orch8/db"

dotenv.config()

// Extend Express Request type to include user property
declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                email: string;
            };
        }
    }
}

const JWt_SECRET = process.env.JWT_SECRET || "vasanth";

export const auth = async (req: Request, res: Response, next: NextFunction) => {
    console.log("Requested URl:", req.url);
    try {
        const token = req.cookies.jwt;
        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const decoded = jwt.verify(token, JWt_SECRET) as {id: string, email: string };
       
        const user = await prisma.user.findUnique({
            where: { id: decoded.id }
        });

        if (!user) {
            return res.status(401).json({ 
                msg: "invalid token"
            })
        }
        
        req.user = { id: decoded.id, email: decoded.email }
        next();
        
    } catch (error) {
        res.status(403).json({ msg: "invalid token"})
    }
    
}