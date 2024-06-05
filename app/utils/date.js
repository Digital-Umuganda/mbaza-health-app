import dayjs from "dayjs"
import customParseFormat from "dayjs/plugin/customParseFormat"
import duration from "dayjs/plugin/duration"
import utc from "dayjs/plugin/utc"

dayjs.extend(duration)
dayjs.extend(customParseFormat)
dayjs.extend(utc)

const appDayjs = dayjs


export const dateTimeWithSpaceFormat = "YYYY-MM-DD HH:mm:ss"

export default appDayjs
