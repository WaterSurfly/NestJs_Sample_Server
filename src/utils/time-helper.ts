import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc'

export class TimeHelper {

    static dateTemplate = 'YYYY-MM-DD HH:mm:ss';

    static getUtcTime(format?: string) {
        dayjs.extend(utc);
        return dayjs().utc().format(format ? format : this.dateTemplate);
    }

    static getLocalTime(format?: string) {
        return dayjs().format(format ? format : this.dateTemplate);
    }
}
