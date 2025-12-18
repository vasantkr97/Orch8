import { prisma } from "@orch8/db"
import type { Request, Response } from "express"


export const postCredentials = async (req: Request, res: Response) => {
    try {
        const userId  = req.user?.id;
        const { title, platform, data } = req.body

        if (!userId) {
            return res.status(400).json({ msg: "UserId required"});
        }

        if (!title || !platform || !data) {
            return res.status(400).json({ msg: "All credentials fields are required"});
        }

        const credentials = await prisma.credentials.create({
            data: {
                title,
                platform,
                data,
                userId
            }
        });

        return res.status(200).json({
            msg: "Credentials created successfully",
            data: credentials,
        })
    } catch (error) {
        console.log("Error creating credentials:", error);
        return res.status(500).json({ msg: "Internal server error"})
    }
}

export const getCredentialById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = req.user?.id;
        
        if (!userId) {
            return res.status(400).json({ msg: "User not authenticated"})
        }

        if (!id) {
            return res.status(400).json({ msg: "Credential Id required"})
        }

        const credentialById = await prisma.credentials.findFirst({
            where: {
                id,
                userId
            }
        })

        return res.status(200).json({
            success: true,
            credentialById
        })
    } catch (error) {
        console.log("Error fetching credentials by id:", error);
        return res.status(500).json({ msg: "Internal server error"})
    }
}

export const getCredentials = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return res.status(400).json({ msg: "User not found."})
        }

        const credentials = await prisma.credentials.findMany({
            where: {
                userId
            },
            select: {
                id: true,
                title: true,
                platform: true,
                createdAt: true,
                updatedAt: true
            }
        })

        return res.status(200).json({
            success: true,
            credentials
        })
    } catch (error) {
        console.error("No credentials found!", error);
        res.status(500).json({ msg: "Internal server Error"});
    }
}

export const updateCredentials =  async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        const { id } = req.params;
        const { title, platform, data } = req.body;

        if (!userId) {
            return res.status(400).json({ msg: "User not authenticated"});
        }

        if (!id) {
            return res.status(400).json({ msg: "Credentials Id is required"})
        }

        const existing = await prisma.credentials.findFirst({
            where: {
                id: id,
                userId
            }
        })

        if (!existing) {
            return res.status(404).json({ msg: "credentials not found or not owned by user"})
        }


        const updated = await prisma.credentials.update({
            where: {
                id
            },
            data: {
                title: title ?? existing.title,
                platform: platform ?? existing.platform,
                data: data ?? existing.data
            }
        })

        res.status(200).json({
            msg: "Updated successfully",
            credentials: updated
        })
    } catch (error) {
        console.error("Error Updating")
    }
}


export const deleteCredentials = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        const { id } = req.params;

        if (!userId) {
            return res.status(400).json({ msg: "credentials ID is required"})
        }

        if (!id) {
            return res.status(400).json({ msg:  "Credentials Id is Requried"})
        }

        const existing = await prisma.credentials.findFirst({
            where: {
                id,
                userId
            }
        })

        if (!existing) {
            return res.status(404).json({
                msg: "Credentials not found or not owned by user"
            })
        }

        const credentials = await prisma.credentials.delete({
            where: {
                id,
                userId
            }
        })

        return res.status(200).json({
            msg: "Credentials deleted successfully",
            credentials
        })
    } catch (error) {
        console.error("Error deleting credentials:", error);
        return res.status(500).json({ msg: "Internal server error"})
    }
}
