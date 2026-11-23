import { n as TSS_SERVER_FUNCTION, r as getServerFnById, t as createServerFn } from "./ssr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/credits-Dsn9xLgu.js
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var CREDIT_MAX = 5e3;
var OPENING_CREDITS = 4500;
var WALLET_ID = "studio";
var getStudioCredits = createServerFn({ method: "POST" }).handler(createSsrRpc("784f407cb6d96f7e14268500687060171afa82b7e6a85a0a6ab4de7e4aadbf5e"));
//#endregion
export { getStudioCredits as a, createSsrRpc as i, OPENING_CREDITS as n, WALLET_ID as r, CREDIT_MAX as t };
