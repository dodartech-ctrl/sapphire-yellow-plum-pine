import { t as clsx } from "../_libs/clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
// node_modules/.nitro/vite/services/ssr/assets/utils-BPtpUp2a.js
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function formatWhen(at) {
	return new Date(at).toLocaleString(void 0, {
		month: "short",
		day: "numeric",
		hour: "numeric",
		minute: "2-digit"
	});
}
export { formatWhen as n, cn as t };
