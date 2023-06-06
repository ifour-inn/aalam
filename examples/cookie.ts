import { Application } from "aalam/mod.ts";

import { getCookies, setCookie } from "cookie";

const app = new Application();

app.registerRoute([
  {
    method: "GET",
    path: "/",
    handler: (c) => {
      const h = new Headers(c.request.headers);

      setCookie(h, { name: "one", value: "text-cookie" });
      setCookie(h, { name: "two", value: "text-cookie", secure: true });

      return new Response("Hello " + c.request.method, {
        headers: h,
      });
    },
  },
  {
    method: "GET",
    path: "/list",
    handler: (c) => {
      const h = new Headers(c.request.headers);

      const cookies = getCookies(h);

      return new Response(JSON.stringify(cookies), {
        headers: {
          "Content-Type": "application/json",
        },
      });
    },
  },
]);

await app.listen(3000);
