export default class RideDetailsService {
    constructor(token) {
      this.token = token;
      this.baseUrl = "http://localhost:5000";
    }
  
    async fetchRideDetails(rideId) {
      try {
        const response = await fetch(`${this.baseUrl}/single-rides/${rideId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${this.token}`,
            "Content-Type": "application/json",
          },
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Error fetching ride details");
        }
  
        return await response.json();
      } catch (error) {
        console.error("Failed to fetch ride details:", error);
        throw error;
      }
    }
  }
  