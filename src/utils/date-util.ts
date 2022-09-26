import { format, parseISO } from "date-fns";

export class DateUtil {
  static calculateAge(date: string): number {
    const today = new Date();
    const birthDate = new Date(date);
    const age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      return age - 1;
    }

    return age;
  }

  static formatToBr(date: string, hours = false) {
    let template = "dd/MM/Y";
    if (hours) {
      template += " HH:ii";
    }

    return format(parseISO(date), template);
  }
}
