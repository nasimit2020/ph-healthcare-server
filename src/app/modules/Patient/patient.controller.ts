import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import pick from "../../../shared/pick";
import sendResponse from "../../../shared/sendResponse";
import { patientFilterableFields } from "./patient.constant";
import { PatientService } from "./patient.service";

const getAllFromDB = catchAsync(async (req, res) => {
    const filters = pick(req.query, patientFilterableFields);
    const options = pick(req.query, ['page', 'limit', 'sortBy', 'sortOrder']);

    const result = await PatientService.getAllFromDB(filters, options);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Get all Patient retrieved successfully!",
        meta: result.meta,
        data: result.data
    })
});

const getByIdFromDB = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await PatientService.getByIdFromDB(id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Single Patient retrieved successfully!",
        data: result
    })
});

const updateIntoDB = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await PatientService.updateIntoDB(id, req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Patient Update successfully!",
        data: result
    })
});


export const PatientController = {
    getAllFromDB,
    getByIdFromDB,
    updateIntoDB,
    // deleteFromDB,
    // softDeleteFromDB
}