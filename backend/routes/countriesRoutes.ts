import { Router } from "express";
import {getCountries} from '../controllers/countriesController'

const router = Router();

router.get("/", getCountries);

export default router;
