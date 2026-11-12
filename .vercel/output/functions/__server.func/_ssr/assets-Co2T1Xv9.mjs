import { x as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { E as VERTICALS, d as GROUPS, p as LOOKS } from "./frame-w23bPEhU.mjs";
import { s as useOriel } from "./router-BMrN6z9B.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/assets-Co2T1Xv9.js
var import_jsx_runtime = require_jsx_runtime();
function AssetsPage() {
	const setVertical = useOriel((state) => state.setVertical);
	const setDesignField = useOriel((state) => state.setDesignField);
	const setPick = useOriel((state) => state.setPick);
	const navigate = useNavigate();
	function useLook(vertical, name) {
		setVertical(vertical);
		setDesignField("look", name);
		navigate({ to: "/" });
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "h-full overflow-y-auto px-4 py-6 md:px-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-syne text-3xl font-bold",
				children: "Assets"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 max-w-xl text-sm text-muted",
				children: "Looks and finishes from the studio library. Choosing one returns you to the canvas."
			}),
			VERTICALS.map((vertical) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-syne text-xl font-semibold",
						children: vertical.label
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 grid grid-cols-2 gap-3 md:grid-cols-4",
						children: LOOKS[vertical.id].map((look) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => useLook(vertical.id, look.name),
							className: "overflow-hidden rounded-2xl border border-line text-left",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: look.image,
								alt: "",
								className: "h-28 w-full object-cover"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block px-3 py-2 text-sm",
								children: look.name
							})]
						}, look.name))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4 flex flex-wrap gap-2",
						children: GROUPS[vertical.id].flatMap((group) => group.options.map((option) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: "h-10 rounded-full border border-line px-3 text-sm text-muted",
							onClick: () => {
								setVertical(vertical.id);
								setPick(group.id, option);
								navigate({ to: "/" });
							},
							children: [
								group.label,
								": ",
								option
							]
						}, `${group.id}-${option}`)))
					})
				]
			}, vertical.id))
		]
	});
}
//#endregion
export { AssetsPage as component };
