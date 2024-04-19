import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { DoctorScheduleService } from "./doctorSchedule.service";
import { Request } from "express";
import { TAuthUser } from "../../interfaces/common";


const insertIntoDB = catchAsync(async (req: Request & { user?: TAuthUser }, res) => {
    const user = req.user;
    const result = await DoctorScheduleService.insertIntoDB(user, req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Doctor Schedule created successfully!",
        data: result
    })
});



export const DoctorScheduleController = {
    insertIntoDB,
}