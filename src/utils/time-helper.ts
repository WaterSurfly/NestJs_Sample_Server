import dayjs from 'dayjs';

export class TimeHelper {
    static getUtcTime() {
        return dayjs().format('YYYY-MM-DD HH:mm:ss');
    }
}
