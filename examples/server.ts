import { Application } from "aalam/mod.ts";

const app = new Application();

app.registerRoute([
  {
    method: "GET",
    path: "/",
    handler: (c) => {
      return new Response("Hello " + c.request.method);
    },
  },
  {
    method: "POST",
    path: "/",
    handler: (c) => {
      return new Response("Hello " + c.request.method);
    },
  },
  {
    method: "DELETE",
    path: "/",
    handler: (c) => {
      return new Response("Hello " + c.request.method);
    },
  },
  {
    method: "PATCH",
    path: "/",
    handler: (c) => {
      return new Response("Hello " + c.request.method);
    },
  },
]);

await app.listen(3000);
