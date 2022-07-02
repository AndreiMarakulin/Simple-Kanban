const API_URL = "http://localhost:3001/api/";

const getAPI = async (
  path: string,
  params?: Record<string, string>,
  token?: string
) => {
  const headers = new Headers({
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    "Content-Type": "application/json",
  });
  let response: Response;
  if (!params || Object.keys(params).length === 0) {
    response = await fetch(`${API_URL}${path}`, {
      method: "GET",
      credentials: 'include',
      headers: headers,
    });
  } else {
    const URLparams = new URLSearchParams(params);
    response = await fetch(`${API_URL}${path}?${URLparams.toString()}`, {
      method: "GET",
      credentials: 'include',
      headers: headers,
    });
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
    // credentials: "same-origin",
    credentials: 'include',
    body: JSON.stringify(body),
  });
  if (response.status >= 400) {
    console.log(response);
  }
  return await response.json();
};

const putAPI = async (path: string, body: Object) => {
  const response = await fetch(`${API_URL}${path}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: 'include',
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
    credentials: 'include',
  });
  if (response.status === 200) {
    return true;
  } else {
    return false;
  }
};

export { getAPI, postAPI, putAPI, deleteAPI };
