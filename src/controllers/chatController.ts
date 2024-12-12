import { Request, Response } from "express";
import { chatService } from "../services/chatService";
import { StatusCodes } from "http-status-codes";

class ChatController {

    async initiateChat(req: Request, res: Response){
        try{
            const {userId, employeeId} = req.body;
            const result = await chatService.initiateChat(userId, employeeId);
            res.status(StatusCodes.OK).json({
                status: 'Success',
                data: result,
                message: 'Chat initiated successfully'
            })
        }catch(err){
            res.status(StatusCodes.BAD_REQUEST).json({
                message: 'Error initiating chat', err,
            })
        }
    }

    async messageSend(req: Request, res: Response){
        try{
            const {text, sender} = req.body;
            const chatId = req.params.chatId;
            const result = await chatService.messageSent(chatId, sender, text);
            console.log(result)
            res.status(StatusCodes.OK).json({
                status: 'Success',
                data: result,
                message: 'Message sent successfully'
            })
        }catch(err){
            res.status(StatusCodes.BAD_REQUEST).json({
                message: 'Error sending message', err,
            })
        }
    }


    async getChatMessages(req: Request, res: Response) {
        try {
            const chatId = req.params.chatId;
            const messages = await chatService.getChatMessages(chatId);
            res.status(StatusCodes.OK).json({
                status: 'Success',
                data: messages,
                message: ' Messages fetched successfully'
            })
        } catch (err) {
            res.status(StatusCodes.BAD_REQUEST).json({
                message: 'Error fetching Messages', err,
            })
        }
    }

    async getUserChatRooms(req: Request, res: Response) {
        try {
            const userId = req.params.id;
            const chatData = await chatService.getChatMessages(userId);
            res.status(StatusCodes.OK).json({
                status: 'Success',
                data: chatData,
                message: ' Chat details fetched successfully'
            })
        } catch (err) {
            res.status(StatusCodes.BAD_REQUEST).json({
                message: 'Error fetching Chat details', err,
            })
        }
    }
}

export const chatController = new ChatController();