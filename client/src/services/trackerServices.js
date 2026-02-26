import api from "./api";

export const fetchTrackers = async () => {
    const response = await api.get("/tracker/");
    return response.data;
}

export const addTracker = async (ticker, q, min_strike_pct, max_strike_pct, interval) => {
    const payload = { ticker, q, min_strike_pct, max_strike_pct, interval };
    const response = await api.post("/tracker/", payload);
    return response.data;
}

export const fetchSnapshots = async (trackerId) => {
    const response = await api.get(`/tracker/${trackerId}/snapshots/`);
    return response.data;
}

export const deleteTracker = async (trackerId) => {
    const response = await api.delete(`/tracker/${trackerId}/`);
    return response.data;
}