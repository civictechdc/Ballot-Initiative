import { BACKEND_URL } from "@/constants";
import Axios from "axios";

export const axios = Axios.create({
    baseURL: BACKEND_URL
});