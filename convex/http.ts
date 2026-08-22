import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";

const http = httpRouter();

http.route({
  path: "/tick",
  method: "POST",
handler: httpAction(async (ctx, request) => {
  const { positions, since } = await request.json();

  if (positions?.length) {
    await ctx.runMutation(api.game.writePositions, { positions });
  }

  // first tick after a server start — skip history
  if (since === null || since === undefined) {
    return Response.json({ commands: [], cursor: Date.now() });
  }

  const commands = await ctx.runQuery(api.game.commandsSince, { since });
  const cursor = commands.length
    ? Math.max(...commands.map((c) => c._creationTime))
    : since;

  return Response.json({ commands, cursor });
}),
});

export default http;