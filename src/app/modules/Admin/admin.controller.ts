import { adminService } from "./admin.service";
import pick from "../../../shared/pick";
import { adminFilterableFields } from "./admin.constant";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";



const getAllAdmin = catchAsync(async (req, res) => {
    const filters = pick(req.query, adminFilterableFields);
    const options = pick(req.query, ['page', 'limit', 'sortBy', 'sortOrder']);

    const result = await adminService.getAllAdmin(filters, options);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Get all admin retrieved successfully!",
        meta: result.meta,
        data: result.data
    })
});

const getByIdFromDB = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await adminService.getByIdFromDB(id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Single admin retrieved successfully!",
        data: result
    })
});

const updateIntoDB = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await adminService.updateIntoDB(id, req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Admin Update successfully!",
        data: result
    })
});

const deleteFromDB = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await adminService.deleteFromDB(id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Admin Delete successfully!",
        data: result
    })
});

const softDeleteFromDB = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await adminService.softDeleteFromDB(id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Admin Delete successfully!",
        data: result
    })
});

export const adminController = {
    getAllAdmin,
    getByIdFromDB,
    updateIntoDB,
    deleteFromDB,
    softDeleteFromDB
}