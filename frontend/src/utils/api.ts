const API_URL = "http://localhost:3001/api/";

const getAPI = async(path: string, params?: Record<string, string> ) => {
    const URLparams = new URLSearchParams(params);
    const response = await fetch(`${API_URL}${path}?${URLparams.toString()}`);
    return await response.json();
}

export {getAPI}