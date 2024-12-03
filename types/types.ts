export interface ApiError extends Error {
  response: {
    data: {
      error: string;
    };
  };
}

export interface Plan {
  name: string;
  activities: {
    title: string;
    hour: number;
  }[];
}
