interface OkResponse<T> {
  ok: true;
  status: number;
  data: T;
}

interface RedirectResponse {
  ok: false;
  status: 302;
  redirect: string;
}

export const RawLocalClient = {
  auth: {
    get: async (): Promise<RedirectResponse> => {
      const res = await fetch("/api/auth");
      return await res.json(); // Await the result of res.json()
    },
    verifyJwt: {
      get: async (): Promise<{}> => {
        const res = await fetch("/api/auth/verifyJwt");
        return await res.json(); // Await the result of res.json()
      },
    },
  },
};
