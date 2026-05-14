import homepage from "./index.html";

export default {
  port: 3000,
  development: process.env.NODE_ENV !== "production",
  routes: {
    "/": homepage,
  },
  fetch(req: Request) {
    return new Response("Not Found", { status: 404 });
  },
};
