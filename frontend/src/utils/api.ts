const API_URL = "http://localhost:3001/api/";

const getAPI = async (path: string, params?: Record<string, string>) => {
  let response: Response
  if (!params) {
    response = await fetch(`${API_URL}${path}`);
  } else {
    const URLparams = new URLSearchParams(params);
    response = await fetch(`${API_URL}${path}?${URLparams.toString()}`);
  }
  if (response.status >= 400) {
    console.log(response);
    return null;
  } else {
    return await response.json();
  }
};

const postAPI = async (path: string, body: Object) => {
  const response = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (response.status === 201) {
    return await response.json();
  } else {
    return null;
  }
};

const putAPI = async (path: string, body: Object) => {
  const response = await fetch(`${API_URL}${path}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (response.status >= 400) {
    console.log(response);
    return null;
  } else {
    return await response.json();
  }
};

const deleteAPI = async (path: string): Promise<boolean> => {
  const response = await fetch(`${API_URL}${path}`, {
    method: "DELETE",
  });
  if (response.status === 200) {
    return true;
  } else {
    return false;
  }
};

export { getAPI, postAPI, putAPI, deleteAPI };
