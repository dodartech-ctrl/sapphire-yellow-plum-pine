import { t as createServerRpc } from "./createServerRpc-BYs_ScYe.mjs";
import { t as createServerFn } from "./ssr.mjs";
// node_modules/.nitro/vite/services/ssr/assets/brief-moodboard-api-eBF7O1Ql.js
var generateMoodboardFn_createServerFn_handler = createServerRpc({
	id: "74fdd6b4e7b942b655533fe040ff575b82ba9273c7b6a74bfaed3e4feadf474d",
	name: "generateMoodboardFn",
	filename: "src/lib/brief-moodboard-api.ts"
}, (opts) => generateMoodboardFn.__executeServer(opts));
var generateMoodboardFn = createServerFn({ method: "POST" }).validator((data) => data).handler(generateMoodboardFn_createServerFn_handler, async ({ data }) => {
	const { fetchAutomatedMoodboardFromPublicApi } = await import("./brief-moodboard.server-Dcxxy1-3.mjs");
	return fetchAutomatedMoodboardFromPublicApi(data.queries);
});
export { generateMoodboardFn_createServerFn_handler };
