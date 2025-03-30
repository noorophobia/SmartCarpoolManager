export default class RidesService {
    constructor(token) {
      this.token = token;
      this.baseUrl = "http://localhost:5000";
    }
  
    async fetchJson(url) {
      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${this.token}`,
          "Content-Type": "application/json",
        },
      });
      return res.json();
    }
  
    async getCompositeIds() {
      const data = await this.fetchJson(`${this.baseUrl}/rides-with-composite-ids`);
      return data.allMappings.reduce((map, item) => {
        map[item.rideID] = item.compositeId;
        return map;
      }, {});
    }
  
    async fetchSingleRides() {
      const rides = await this.fetchJson(`${this.baseUrl}/single-rides`);
      return rides.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
  
    async fetchCarpoolRides() {
      return await this.fetchJson(`${this.baseUrl}/carpool-rides`);
    }
  
    async fetchUserCompositeIds(ids, type) {
      const result = {};
      await Promise.all(
        ids.map(async (id) => {
          try {
            const data = await this.fetchJson(`${this.baseUrl}/${type}/${id}`);
            if (data && data.compositeId) result[id] = data.compositeId;
          } catch (err) {
            console.error(`Error fetching ${type} ID ${id}:`, err);
          }
        })
      );
      return result;
    }
  
    async getAllRides() {
      const compositeMap = await this.getCompositeIds();
      const [singleRides, carpoolRides] = await Promise.all([
        this.fetchSingleRides(),
        this.fetchCarpoolRides(),
      ]);
  
      const passengerIds = [...new Set(singleRides.map((r) => r.passengerId))];
      const driverIds = [...new Set(singleRides.map((r) => r.driverID))];
      const carpoolPassengerIds = [...new Set(carpoolRides.flatMap((r) => r.passengerId))];
      const carpoolDriverIds = [...new Set(carpoolRides.map((r) => r.driverID))];
  
      const [passengerMap, driverMap, carpoolPassengerMap, carpoolDriverMap] = await Promise.all([
        this.fetchUserCompositeIds(passengerIds, "passengers"),
        this.fetchUserCompositeIds(driverIds, "drivers"),
        this.fetchUserCompositeIds(carpoolPassengerIds, "passengers"),
        this.fetchUserCompositeIds(carpoolDriverIds, "drivers"),
      ]);
  
      const updatedSingleRides = singleRides.map((ride) => ({
        ...ride,
        mode: ride.requestType || "Unknown",
        passengerCompositeId: passengerMap[ride.passengerId] || "N/A",
        driverCompositeId: driverMap[ride.driverID] || "N/A",
        compositeId: compositeMap[ride._id] || "N/A",
      }));
  
      const updatedCarpoolRides = carpoolRides.map((ride) => ({
        ...ride,
        passengerCompositeId: ride.passengerId.map((id) => carpoolPassengerMap[id] || "N/A"),
        driverCompositeId: carpoolDriverMap[ride.driverID] || "N/A",
        compositeId: compositeMap[ride._id] || "N/A",
      }));
  
      return [...updatedSingleRides, ...updatedCarpoolRides].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    }
  }
  