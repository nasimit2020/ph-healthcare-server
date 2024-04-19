import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { DoctorScheduleService } from "./doctorSchedule.service";
import { Request, Response } from "express";
import { TAuthUser } from "../../interfaces/common";
import pick from "../../../shared/pick";


const getAllFromDB = catchAsync(async (req: Request, res) => {
    const result = await DoctorScheduleService.getAllFromDB();

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "All Doctor Schedule retrieved successfully!",
        data: result
    })
});

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

const getMySchedule = catchAsync(async (req: Request & { user?: TAuthUser }, res: Response) => {
    const filters = pick(req.query, ['startDate', 'endDate', 'isBooked']);
    const options = pick(req.query, ['page', 'limit', 'sortBy', 'sortOrder']);

    const user = req.user;

    const result = await DoctorScheduleService.getMySchedule(filters, options, user as TAuthUser);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "My Schedule retrieved successfully!",
        data: result
    })
});


const deleteFromDB = catchAsync(async (req: Request & { user?: TAuthUser }, res) => {
    const user = req.user;
    const { id } = req.params;
    const result = await DoctorScheduleService.deleteFromDB(user as TAuthUser, id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "My Schedule delete from db successfully!",
        data: result
    })
});



export const DoctorScheduleController = {
    getAllFromDB,
    insertIntoDB,
    getMySchedule,
    deleteFromDB
}