import { Router } from "express";

const router = Router();

router.get(
    '/',
    MetaController.fetchDashboardMetaData
)


export const MetaRoutes = router;