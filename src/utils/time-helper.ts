import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc'
import { ValueTransformer } from 'typeorm';

export class TimeHelper {

    static dateTemplate = 'YYYY-MM-DD HH:mm:ss';

    static getUtcDate() {
        dayjs.extend(utc);
        return dayjs().utc().toDate();
    }

    static getUtcTime(format?: string) {
        dayjs.extend(utc);
        return dayjs().utc().format(format ? format : this.dateTemplate);
    }

    static getLocalTime(format?: string) {
        return dayjs().format(format ? format : this.dateTemplate);
    }

    static getUtcTimeTransformTo(time) {
        dayjs.extend(utc);
        return dayjs(time).utc().toDate();
    }

    static getUtcTimeTransformFrom(time) {
        dayjs.extend(utc);
        return dayjs(time).utc().format(this.dateTemplate);
    }
}

export class DateTimeTransformer implements ValueTransformer {
    // entity -> db
    to(time: string): Date {
        return TimeHelper.getUtcTimeTransformTo(time);
    }

    // db -> entity
    from(time: Date): string {
        return TimeHelper.getUtcTimeTransformFrom(time);
    }
}