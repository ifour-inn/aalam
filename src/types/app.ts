import Application from "aalam/src/app.ts";

export interface ApplicationContext {
  request: {
    method: string;
    path: string;
    query: Record<string, string>;
    headers: Record<string, string>;
    body: Record<string, string>;
    params: Record<string, string>;
  };
  route: {
    meta?: Record<string, string>;
  };
  app: Application;
}
