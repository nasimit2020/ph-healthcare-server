import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import { SpecialtiesService } from "./specialties.service";
import sendResponse from "../../../shared/sendResponse";


const insertIntoDB = catchAsync(async (req, res) => {
    const result = await SpecialtiesService.insertIntoDB(req);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Specialties created successfully!",
        data: result
    })
});

const getAllSpecialties = catchAsync(async (req, res) => {
    const result = await SpecialtiesService.getAllSpecialtiesFromDB();

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "All Specialties retrieved successfully!",
        data: result
    })
});

const deleteSpecialties = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await SpecialtiesService.deleteSpecialtiesFromDB(id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Specialties Delete successfully!",
        data: result
    })
});

export const SpecialtiesController = {
    insertIntoDB,
    getAllSpecialties,
    deleteSpecialties
}