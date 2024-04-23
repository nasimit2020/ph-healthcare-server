import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { Request, Response } from "express";
import { TAuthUser } from "../../interfaces/common";
import { ReviewService } from "./review.service";

const insertIntoDB = catchAsync(async (req: Request & { user?: TAuthUser }, res: Response) => {
    const user = req.user;
    const result = await ReviewService.insertIntoDB(user as TAuthUser, req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Review Create successfully!",
        data: result
    })
});



export const ReviewController = {
    insertIntoDB
}
