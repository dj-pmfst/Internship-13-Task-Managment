export class DateTimeHelper{

    static toDateTimeLocal = (utcString,forDisplay=true) => {
        if (!utcString) return "";
        const d = new Date(utcString);

        const croatiaOptions = {
            timeZone: 'Europe/Zagreb',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        };

        const parts = new Intl.DateTimeFormat('en-GB', croatiaOptions).formatToParts(d);
        const map = {};
        parts.forEach(p => map[p.type] = p.value);

        return forDisplay ? `${map.year}-${map.month}-${map.day} ${map.hour}:${map.minute}`
        : `${map.year}-${map.month}-${map.day}T${map.hour}:${map.minute}`;    

    } 
}