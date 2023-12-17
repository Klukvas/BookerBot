import moment from "moment-timezone";


export function dateToMoment(date: string|Date){
    return moment.utc(date, ['DD.MM.YYYY HH:mm', 'DD/MM/YYYY HH:mm'], true);
}