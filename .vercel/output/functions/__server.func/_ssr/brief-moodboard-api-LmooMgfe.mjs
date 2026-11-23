import { t as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-A6pJPYTF.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/brief-moodboard-api-LmooMgfe.js
var generateMoodboardFn_createServerFn_handler = createServerRpc({
	id: "74fdd6b4e7b942b655533fe040ff575b82ba9273c7b6a74bfaed3e4feadf474d",
	name: "generateMoodboardFn",
	filename: "src/lib/brief-moodboard-api.ts"
}, (opts) => generateMoodboardFn.__executeServer(opts));
var generateMoodboardFn = createServerFn({ method: "POST" }).validator((data) => data).handler(generateMoodboardFn_createServerFn_handler, async ({ data }) => {
	const { fetchAutomatedMoodboardFromPublicApi } = await import("./brief-moodboard.server-Cipu9-Ky.mjs");
	return fetchAutomatedMoodboardFromPublicApi(data.queries);
});
//#endregion
export { generateMoodboardFn_createServerFn_handler };
