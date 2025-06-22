import axios from "axios";

const API_BASE_URL = "http://localhost:5000";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add authorization token interceptor
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const RatingsAndReviewsService = {
  getPassengerRideReviews: async () => {
    try {
      const response = await axiosInstance.get("/passenger-ride-reviews");
      console.log(response.data.reviews)
      return response.data.reviews;
    } catch (error) {
      throw error.response?.data?.error || "Failed to fetch passenger reviews.";
    }
  },

  markReviewResolved: async (reviewId) => {
    try {
      const response = await axiosInstance.put(`/passenger-ride-reviews/resolve/${reviewId}`, {
        resolved: true,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data?.error || "Failed to mark review as resolved.";
    }
  },

  blockDriver: async (driverId) => {
    try {
      const response = await axiosInstance.put(`/drivers/block/${driverId}`, {
        isBlocked: true,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data?.error || "Failed to block driver.";
    }
  },
};

export default RatingsAndReviewsService;
