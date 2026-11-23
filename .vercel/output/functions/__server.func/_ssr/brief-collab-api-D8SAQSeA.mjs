import { t as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-A6pJPYTF.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/brief-collab-api-D8SAQSeA.js
var createSharedBriefFn_createServerFn_handler = createServerRpc({
	id: "b1e5a93d91e1f0383b9cf47e2c358caaf747eb177f831af247cdae577cc394cb",
	name: "createSharedBriefFn",
	filename: "src/lib/brief-collab-api.ts"
}, (opts) => createSharedBriefFn.__executeServer(opts));
var createSharedBriefFn = createServerFn({ method: "POST" }).validator((data) => data).handler(createSharedBriefFn_createServerFn_handler, async ({ data }) => {
	const { createSharedBriefRecord } = await import("./brief-collab.server-C-IJPx7K.mjs");
	return createSharedBriefRecord(data);
});
var updateSharedBriefFn_createServerFn_handler = createServerRpc({
	id: "5dc654f5aa22c10eda96aad51cda1b31b16fa38620951de3a903fa05f3f07dd7",
	name: "updateSharedBriefFn",
	filename: "src/lib/brief-collab-api.ts"
}, (opts) => updateSharedBriefFn.__executeServer(opts));
var updateSharedBriefFn = createServerFn({ method: "POST" }).validator((data) => data).handler(updateSharedBriefFn_createServerFn_handler, async ({ data }) => {
	const { updateSharedBriefRecord } = await import("./brief-collab.server-C-IJPx7K.mjs");
	return updateSharedBriefRecord(data);
});
var getSharedBriefFn_createServerFn_handler = createServerRpc({
	id: "1f4114a7061edf88ee606090d78afb5715fd66c12663e4d1d39293404f81c4e1",
	name: "getSharedBriefFn",
	filename: "src/lib/brief-collab-api.ts"
}, (opts) => getSharedBriefFn.__executeServer(opts));
var getSharedBriefFn = createServerFn({ method: "POST" }).validator((data) => data).handler(getSharedBriefFn_createServerFn_handler, async ({ data }) => {
	const { getSharedBriefRecord } = await import("./brief-collab.server-C-IJPx7K.mjs");
	return getSharedBriefRecord(data.shareId);
});
var addBriefCommentFn_createServerFn_handler = createServerRpc({
	id: "dbaa0459f2b393dbd53ef2bfda3d9ba7a159bc442cbdfe5ca0412cfa81062107",
	name: "addBriefCommentFn",
	filename: "src/lib/brief-collab-api.ts"
}, (opts) => addBriefCommentFn.__executeServer(opts));
var addBriefCommentFn = createServerFn({ method: "POST" }).validator((data) => data).handler(addBriefCommentFn_createServerFn_handler, async ({ data }) => {
	const { addBriefCommentRecord } = await import("./brief-collab.server-C-IJPx7K.mjs");
	return addBriefCommentRecord(data);
});
var toggleBriefCommentStatusFn_createServerFn_handler = createServerRpc({
	id: "2ecb14625c072bb8b60982f26f46335537b9e5209ecb2ea0af4d3b67f7c65c51",
	name: "toggleBriefCommentStatusFn",
	filename: "src/lib/brief-collab-api.ts"
}, (opts) => toggleBriefCommentStatusFn.__executeServer(opts));
var toggleBriefCommentStatusFn = createServerFn({ method: "POST" }).validator((data) => data).handler(toggleBriefCommentStatusFn_createServerFn_handler, async ({ data }) => {
	const { toggleBriefCommentStatusRecord } = await import("./brief-collab.server-C-IJPx7K.mjs");
	return toggleBriefCommentStatusRecord(data);
});
var deleteBriefCommentFn_createServerFn_handler = createServerRpc({
	id: "ff36cea5dc2f3591bf4aa5c1f7548e2d101a5c6e935a1acc3292dbe379511d59",
	name: "deleteBriefCommentFn",
	filename: "src/lib/brief-collab-api.ts"
}, (opts) => deleteBriefCommentFn.__executeServer(opts));
var deleteBriefCommentFn = createServerFn({ method: "POST" }).validator((data) => data).handler(deleteBriefCommentFn_createServerFn_handler, async ({ data }) => {
	const { deleteBriefCommentRecord } = await import("./brief-collab.server-C-IJPx7K.mjs");
	return deleteBriefCommentRecord(data);
});
//#endregion
export { addBriefCommentFn_createServerFn_handler, createSharedBriefFn_createServerFn_handler, deleteBriefCommentFn_createServerFn_handler, getSharedBriefFn_createServerFn_handler, toggleBriefCommentStatusFn_createServerFn_handler, updateSharedBriefFn_createServerFn_handler };
