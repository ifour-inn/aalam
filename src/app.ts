// deno-lint-ignore-file no-explicit-any
import { serve } from "server";

import { ApplicationContext, Route } from "aalam/src/types/index.ts";

export default class Application {
  private routes: Route[] = [];
  private services: Record<string, any> = {};

  constructor() {
  }

  registerService(name: string, service: any) {
    this.services[name] = service;
  }
  public getService<T>(name: string): T {
    return this.services[name];
  }

  registerRoute(routes: Route[]) {
    this.routes.push(...routes);
  }
  deregisterRoute(path: string, method: string) {
    const index = this.routes.findIndex(
      (r) => r.method == method && r.path == path,
    );
    if (index >= 0) {
      this.routes.splice(index, 1);
    }
  }

  async listen(port: number) {
    await serve((r: Request) => this.handleRequest(this, r), { port });
  }

  private async handleRequest(
    app: Application,
    request: Request,
  ): Promise<Response> {
    const method = request.method;
    const path = new URL(request.url).pathname;
    const query = {} as Record<string, string>;
    const headers = {} as Record<string, string>;
    let body = {};
    let param = {};

    request.headers.forEach((v, k) => {
      headers[k] = v;
    });

    new URL(request.url).searchParams.forEach((v, k) => {
      query[k] = v;
    });

    try {
      body = await request.json();
    } catch (_) {
      //
    }

    if (method == "OPTIONS") {
      return new Response("OK", {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": headers["origin"],
          "Access-Control-Allow-Methods": "*",
          "Access-Control-Allow-Headers": "x-access-token, Content-Type",
        },
      });
    }

    const route = app.routes.find(
      (rr) =>
        new URLPattern({ pathname: rr.path }).test(request.url) &&
        rr.method == method,
    );

    if (!route) {
      return new Response("Route not found.", {
        status: 404,
      });
    }

    param =
      new URLPattern({ pathname: route!.path }).exec(request.url)?.pathname
        .groups ?? {};

    if (route == undefined) {
      return new Response("Route not found.", {
        status: 404,
        headers: {
          "Content-Type": "plain/text",
        },
      });
    }

    const routeParam: ApplicationContext = {
      app,
      request: {
        method,
        path,
        query,
        headers,
        body,
        params: param,
      },
      route: {
        meta: route.meta,
      },
    };

    // If middlewares attached process them sequentially.
    if (route.middlewares != null && route.middlewares?.length > 0) {
      for (const m of route.middlewares) {
        const response = await m(routeParam);
        if (response) {
          response.headers.append("Access-Control-Allow-Origin", "*");
          return response;
        }
      }
    }

    const response = await route.handler(routeParam);
    response.headers.append("Access-Control-Allow-Origin", "*");
    return response;
  }
}
