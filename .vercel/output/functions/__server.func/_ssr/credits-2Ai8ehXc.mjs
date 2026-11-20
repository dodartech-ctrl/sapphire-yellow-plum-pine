import { t as createServerRpc } from "./createServerRpc-BYs_ScYe.mjs";
import { t as createServerFn } from "./ssr.mjs";
// node_modules/.nitro/vite/services/ssr/assets/credits-2Ai8ehXc.js
var getStudioCredits_createServerFn_handler = createServerRpc({
	id: "784f407cb6d96f7e14268500687060171afa82b7e6a85a0a6ab4de7e4aadbf5e",
	name: "getStudioCredits",
	filename: "src/lib/credits.ts"
}, (opts) => getStudioCredits.__executeServer(opts));
var getStudioCredits = createServerFn({ method: "POST" }).handler(getStudioCredits_createServerFn_handler, async () => {
	const { readWallet } = await import("./credits.server-Ndko_Fow.mjs");
	return readWallet();
});
export { getStudioCredits_createServerFn_handler };
