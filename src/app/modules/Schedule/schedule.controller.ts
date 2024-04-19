import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { ScheduleService } from "./schedule.service";
import pick from "../../../shared/pick";
import { Request, Response } from "express";
import { TAuthUser } from "../../interfaces/common";


const insertIntoDB = catchAsync(async (req, res) => {
    const result = await ScheduleService.insertIntoDB(req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Schedule created successfully!",
        data: result
    })
});

const getAllFromDB = catchAsync(async (req: Request & { user?: TAuthUser }, res: Response) => {
    const filters = pick(req.query, ['startDate', 'endDate']);
    const options = pick(req.query, ['page', 'limit', 'sortBy', 'sortOrder']);

    const user = req.user;

    const result = await ScheduleService.getAllFromDB(filters, options, user as TAuthUser);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Get All Schedule retrieved successfully!",
        data: result
    })
});

const getByIdFromDB = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await ScheduleService.getByIdFromDB(id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Single Schedule retrieved successfully!",
        data: result
    })
});

const deleteFromDB = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await ScheduleService.deleteFromDB(id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Schedule delete successfully!",
        data: result
    })
});



export const ScheduleController = {
    insertIntoDB,
    getAllFromDB,
    getByIdFromDB,
    deleteFromDB
}