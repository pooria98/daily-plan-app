export interface ApiError extends Error {
  response: {
    data: {
      error: string;
    };
  };
}

export interface Plan {
  name?: string;
  activities: {
    title: string;
    hour: number | undefined;
  }[];
}

export interface Activities {
  id?: string;
  name: string;
  hour: number;
  createdAt?: string;
}
