import { ApplicationContext } from "aalam/src/types/app.ts";

export interface Route {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  path: string;
  meta?: Record<string, any>;
  handler: (context: ApplicationContext) => Promise<Response> | Response;
  middlewares?: ((
    context: ApplicationContext,
  ) => Promise<Response | void> | Response | void)[];
}
