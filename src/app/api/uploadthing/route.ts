import { createRouteHandler } from "uploadthing/server";

import { ourFileRouter } from "./core";

export const { POST } = createRouteHandler({
  router: ourFileRouter,
});

