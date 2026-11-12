import { t as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-A6pJPYTF.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/credits-GKZwa5Ff.js
var getStudioCredits_createServerFn_handler = createServerRpc({
	id: "784f407cb6d96f7e14268500687060171afa82b7e6a85a0a6ab4de7e4aadbf5e",
	name: "getStudioCredits",
	filename: "src/lib/credits.ts"
}, (opts) => getStudioCredits.__executeServer(opts));
var getStudioCredits = createServerFn({ method: "POST" }).handler(getStudioCredits_createServerFn_handler, async () => {
	const { readWallet } = await import("./credits.server-B7C2uEBU.mjs");
	return readWallet();
});
//#endregion
export { getStudioCredits_createServerFn_handler };
