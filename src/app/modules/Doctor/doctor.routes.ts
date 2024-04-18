import { Router } from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { DoctorController } from "./doctor.controller";

const router = Router();

router.get(
    '/',
    auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
    DoctorController.getAllDoctor
);

router.get(
    '/:id',
    auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
    DoctorController.getByIdFromDB
);

router.patch(
    '/:id',
    auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
    // validateRequest(adminValidationsSchema.update),
    DoctorController.updateIntoDB
);

router.delete(
    '/:id',
    auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
    DoctorController.deleteFromDB
);

router.delete(
    '/soft/:id',
    auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
    DoctorController.softDeleteFromDB
);

export const DoctorRoutes = router;