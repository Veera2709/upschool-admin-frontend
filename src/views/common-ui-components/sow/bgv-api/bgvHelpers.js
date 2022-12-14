import { SessionStorage } from "../../../../util/SessionStorage";

export const handleDisabling = (newUpload) => {
  switch (SessionStorage.getItem('user_category')) {
    case "Admin":
      return false;
    case "CST Supervisor":
      return true;
    case "CST":
      return true;
    case "Operation Supervisor":
      return true;
    case "Operation Team":
      return true;
    case "Client":
      if (newUpload) {
        return false;
      } else {
        return true;
      }
    default:
      return true;
  }
}