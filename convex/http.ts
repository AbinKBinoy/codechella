import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";

const http = httpRouter();

http.route({
  path: "/tick",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    // 1. Unpack the payload from Roblox
    const { positions, since } = await request.json();

    // 2. Update the live player locations in the database
    await ctx.runMutation(api.game.writePositions, { positions });

    // 3. Fetch the new traps (This is Claude's updated code)
    const commands = await ctx.runQuery(api.game.commandsSince, { since });
    
    // 4. Calculate the perfect cursor without the T1/T2 gap
    const cursor = commands.length 
      ? Math.max(...commands.map((c) => c._creationTime)) 
      : since;

    // 5. Send it back to Roblox
    return Response.json({ commands, cursor });
  }),
});

export default http;