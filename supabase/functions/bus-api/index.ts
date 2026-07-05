import "@supabase/functions-js/edge-runtime.d.ts";
import { withSupabase } from "@supabase/server";
import { errorResponse } from "./errors.ts";
import { handleBusApiRequest } from "./routes.ts";

export default {
  fetch: withSupabase(
    { auth: ["publishable", "secret"] },
    async (request) => {
      try {
        return await handleBusApiRequest(request);
      } catch (error) {
        return errorResponse(error);
      }
    },
  ),
};
