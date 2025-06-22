const API_BASE_URL = "http://localhost:5000";

// Helper function to fetch composite IDs for drivers
const fetchDriverCompositeIds = async (driverIds, token) => {
  const uniqueIds = [...new Set(driverIds)];
  const result = {};

  await Promise.all(
    uniqueIds.map(async (id) => {
      try {
        const res = await fetch(`${API_BASE_URL}/drivers/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();
        if (data?.compositeId) {
          result[id] = data.compositeId;
        }
      } catch (err) {
        console.error(`Error fetching driver ID ${id}:`, err);
      }
    })
  );

  return result;
};

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

    if (!Array.isArray(data.allMappings)) return [];

    // 1. Collect unique driver IDs
    const driverIds = [...new Set(data.allMappings.map((ride) => ride.driverID))];

    // 2. Fetch driver composite IDs
    const driverCompositeMap = await fetchDriverCompositeIds(driverIds, token);

    // 3. Map the final result
    return data.allMappings.map((ride, index) => ({
      id: index + 1,
      rideID: ride.compositeId,
      driverID: ride.driverID,
      driverCompositeId: driverCompositeMap[ride.driverID] || "N/A",
      rideStatus: "completed",
      date: ride.date ? new Date(ride.date).toISOString().split("T")[0] : null,
      revenue: ride.revenue || 0,
      fare: ride.fare || 0,
      mode: ride.mode,
    }));
  } catch (error) {
    console.error("Error fetching revenue data:", error.message);
    return [];
  }
};
