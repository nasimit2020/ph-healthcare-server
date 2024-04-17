import { Router } from "express";
import { adminController } from "./admin.controller";
import validateRequest from "../../middlewares/validateRequest";
import { adminValidationsSchema } from "./admin.validations";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = Router();

router.get(
    '/',
    auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
    adminController.getAllAdmin
);

router.get(
    '/:id',
    auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
    adminController.getByIdFromDB
);

router.patch(
    '/:id',
    auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
    validateRequest(adminValidationsSchema.update),
    adminController.updateIntoDB
);

router.delete(
    '/:id',
    auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
    adminController.deleteFromDB
);

router.delete(
    '/soft/:id',
    auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
    adminController.softDeleteFromDB
);

export const adminRoutes = router;