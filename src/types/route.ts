import { ApplicationContext } from "aalam/src/types/app.ts";

export interface Route {
  method: "GET" | "POST" | "PATCH" | "DELETE";
  path: string;
  is_system_route?: boolean;
  meta?: Record<string, any>;
  handler: (context: ApplicationContext) => Promise<Response> | Response;
  middlewares?: ((
    context: ApplicationContext,
  ) => Promise<Response | void> | Response | void)[];
}
