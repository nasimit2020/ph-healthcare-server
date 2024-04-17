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

export const SpecialtiesController = {
    insertIntoDB
}