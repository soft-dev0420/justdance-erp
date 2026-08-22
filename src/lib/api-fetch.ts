export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function apiFetch(url: string | URL, options?: RequestInit): Promise<Response> {
  let res: Response;
  try {
    res = await fetch(url, options);
  } catch {
    throw new ApiError(0, 'Network error — check your connection and try again.');
  }

  if (res.status === 504) throw new ApiError(504, 'Server is taking too long to respond. Please try again.');
  if (res.status === 502 || res.status === 503) {
    throw new ApiError(res.status, 'Service is temporarily unavailable. Please try again.');
  }

  return res;
}
