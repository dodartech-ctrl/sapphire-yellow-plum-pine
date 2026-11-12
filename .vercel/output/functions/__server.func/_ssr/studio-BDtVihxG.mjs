import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { x as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as Route, s as useOriel } from "./router-BMrN6z9B.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/studio-BDtVihxG.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function StudioPage() {
	const search = Route.useSearch();
	const setActiveKey = useOriel((state) => state.setActiveKey);
	const navigate = useNavigate();
	(0, import_react.useEffect)(() => {
		if (search.study) setActiveKey(`study:${search.study}`);
		else if (search.template) setActiveKey(`template:${search.template}`);
		navigate({
			to: "/",
			replace: true
		});
	}, [
		navigate,
		search.study,
		search.template,
		setActiveKey
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "flex h-full items-center justify-center px-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted",
			children: "Opening the studio…"
		})
	});
}
//#endregion
export { StudioPage as component };
