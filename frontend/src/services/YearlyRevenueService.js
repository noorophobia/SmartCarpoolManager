const API_BASE_URL = "http://localhost:5000";

export const fetchYearlyRevenueData = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/rides-with-composite-ids`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!Array.isArray(data.allMappings)) {
      throw new Error("Unexpected data format from server");
    }

    return data.allMappings.map((ride, index) => ({
      id: index + 1,
      rideID: ride.compositeId,
      date: ride.date ? new Date(ride.date).toISOString().split("T")[0] : null,
      rideStatus: ride.rideStatus || "Completed",
      passengerID: ride.passengerCompositeId || "N/A",
      driverID: ride.driverCompositeId || "N/A",
      revenue: ride.revenue || 0,
    }));
  } catch (error) {
    console.error("Error fetching yearly revenue data:", error);
    throw error;
  }
};
