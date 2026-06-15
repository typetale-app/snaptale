import homepage from "./index.html";
import editorFrame from "./snaptale-frame.html";

export default {
  port: 3000,
  development: process.env.NODE_ENV !== "production",
  routes: {
    "/": homepage,
    "/editor": editorFrame,
  },
  fetch(req: Request) {
    return new Response("Not Found", { status: 404 });
  },
};
