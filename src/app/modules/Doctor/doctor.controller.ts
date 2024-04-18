import pick from "../../../shared/pick";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import { doctorFilterableFields } from "./doctor.constant";
import { DoctorService } from "./doctor.service";



const getAllDoctor = catchAsync(async (req, res) => {
    const filters = pick(req.query, doctorFilterableFields);
    const options = pick(req.query, ['page', 'limit', 'sortBy', 'sortOrder']);

    const result = await DoctorService.getAllDoctor(filters, options);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Get all doctor retrieved successfully!",
        meta: result.meta,
        data: result.data
    })
});

const getByIdFromDB = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await DoctorService.getByIdFromDB(id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Single doctor retrieved successfully!",
        data: result
    })
});

const updateIntoDB = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await DoctorService.updateIntoDB(id, req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Doctor Update successfully!",
        data: result
    })
});

const deleteFromDB = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await DoctorService.deleteFromDB(id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Doctor Delete successfully!",
        data: result
    })
});

const softDeleteFromDB = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await DoctorService.softDeleteFromDB(id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Doctor Delete successfully!",
        data: result
    })
});

export const DoctorController = {
    getAllDoctor,
    getByIdFromDB,
    updateIntoDB,
    deleteFromDB,
    softDeleteFromDB
}