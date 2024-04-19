import { Router } from "express";
import { ScheduleController } from "./schedule.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";


const router = Router();

router.post(
    '/',
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
    ScheduleController.insertIntoDB
);

// router.get(
//     '/',
//     SpecialtiesController.getAllSpecialties
// );

// router.delete(
//     '/:id',
//     SpecialtiesController.deleteSpecialties
// );


export const ScheduleRoutes = router;