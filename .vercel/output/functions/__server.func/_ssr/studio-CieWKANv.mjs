import { o as __toESM } from "../_runtime.mjs";
import { G as STUDIES, q as TEMPLATES } from "./fallback-render-kleyA0ad.mjs";
import { nt as useOriel } from "./store-DhXBZ9GM.mjs";
import { n as Route$2 } from "./router-BiPrL9zA.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { b as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
// node_modules/.nitro/vite/services/ssr/assets/studio-CieWKANv.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function StudioPage() {
	const search = Route$2.useSearch();
	const setActiveKey = useOriel((state) => state.setActiveKey);
	const setIdea = useOriel((state) => state.setIdea);
	const navigate = useNavigate();
	(0, import_react.useEffect)(() => {
		if (search.study) {
			setActiveKey(`study:${search.study}`);
			const found = STUDIES.find((s) => s.id === search.study);
			if (found?.prompt) setIdea(found.prompt);
		} else if (search.template) {
			setActiveKey(`template:${search.template}`);
			const found = TEMPLATES.find((t) => t.id === search.template);
			if (found?.prompt) setIdea(found.prompt);
		}
		if (search.brief) setIdea(search.brief);
		navigate({
			to: "/",
			replace: true
		});
	}, [
		navigate,
		search.brief,
		search.study,
		search.template,
		setActiveKey,
		setIdea
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "flex h-full items-center justify-center px-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted",
			children: "Opening the studio…"
		})
	});
}
export { StudioPage as component };
