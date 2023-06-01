import { Route } from "aalam/src/types/index.ts";

export default class Router {
  private routes: Route[] = [];

  add(options: Route) {
    this.routes.push(options);
  }

  getRoutes(): Route[] {
    return this.routes;
  }
}
