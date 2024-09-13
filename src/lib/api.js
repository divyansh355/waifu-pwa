const apiUrl = 'https://api.waifu.im/search';  // Actual API URL

export const fetchWaifu = async (params) => {
  const queryParams = new URLSearchParams();

  for (const key in params) {
    if (Array.isArray(params[key])) {
      params[key].forEach(value => {
        queryParams.append(key, value);
      });
    } else {
      queryParams.set(key, params[key]);
    }
  }

  const requestUrl = `${apiUrl}?${queryParams.toString()}`;

  try {
    const response = await fetch(requestUrl);
    if (response.ok) {
      return await response.json();
    } else {
      throw new Error('Request failed with status code: ' + response.status);
    }
  } catch (error) {
    console.error('An error occurred:', error.message);
    throw error;
  }
};
