import axios from "axios";
import { notifications } from "@mantine/notifications";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/api",
});

axiosInstance.interceptors.response.use(
  (response) => {
    // console.log("Response:", response); // Log the response
    return response; // Pass the response through
  },
  async (error) => {
    // show errors and notifications
    console.error(error);
    if (error?.response?.data.error) {
      notifications.show({
        color: "red",
        title: `${error?.status}: ${error?.code}`,
        message: error?.response?.data?.error,
      });
    } else if (error) {
      notifications.show({
        color: "red",
        title: "Error",
        message: "Error",
      });
    }
    return Promise.reject(error); // Reject the error if it cannot be handled
  }
);

export default axiosInstance;
