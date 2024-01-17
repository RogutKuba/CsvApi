export interface ErrorResponse {
  ok: false;
  status: number;
  title: string;
  message: string;
}

export interface OkResponse<T> {
  ok: true;
  status: number;
  data: T;
}

export interface RedirectResponse {
  ok: false;
  status: 302;
  redirect: string;
}
