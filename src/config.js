import { config } from "dotenv";

config()

export const PORT = process.env.PORT || 3000
export const PASSCONEXION = process.env.PASSCONEXION || 'lavida1083'
export const NOMBREDB = process.env.NOMBREDB || 'persona'