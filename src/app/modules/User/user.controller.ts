import { TAuthUser } from './../../interfaces/common';
import { Request, Response } from "express";
import { userService } from "./user.service"
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import pick from "../../../shared/pick";
import { userFilterableFields } from "./user.constant";

const createAdmin = catchAsync(async (req: Request, res: Response) => {

    const result = await userService.createAdmin(req);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Admin Create Successfully!',
        data: result
    })
});

const createDoctor = catchAsync(async (req: Request, res: Response) => {

    const result = await userService.createDoctor(req);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Doctor Create Successfully!',
        data: result
    })
});

const createPatient = catchAsync(async (req: Request, res: Response) => {
    const result = await userService.createPatient(req);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Patient Create Successfully!',
        data: result
    })
});

const getAllFromDB = catchAsync(async (req, res) => {
    const filters = pick(req.query, userFilterableFields);
    const options = pick(req.query, ['page', 'limit', 'sortBy', 'sortOrder']);

    const result = await userService.getAllFromDB(filters, options);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Get all user retrieved successfully!",
        meta: result.meta,
        data: result.data
    })
});

const changeProfileStatus = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await userService.changeProfileStatus(id, req.body);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "User status change successfully!",
        data: result
    })
});

const getMyProfile = catchAsync(async (req: Request & { user?: TAuthUser }, res: Response) => {
    const user = req.user;

    const result = await userService.getMyProfile(user as TAuthUser);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "My Profile retrieved successfully!",
        data: result
    })
});

const updateMyProfile = catchAsync(async (req: Request & { user?: TAuthUser }, res: Response) => {
    const user = req.user;
    const result = await userService.updateMyProfile(user as TAuthUser, req);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "My Profile update successfully!",
        data: result
    })
});


export const userController = {
    createAdmin,
    createDoctor,
    createPatient,
    getAllFromDB,
    changeProfileStatus,
    getMyProfile,
    updateMyProfile
}