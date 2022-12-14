import Swal, { SweetAlertResult } from "sweetalert2";

export class AlertUtil {
  static toastError(title: string): void {
    Swal.fire({
      title,
      icon: "error",
      toast: true,
      timer: 3000,
      timerProgressBar: true,
      position: "top-end",
      showConfirmButton: false,
    });
  }

  static toastSuccess(title: string): void {
    Swal.fire({
      title,
      icon: "success",
      toast: true,
      timer: 3000,
      timerProgressBar: true,
      position: "top-end",
      showConfirmButton: false,
    });
  }

  static async confirmMessage(text: string): Promise<SweetAlertResult> {
    return await Swal.fire({
      text,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Confirmar",
      cancelButtonText: "Cancelar",
    });
  }
}
