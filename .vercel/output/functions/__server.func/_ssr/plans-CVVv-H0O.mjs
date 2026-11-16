import { o as __toESM } from "../_runtime.mjs";
import { nt as useOriel } from "./store-DhXBZ9GM.mjs";
import { D as formatWhen } from "./router-BiPrL9zA.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
// node_modules/.nitro/vite/services/ssr/assets/plans-CVVv-H0O.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var TIERS = [
	{
		name: "Field",
		price: "Included",
		detail: "The studio you are in. Full library, five dialects, the benchmark, and boards kept on this device.",
		points: [
			"38 task templates",
			"Tested briefs with plates",
			"Local boards and iteration log"
		]
	},
	{
		name: "Practice",
		price: "For a studio",
		detail: "Shared boards and a review link a client can open without a login maze. Mapped here, not billed.",
		points: [
			"Seats for a project team",
			"Client review links",
			"A shared iteration log"
		]
	},
	{
		name: "Atelier",
		price: "For a practice",
		detail: "Your own benchmark against the models you actually ship, and a private prompt set that does not leak into a public library.",
		points: [
			"Private prompt governance",
			"A benchmark on your stack",
			"Review criteria for your stage"
		]
	}
];
function PlansPage() {
	const requests = useOriel((state) => state.requests);
	const addRequest = useOriel((state) => state.addRequest);
	const [studio, setStudio] = (0, import_react.useState)("");
	const [email, setEmail] = (0, import_react.useState)("");
	const [note, setNote] = (0, import_react.useState)("Practice seat");
	const [error, setError] = (0, import_react.useState)("");
	const [saved, setSaved] = (0, import_react.useState)(false);
	function submit(event) {
		event.preventDefault();
		if (studio.trim().length < 2) {
			setError("Name the studio.");
			return;
		}
		if (!email.includes("@") || !email.includes(".")) {
			setError("Use a real email so the note is worth keeping.");
			return;
		}
		addRequest({
			studio: studio.trim(),
			email: email.trim(),
			note: note.trim()
		});
		setSaved(true);
		setError("");
		setStudio("");
		setEmail("");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "h-full overflow-y-auto",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-6xl px-4 py-8 md:px-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-medium uppercase tracking-wide text-lime",
					children: "Plans"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-2 max-w-3xl font-syne text-4xl font-bold tracking-tight md:text-5xl",
					children: "A field kit now. A practice desk when you need seats."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 max-w-2xl text-sm text-muted md:text-base",
					children: "Field is fully usable in this preview. Practice and Atelier are the commercial shape — request a seat and it stays with this browser. Nothing is charged."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-8 grid gap-3 lg:grid-cols-3",
					children: TIERS.map((tier) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: "flex flex-col rounded-2xl border border-line bg-surface p-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-syne text-2xl font-bold",
								children: tier.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm font-medium text-lime",
								children: tier.price
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 text-sm text-muted",
								children: tier.detail
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "mt-4 space-y-2 text-sm text-fg",
								children: tier.points.map((point) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: point }, point))
							})
						]
					}, tier.name))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: submit,
					className: "mt-10 max-w-xl rounded-2xl border border-line p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-syne text-xl font-semibold",
							children: "Request a practice seat"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "mt-4 block text-xs text-faint",
							htmlFor: "studio-name",
							children: "Studio"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							id: "studio-name",
							value: studio,
							onChange: (event) => setStudio(event.target.value),
							className: "mt-1 h-11 w-full rounded-xl border border-line bg-raised px-3 text-sm text-fg outline-none"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "mt-3 block text-xs text-faint",
							htmlFor: "studio-email",
							children: "Email"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							id: "studio-email",
							value: email,
							onChange: (event) => setEmail(event.target.value),
							inputMode: "email",
							autoComplete: "email",
							className: "mt-1 h-11 w-full rounded-xl border border-line bg-raised px-3 text-sm text-fg outline-none"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "mt-3 block text-xs text-faint",
							htmlFor: "studio-note",
							children: "Note"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							id: "studio-note",
							value: note,
							onChange: (event) => setNote(event.target.value),
							rows: 3,
							className: "mt-1 w-full rounded-xl border border-line bg-raised px-3 py-2 text-sm text-fg outline-none"
						}),
						error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-sm text-lime",
							children: error
						}) : null,
						saved ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-sm text-lime",
							children: "Request kept on this device. Nothing was sent or charged."
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "submit",
							className: "gold-fill mt-4 h-12 rounded-full px-6 text-sm font-semibold text-[#2a1c0c]",
							children: "Keep this request"
						})
					]
				}),
				requests.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-6 max-w-xl space-y-2",
					children: requests.map((request) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "rounded-xl border border-line px-3 py-2 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-fg",
								children: request.studio
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-muted",
								children: request.email
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-faint",
								suppressHydrationWarning: true,
								children: [
									request.note,
									" · ",
									formatWhen(request.at)
								]
							})
						]
					}, request.id))
				}) : null
			]
		})
	});
}
export { PlansPage as component };
