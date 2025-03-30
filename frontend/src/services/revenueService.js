const API_BASE_URL = "http://localhost:5000";

export const fetchRevenueData = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/rides-with-composite-ids`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (Array.isArray(data.allMappings)) {
      return data.allMappings.map((ride, index) => ({
        id: index + 1,
        rideID: ride.compositeId,
        driverID: ride.driverID,
        driverCompositeId: ride.driverCompositeId || "N/A",
        rideStatus: "completed", // If real status is available, replace this
        date: ride.date ? new Date(ride.date).toISOString().split("T")[0] : null,
        revenue: ride.revenue || 0,
        fare: ride.fare || 0,
        mode: ride.mode,
      }));
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error fetching revenue data:", error.message);
    return [];
  }
};
