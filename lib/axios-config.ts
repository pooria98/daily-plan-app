import axios from "axios";
import { notifications } from "@mantine/notifications";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/api",
});

axiosInstance.interceptors.response.use(
  (response) => response, // Pass through successful responses
  async (error) => {
    // show errors and notifications
    console.error(error);
    if (error?.response?.data) {
      notifications.show({
        color: "red",
        title: `${error?.status}: ${error?.code}`,
        message: error?.response?.data?.error,
      });
    } else if (error) {
      notifications.show({
        color: "red",
        title: "Error",
        message: error.message || error,
      });
    }
    return Promise.reject(error); // Reject the error if it cannot be handled
  }
);

export default axiosInstance;
