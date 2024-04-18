import { Router } from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { PatientController } from "./patient.controller";

const router = Router();

router.get(
    '/',
    // auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
    PatientController.getAllFromDB
);

router.get(
    '/:id',
    // auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
    PatientController.getByIdFromDB
);

router.patch(
    '/:id',
    // auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
    // validateRequest(adminValidationsSchema.update),
    PatientController.updateIntoDB
);

// router.delete(
//     '/:id',
//     auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
//     DoctorController.deleteFromDB
// );

// router.delete(
//     '/soft/:id',
//     auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
//     DoctorController.softDeleteFromDB
// );

export const PatientRoutes = router;