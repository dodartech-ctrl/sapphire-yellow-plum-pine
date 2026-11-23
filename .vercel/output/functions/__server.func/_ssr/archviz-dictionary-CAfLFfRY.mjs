//#region node_modules/.nitro/vite/services/ssr/assets/archviz-dictionary-CAfLFfRY.js
var prompt_blocks_default = /*#__PURE__*/ JSON.parse("[{\"id\":\"goal\",\"en\":\"Task\",\"category\":\"Quality\",\"section\":\"GOAL\",\"text\":\"Create a photorealistic architectural image from the supplied render.\",\"parameters\":{},\"conflicts\":[]},{\"id\":\"source\",\"en\":\"Source Render\",\"category\":\"Geometry\",\"section\":\"SOURCE / INPUT\",\"text\":\"Use the source render as the authority for geometry, camera and composition.\",\"parameters\":{},\"conflicts\":[]},{\"id\":\"geometry\",\"en\":\"Geometry Lock\",\"category\":\"Geometry\",\"section\":\"MUST PRESERVE\",\"text\":\"Preserve the original architectural geometry, camera position, building proportions, floor count and facade openings.\",\"parameters\":{},\"conflicts\":[]},{\"id\":\"windows\",\"en\":\"Preserve Windows\",\"category\":\"Geometry\",\"section\":\"MUST PRESERVE\",\"text\":\"Keep all windows, glazing, frames and balcony openings unchanged.\",\"parameters\":{},\"conflicts\":[]},{\"id\":\"facade\",\"en\":\"Facade Material\",\"category\":\"Materials\",\"section\":\"ALLOWED CHANGES\",\"text\":\"Change only the opaque exterior wall material within the supplied facade mask. Preserve all opening boundaries.\",\"parameters\":{},\"conflicts\":[\"polish\"]},{\"id\":\"brick\",\"en\":\"Old Brick\",\"category\":\"Materials\",\"section\":\"MATERIAL / SUBJECT\",\"text\":\"Use aged red brick with {{scale}}, {{joints}}, {{roughness}} and {{weathering}}.\",\"parameters\":{\"scale\":\"realistic brick dimensions\",\"joints\":\"recessed mortar joints\",\"roughness\":\"matte surface roughness\",\"weathering\":\"subtle localized weathering\"},\"conflicts\":[\"limestone\"]},{\"id\":\"limestone\",\"en\":\"Weathered Limestone\",\"category\":\"Materials\",\"section\":\"MATERIAL / SUBJECT\",\"text\":\"Use weathered limestone with {{scale}}, {{joints}}, {{roughness}} and {{weathering}}.\",\"parameters\":{\"scale\":\"natural block scale\",\"joints\":\"fine mortar joints\",\"roughness\":\"matte mineral roughness\",\"weathering\":\"subtle edge erosion\"},\"conflicts\":[\"brick\"]},{\"id\":\"overcast\",\"en\":\"Overcast Day\",\"category\":\"Lighting\",\"section\":\"LIGHT / ATMOSPHERE\",\"text\":\"Use overcast daylight with soft diffused shadows.\",\"parameters\":{},\"conflicts\":[\"night\",\"golden-hour\",\"blue-hour\",\"early-morning\",\"bright-midday\",\"late-afternoon\",\"twilight\"]},{\"id\":\"night\",\"en\":\"Night\",\"category\":\"Lighting\",\"section\":\"LIGHT / ATMOSPHERE\",\"text\":\"Create a night atmosphere with plausible illumination from existing fixtures only.\",\"parameters\":{},\"conflicts\":[\"overcast\",\"golden-hour\",\"blue-hour\",\"early-morning\",\"bright-midday\",\"late-afternoon\",\"twilight\"]},{\"id\":\"wet\",\"en\":\"Wet Surface\",\"category\":\"Atmosphere\",\"section\":\"LIGHT / ATMOSPHERE\",\"text\":\"Apply subtle dampness and physically plausible reflections to ground surfaces only; preserve their boundaries.\",\"parameters\":{},\"conflicts\":[]},{\"id\":\"autumn\",\"en\":\"Autumn Atmosphere\",\"category\":\"Landscape\",\"section\":\"LIGHT / ATMOSPHERE\",\"text\":\"Shift existing foliage to natural autumn colors without changing plant count, placement or silhouette.\",\"parameters\":{},\"conflicts\":[]},{\"id\":\"photo\",\"en\":\"Commercial Photography\",\"category\":\"Camera\",\"section\":\"CAMERA / PHOTOGRAPHY\",\"text\":\"Use restrained commercial architectural photography grading, natural dynamic range and believable material response. Preserve the source perspective and framing.\",\"parameters\":{},\"conflicts\":[]},{\"id\":\"exclude\",\"en\":\"Negative / Exclusions\",\"category\":\"Negative / Restrictions\",\"section\":\"RESTRICTIONS\",\"text\":\"Do not add or remove architectural elements. No extra floors, moved windows, warped edges, invented balconies, text or watermarks.\",\"parameters\":{},\"conflicts\":[]},{\"id\":\"qc\",\"en\":\"Strict QC\",\"category\":\"Quality\",\"section\":\"QC\",\"text\":\"Check against the source: identical floor count, opening positions, silhouettes, camera and perspective; clean mask boundaries and no texture spill. Reject results with geometry drift.\",\"parameters\":{},\"conflicts\":[]},{\"id\":\"road\",\"en\":\"Road / Sidewalk\",\"category\":\"Materials\",\"section\":\"ALLOWED CHANGES\",\"text\":\"Refine existing pavement texture, joints and wear only inside the ground mask. Preserve curbs, road width and paving boundaries.\",\"parameters\":{},\"conflicts\":[\"polish\"]},{\"id\":\"greenery\",\"en\":\"Greenery\",\"category\":\"Landscape\",\"section\":\"ALLOWED CHANGES\",\"text\":\"Refine existing vegetation inside its mask. Preserve species intent, plant count, placement and overall silhouette. Do not add trees.\",\"parameters\":{},\"conflicts\":[\"polish\"]},{\"id\":\"people\",\"en\":\"People\",\"category\":\"People\",\"section\":\"ALLOWED CHANGES\",\"text\":\"Edit people only inside the supplied people mask. Match source perspective, scale, lighting and contact shadows. Preserve surrounding architecture.\",\"parameters\":{},\"conflicts\":[\"polish\"]},{\"id\":\"interior\",\"en\":\"Interior\",\"category\":\"Quality\",\"section\":\"GOAL\",\"text\":\"Refine the supplied interior render to photographic realism while preserving the layout and furniture placement.\",\"parameters\":{},\"conflicts\":[]},{\"id\":\"polish\",\"en\":\"Final Polish\",\"category\":\"Atmosphere\",\"section\":\"ALLOWED CHANGES\",\"text\":\"Adjust tonal balance, highlight rolloff and atmospheric depth only. Use the reference for mood, not geometry or new objects.\",\"parameters\":{},\"conflicts\":[\"facade\",\"road\",\"greenery\",\"people\"]},{\"id\":\"mask\",\"en\":\"Mask\",\"category\":\"AI terminology\",\"section\":\"SOURCE / INPUT\",\"text\":\"Treat the supplied mask as the edit boundary. Preserve all pixels outside the intended editable region as closely as the editing system allows.\",\"parameters\":{},\"conflicts\":[]},{\"id\":\"golden-hour\",\"en\":\"Golden Hour\",\"category\":\"Lighting\",\"section\":\"LIGHT / ATMOSPHERE\",\"text\":\"Use warm low-angle golden-hour sunlight with elongated natural shadows, controlled highlights and believable warm-to-cool color separation.\",\"parameters\":{},\"conflicts\":[\"overcast\",\"night\",\"blue-hour\",\"early-morning\",\"bright-midday\",\"late-afternoon\",\"twilight\"]},{\"id\":\"blue-hour\",\"en\":\"Blue Hour\",\"category\":\"Lighting\",\"section\":\"LIGHT / ATMOSPHERE\",\"text\":\"Use blue-hour ambient light with a cool sky, restrained contrast and plausible warm illumination from existing fixtures only.\",\"parameters\":{},\"conflicts\":[\"overcast\",\"night\",\"golden-hour\",\"early-morning\",\"bright-midday\",\"late-afternoon\",\"twilight\"]},{\"id\":\"early-morning\",\"en\":\"Early Morning\",\"category\":\"Lighting\",\"section\":\"LIGHT / ATMOSPHERE\",\"text\":\"Use clear early-morning daylight with a low sun angle, gentle contrast and fresh neutral-to-cool ambient light.\",\"parameters\":{},\"conflicts\":[\"overcast\",\"night\",\"golden-hour\",\"blue-hour\",\"bright-midday\",\"late-afternoon\",\"twilight\"]},{\"id\":\"bright-midday\",\"en\":\"Bright Midday\",\"category\":\"Lighting\",\"section\":\"LIGHT / ATMOSPHERE\",\"text\":\"Use bright midday daylight with a high sun angle, crisp physically plausible shadows and controlled highlight clipping.\",\"parameters\":{},\"conflicts\":[\"overcast\",\"night\",\"golden-hour\",\"blue-hour\",\"early-morning\",\"late-afternoon\",\"twilight\"]},{\"id\":\"late-afternoon\",\"en\":\"Late Afternoon\",\"category\":\"Lighting\",\"section\":\"LIGHT / ATMOSPHERE\",\"text\":\"Use late-afternoon daylight with a moderately low sun angle, warm directional light and natural shadow depth.\",\"parameters\":{},\"conflicts\":[\"overcast\",\"night\",\"golden-hour\",\"blue-hour\",\"early-morning\",\"bright-midday\",\"twilight\"]},{\"id\":\"twilight\",\"en\":\"Twilight\",\"category\":\"Lighting\",\"section\":\"LIGHT / ATMOSPHERE\",\"text\":\"Use twilight ambient light after sunset with a luminous cool sky and plausible illumination from existing fixtures only.\",\"parameters\":{},\"conflicts\":[\"overcast\",\"night\",\"golden-hour\",\"blue-hour\",\"early-morning\",\"bright-midday\",\"late-afternoon\"]},{\"id\":\"soft-diffused-light\",\"en\":\"Soft Diffused Light\",\"category\":\"Lighting\",\"section\":\"LIGHT / ATMOSPHERE\",\"text\":\"Use broad soft diffused illumination with gentle shadow transitions and restrained specular highlights.\",\"parameters\":{},\"conflicts\":[]},{\"id\":\"hard-sunlight\",\"en\":\"Hard Sunlight\",\"category\":\"Lighting\",\"section\":\"LIGHT / ATMOSPHERE\",\"text\":\"Use strong direct sunlight with crisp shadow edges while preserving physically plausible exposure and material response.\",\"parameters\":{},\"conflicts\":[]},{\"id\":\"side-light\",\"en\":\"Side Light\",\"category\":\"Lighting\",\"section\":\"LIGHT / ATMOSPHERE\",\"text\":\"Emphasize existing surface relief with directional side lighting while preserving the source geometry and camera.\",\"parameters\":{},\"conflicts\":[]},{\"id\":\"backlight\",\"en\":\"Backlight\",\"category\":\"Lighting\",\"section\":\"LIGHT / ATMOSPHERE\",\"text\":\"Use controlled architectural backlighting with believable edge separation and preserved facade readability.\",\"parameters\":{},\"conflicts\":[]},{\"id\":\"warm-interior-glow\",\"en\":\"Warm Interior Glow\",\"category\":\"Lighting\",\"section\":\"LIGHT / ATMOSPHERE\",\"text\":\"Add restrained warm interior illumination only behind existing glazed openings; do not create new windows, fixtures or interior geometry.\",\"parameters\":{},\"conflicts\":[]},{\"id\":\"clear-air\",\"en\":\"Clear Air\",\"category\":\"Atmosphere\",\"section\":\"LIGHT / ATMOSPHERE\",\"text\":\"Use clear dry air with high but natural visibility, restrained atmospheric scattering and no artificial haze.\",\"parameters\":{},\"conflicts\":[]},{\"id\":\"light-haze\",\"en\":\"Light Haze\",\"category\":\"Atmosphere\",\"section\":\"LIGHT / ATMOSPHERE\",\"text\":\"Add subtle distance haze for atmospheric depth without obscuring facade detail or changing silhouettes.\",\"parameters\":{},\"conflicts\":[]},{\"id\":\"light-mist\",\"en\":\"Light Mist\",\"category\":\"Atmosphere\",\"section\":\"LIGHT / ATMOSPHERE\",\"text\":\"Add a thin natural mist concentrated in depth and low areas; keep the primary architecture clearly readable.\",\"parameters\":{},\"conflicts\":[]},{\"id\":\"after-rain\",\"en\":\"After Rain\",\"category\":\"Atmosphere\",\"section\":\"LIGHT / ATMOSPHERE\",\"text\":\"Create a subtle after-rain atmosphere with clean humid air and localized residual moisture; do not imply active rainfall.\",\"parameters\":{},\"conflicts\":[]},{\"id\":\"dramatic-clouds\",\"en\":\"Dramatic Clouds\",\"category\":\"Atmosphere\",\"section\":\"LIGHT / ATMOSPHERE\",\"text\":\"Use a believable layered cloudscape with controlled drama; keep the architecture as the visual priority.\",\"parameters\":{},\"conflicts\":[]},{\"id\":\"subtle-aerial-perspective\",\"en\":\"Aerial Perspective\",\"category\":\"Atmosphere\",\"section\":\"LIGHT / ATMOSPHERE\",\"text\":\"Increase atmospheric depth subtly with distance-dependent contrast and saturation falloff; preserve foreground clarity.\",\"parameters\":{},\"conflicts\":[]},{\"id\":\"microdetail\",\"en\":\"Material Microdetail\",\"category\":\"Materials\",\"section\":\"MATERIAL / SUBJECT\",\"text\":\"Enhance physically plausible fine surface microdetail without changing object shape, edges, joints or architectural boundaries.\",\"parameters\":{},\"conflicts\":[]},{\"id\":\"roughness-variation\",\"en\":\"Roughness Variation\",\"category\":\"Materials\",\"section\":\"MATERIAL / SUBJECT\",\"text\":\"Add subtle non-uniform roughness variation appropriate to the existing material, avoiding glossy noise and exaggerated contrast.\",\"parameters\":{},\"conflicts\":[]},{\"id\":\"subtle-weathering\",\"en\":\"Subtle Weathering\",\"category\":\"Materials\",\"section\":\"MATERIAL / SUBJECT\",\"text\":\"Add restrained localized weathering consistent with exposure, runoff and contact zones; avoid uniform procedural dirt.\",\"parameters\":{},\"conflicts\":[]},{\"id\":\"edge-wear\",\"en\":\"Natural Edge Wear\",\"category\":\"Materials\",\"section\":\"MATERIAL / SUBJECT\",\"text\":\"Add very subtle physically plausible wear to exposed existing edges only; do not round, chip or reshape geometry.\",\"parameters\":{},\"conflicts\":[]},{\"id\":\"stone-detail\",\"en\":\"Natural Stone Detail\",\"category\":\"Materials\",\"section\":\"MATERIAL / SUBJECT\",\"text\":\"Enhance natural mineral variation, pores and fine tonal variation at realistic scale while preserving existing stone joints and block layout.\",\"parameters\":{},\"conflicts\":[]},{\"id\":\"concrete-detail\",\"en\":\"Architectural Concrete\",\"category\":\"Materials\",\"section\":\"MATERIAL / SUBJECT\",\"text\":\"Use realistic architectural concrete response with restrained pores, subtle tonal variation and physically plausible roughness at true scale.\",\"parameters\":{},\"conflicts\":[]},{\"id\":\"glass-realism\",\"en\":\"Glass Realism\",\"category\":\"Materials\",\"section\":\"MATERIAL / SUBJECT\",\"text\":\"Refine existing glazing with believable reflection, transmission and subtle roughness variation while preserving every frame and opening.\",\"parameters\":{},\"conflicts\":[]},{\"id\":\"pavement-detail\",\"en\":\"Pavement Microdetail\",\"category\":\"Materials\",\"section\":\"MATERIAL / SUBJECT\",\"text\":\"Enhance existing pavement with realistic aggregate, joints, subtle wear and roughness variation at correct scale; preserve all paving boundaries.\",\"parameters\":{},\"conflicts\":[]},{\"id\":\"natural-greenery-detail\",\"en\":\"Natural Greenery Detail\",\"category\":\"Landscape\",\"section\":\"MATERIAL / SUBJECT\",\"text\":\"Increase natural leaf, grass and branch detail within existing vegetation while preserving plant count, placement and silhouette.\",\"parameters\":{},\"conflicts\":[]},{\"id\":\"spring\",\"en\":\"Spring Atmosphere\",\"category\":\"Landscape\",\"section\":\"LIGHT / ATMOSPHERE\",\"text\":\"Shift existing vegetation toward fresh natural spring growth without changing plant count, placement or silhouette.\",\"parameters\":{},\"conflicts\":[]},{\"id\":\"summer\",\"en\":\"Summer Atmosphere\",\"category\":\"Landscape\",\"section\":\"LIGHT / ATMOSPHERE\",\"text\":\"Keep existing vegetation in healthy natural summer condition with varied greens and no change to plant count, placement or silhouette.\",\"parameters\":{},\"conflicts\":[]},{\"id\":\"winter\",\"en\":\"Winter Atmosphere\",\"category\":\"Landscape\",\"section\":\"LIGHT / ATMOSPHERE\",\"text\":\"Shift the existing scene toward a restrained winter condition while preserving architecture, plant placement and silhouettes; do not add snow unless separately requested.\",\"parameters\":{},\"conflicts\":[]},{\"id\":\"highlight-rolloff\",\"en\":\"Soft Highlight Rolloff\",\"category\":\"Quality\",\"section\":\"CAMERA / PHOTOGRAPHY\",\"text\":\"Use smooth photographic highlight rolloff that retains bright-surface detail and avoids harsh digital clipping.\",\"parameters\":{},\"conflicts\":[]},{\"id\":\"natural-contrast\",\"en\":\"Natural Contrast\",\"category\":\"Quality\",\"section\":\"CAMERA / PHOTOGRAPHY\",\"text\":\"Use restrained photographic contrast with readable shadows, controlled highlights and no crushed blacks.\",\"parameters\":{},\"conflicts\":[]},{\"id\":\"neutral-color\",\"en\":\"Neutral Color Balance\",\"category\":\"Quality\",\"section\":\"CAMERA / PHOTOGRAPHY\",\"text\":\"Maintain a natural neutral color balance with believable material colors and no excessive global color cast.\",\"parameters\":{},\"conflicts\":[]},{\"id\":\"premium-real-estate\",\"en\":\"Premium Real Estate Look\",\"category\":\"Camera\",\"section\":\"CAMERA / PHOTOGRAPHY\",\"text\":\"Use polished high-end real-estate photography aesthetics with natural exposure, clean color separation and restrained processing; preserve source framing.\",\"parameters\":{},\"conflicts\":[]},{\"id\":\"editorial-architecture\",\"en\":\"Editorial Architecture Look\",\"category\":\"Camera\",\"section\":\"CAMERA / PHOTOGRAPHY\",\"text\":\"Use refined editorial architectural photography aesthetics with material clarity, natural tonal hierarchy and minimal stylization; preserve source framing.\",\"parameters\":{},\"conflicts\":[]},{\"id\":\"final-cleanup\",\"en\":\"Final Cleanup\",\"category\":\"Quality\",\"section\":\"QC\",\"text\":\"Remove generation artifacts, texture spill, halos, edge contamination and implausible local detail while preserving intended image content.\",\"parameters\":{},\"conflicts\":[]},{\"id\":\"asset-goal\",\"en\":\"Object / 3D Asset\",\"category\":\"Object / 3D Asset\",\"section\":\"GOAL\",\"text\":\"Create a photorealistic presentation image of a single {{object}} for a production brief. This is an image prompt, not a request for a generated 3D mesh.\",\"parameters\":{\"object\":\"architectural lamp\"},\"conflicts\":[]},{\"id\":\"asset-reference\",\"en\":\"Object Reference\",\"category\":\"Object / 3D Asset\",\"section\":\"SOURCE / INPUT\",\"text\":\"Use the supplied object reference as the authority for design intent, silhouette, construction and proportions. Do not borrow unrelated objects or scenery.\",\"parameters\":{},\"conflicts\":[]},{\"id\":\"asset-shape\",\"en\":\"Object Shape Lock\",\"category\":\"Object / 3D Asset\",\"section\":\"MUST PRESERVE\",\"text\":\"Preserve the referenced object silhouette, dimensions, proportions, component count, joints and construction details. Do not invent, remove or reposition parts.\",\"parameters\":{},\"conflicts\":[]},{\"id\":\"asset-material\",\"en\":\"Object Material\",\"category\":\"Object / 3D Asset\",\"section\":\"MATERIAL / SUBJECT\",\"text\":\"Present the object in {{material}} with physically plausible material response and true-scale surface detail. Keep the specified construction and shape unchanged.\",\"parameters\":{\"material\":\"matte brushed brass\"},\"conflicts\":[]},{\"id\":\"asset-view\",\"en\":\"Object Camera / View\",\"category\":\"Object / 3D Asset\",\"section\":\"CAMERA / PHOTOGRAPHY\",\"text\":\"Show the complete object in {{view}} with believable perspective, consistent scale and no cropped parts.\",\"parameters\":{\"view\":\"a three-quarter product view\"},\"conflicts\":[]},{\"id\":\"asset-background\",\"en\":\"Object Background\",\"category\":\"Object / 3D Asset\",\"section\":\"RESTRICTIONS\",\"text\":\"Place the object against {{background}}. Avoid unrelated props, text and watermarks; retain a plausible contact shadow.\",\"parameters\":{\"background\":\"a neutral graphite studio background\"},\"conflicts\":[]},{\"id\":\"asset-qc\",\"en\":\"Object QC\",\"category\":\"Object / 3D Asset\",\"section\":\"QC\",\"text\":\"Compare with the object reference: identical silhouette, proportions, component count and construction; consistent material scale, readable surface detail, clean edges, complete framing and plausible light. Reject invented parts or shape drift.\",\"parameters\":{},\"conflicts\":[]},{\"id\":\"video-arch-goal\",\"en\":\"Architectural video\",\"category\":\"Video\",\"section\":\"GOAL\",\"text\":\"Create a photorealistic architectural image-to-video shot lasting {{duration}} from the supplied image. Produce a single continuous shot, not a redesigned scene.\",\"parameters\":{\"duration\":\"5 seconds\"},\"conflicts\":[]},{\"id\":\"video-object-goal\",\"en\":\"Object video\",\"category\":\"Video\",\"section\":\"GOAL\",\"text\":\"Create a photorealistic product image-to-video shot of the referenced object lasting {{duration}}. Keep the complete object readable in a single continuous shot.\",\"parameters\":{\"duration\":\"5 seconds\"},\"conflicts\":[]},{\"id\":\"video-reference\",\"en\":\"Video first frame\",\"category\":\"Video\",\"section\":\"SOURCE / INPUT\",\"text\":\"Use the supplied image as the first-frame authority for design, proportions, materials and lighting. Reveal only surfaces supported by the reference; do not invent unseen architecture or object parts.\",\"parameters\":{},\"conflicts\":[]},{\"id\":\"video-arch-preserve\",\"en\":\"Video architecture preservation\",\"category\":\"Video\",\"section\":\"MUST PRESERVE\",\"text\":\"Preserve building proportions, floor count, facade openings, structural edges and the placement of all existing objects throughout the shot. Perspective may change only as a coherent result of the requested camera movement.\",\"parameters\":{},\"conflicts\":[]},{\"id\":\"video-motion\",\"en\":\"Video camera movement\",\"category\":\"Video\",\"section\":\"CAMERA / PHOTOGRAPHY\",\"text\":\"Camera movement: {{movement}}. Use slow smooth physically coherent motion, stable perspective and gentle acceleration. No cuts, abrupt zooms, camera shake or movement revealing unsupported surfaces.\",\"parameters\":{\"movement\":\"a subtle forward dolly\"},\"conflicts\":[]},{\"id\":\"video-stability\",\"en\":\"Video temporal QC\",\"category\":\"Video\",\"section\":\"QC\",\"text\":\"Maintain temporal consistency of geometry, textures, lighting and object identity across every frame. No flicker, morphing, drifting openings, duplicated parts or spontaneous objects. Keep the source lighting stable unless explicitly requested otherwise. Reject frames with geometry drift or invented detail.\",\"parameters\":{},\"conflicts\":[]},{\"id\":\"environment-extension\",\"en\":\"Environment Extension\",\"category\":\"Landscape\",\"section\":\"ALLOWED CHANGES\",\"text\":\"Extend the environment only inside the supplied editable context mask. Preserve the primary building and all protected pixels; do not expand the canvas or change the camera.\",\"parameters\":{},\"conflicts\":[\"polish\",\"exclude\"]},{\"id\":\"context-description\",\"en\":\"Context Description\",\"category\":\"Landscape\",\"section\":\"MATERIAL / SUBJECT\",\"text\":\"Add {{context}} within the editable region. Follow supplied site references and visible ground connections; keep the primary architecture as the visual priority.\",\"parameters\":{\"context\":\"restrained urban surroundings with distant neighboring buildings and planting\"},\"conflicts\":[]},{\"id\":\"perspective-scale-match\",\"en\":\"Perspective and Scale Match\",\"category\":\"Camera\",\"section\":\"CAMERA / PHOTOGRAPHY\",\"text\":\"Match added elements to the source horizon, vanishing directions, camera height, perspective and depth-dependent scale. Preserve existing lens projection and vertical-line treatment; ground every added object without shifting the source framing.\",\"parameters\":{},\"conflicts\":[\"video-motion\"]},{\"id\":\"match-source-lighting\",\"en\":\"Source Lighting Match\",\"category\":\"Lighting\",\"section\":\"LIGHT / ATMOSPHERE\",\"text\":\"Match new context to the source light direction, shadow softness, color temperature and exposure. Add plausible contact shadows and local reflections; do not relight the protected architecture.\",\"parameters\":{},\"conflicts\":[\"night\"]},{\"id\":\"context-restrictions\",\"en\":\"Context Restrictions\",\"category\":\"Negative / Restrictions\",\"section\":\"RESTRICTIONS\",\"text\":\"New context elements are permitted only inside the editable mask. Keep the primary building, openings, silhouette and protected site layout unchanged. Do not cover key entrances, invent signage or add text and watermarks.\",\"parameters\":{},\"conflicts\":[]},{\"id\":\"environment-qc\",\"en\":\"Environment QC\",\"category\":\"Quality\",\"section\":\"QC\",\"text\":\"Check added context against the source: coherent horizon and perspective, realistic scale, grounded objects, correct occlusions, matching light and clean mask edges. Reject changes to protected architecture or site boundaries.\",\"parameters\":{},\"conflicts\":[]},{\"id\":\"night-windows\",\"en\":\"Night Window Lighting\",\"category\":\"Lighting\",\"section\":\"LIGHT / ATMOSPHERE\",\"text\":\"Illuminate a restrained irregular selection of existing windows from plausible interior sources only. Preserve frames and openings; keep some rooms dark, retain glazing reflections and avoid uniform glowing facades or invented interior details.\",\"parameters\":{},\"conflicts\":[\"warm-interior-glow\"]},{\"id\":\"night-street-sources\",\"en\":\"Existing Street Lights\",\"category\":\"Lighting\",\"section\":\"LIGHT / ATMOSPHERE\",\"text\":\"Light the street and surrounding ground only from visible existing street poles and luminaires. Match each light pool and shadow to its fixture position and direction with natural falloff; do not add poles, fixtures or unsupported pools of light.\",\"parameters\":{},\"conflicts\":[]},{\"id\":\"night-headlights\",\"en\":\"Existing Vehicle Headlights\",\"category\":\"Lighting\",\"section\":\"LIGHT / ATMOSPHERE\",\"text\":\"Use headlights only on visible existing vehicles whose lamps face the scene. Align beams, road reflections and local illumination with vehicle orientation; preserve vehicle count and position. No floating beams, invented cars or excessive bloom.\",\"parameters\":{},\"conflicts\":[]},{\"id\":\"night-source-qc\",\"en\":\"Night Source QC\",\"category\":\"Quality\",\"section\":\"QC\",\"text\":\"Trace every local light pool, cast shadow and reflection to a visible existing fixture, illuminated window or vehicle lamp. Keep unlit areas plausibly dark with restrained night ambient light; reject invented emitters, glowing surfaces and inconsistent shadows.\",\"parameters\":{},\"conflicts\":[]},{\"id\":\"add-people\",\"en\":\"Add People\",\"category\":\"People\",\"section\":\"ALLOWED CHANGES\",\"text\":\"Add {{count}} new people only inside the supplied people insertion mask, with {{activity}}. Preserve existing people and architecture; use natural spacing and keep entrances and key facade details readable.\",\"parameters\":{\"count\":\"two\",\"activity\":\"casual walking\"},\"conflicts\":[\"people\",\"polish\"]},{\"id\":\"people-integration\",\"en\":\"People Integration\",\"category\":\"People\",\"section\":\"MATERIAL / SUBJECT\",\"text\":\"Match added people to source perspective, depth-dependent scale, season and lighting. Place feet on the visible ground plane with believable contact shadows; use restrained everyday clothing and natural poses, without duplicating identities.\",\"parameters\":{},\"conflicts\":[]},{\"id\":\"add-people-qc\",\"en\":\"People Insertion QC\",\"category\":\"Quality\",\"section\":\"QC\",\"text\":\"Check the requested added-person count, anatomy, feet-ground contact, perspective, scale, shadows and occlusion. Reject floating feet, duplicated people, malformed limbs or changes outside the insertion mask.\",\"parameters\":{},\"conflicts\":[]},{\"id\":\"added-snow-cover\",\"en\":\"Snow Cover\",\"category\":\"Landscape\",\"section\":\"ALLOWED CHANGES\",\"text\":\"Add {{amount}} of settled snow only inside the supplied seasonal edit mask, with {{distribution}}. Follow existing ground contours and upward-facing surfaces. Preserve architecture, openings, curbs and site boundaries; keep entrances, walkways and vehicle access clear and readable. Do not add falling snow, reshape objects or conceal protected facade details.\",\"parameters\":{\"amount\":\"a light layer\",\"distribution\":\"localized natural accumulation on lawns and exposed ground, with cleared paths\"},\"conflicts\":[\"spring\",\"summer\",\"autumn\",\"autumn-fallen-leaves\"]},{\"id\":\"autumn-fallen-leaves\",\"en\":\"Autumn Fallen Leaves\",\"category\":\"Landscape\",\"section\":\"ALLOWED CHANGES\",\"text\":\"Add {{amount}} of fallen autumn leaves only inside the supplied seasonal edit mask, with {{distribution}}. Match leaf species, size, perspective and source lighting to existing vegetation. Use irregular wind-shaped clusters rather than a uniform carpet. Preserve paving, curbs, drainage, entrances and road markings; do not add trees or cover protected architecture.\",\"parameters\":{\"amount\":\"a sparse scattering\",\"distribution\":\"small clusters near existing trees, along curb edges and on lawns, with clear entrances and walking routes\"},\"conflicts\":[\"spring\",\"summer\",\"winter\"]},{\"id\":\"first-last-goal\",\"en\":\"First / Last Frame Video\",\"category\":\"Video\",\"section\":\"GOAL\",\"text\":\"Create a photorealistic architectural video lasting {{duration}} between the supplied first and last frames. Produce one continuous shot that starts at the first image and ends at the last image.\",\"parameters\":{\"duration\":\"5 seconds\"},\"conflicts\":[\"video-arch-goal\",\"video-object-goal\"]},{\"id\":\"first-last-reference\",\"en\":\"First and Last Frame References\",\"category\":\"Video\",\"section\":\"SOURCE / INPUT\",\"text\":\"Use the supplied first frame as the starting state and the supplied last frame as the target state. Both frames must depict the same architecture from the same camera with aligned framing, perspective and aspect ratio. Preserve their shared geometry; use the last frame only as authority for the explicitly requested changes. Do not invent unseen surfaces.\",\"parameters\":{},\"conflicts\":[\"video-reference\"]},{\"id\":\"first-last-transition\",\"en\":\"Controlled Frame Transition\",\"category\":\"Video\",\"section\":\"ALLOWED CHANGES\",\"text\":\"Transition description: {{transition}}. Change only the specified properties, progressively and coherently from the first-frame state to the last-frame state. Keep all other scene elements unchanged. Do not use a simple crossfade with doubled edges, sudden state changes, cuts or geometric morphing. Any lighting or seasonal change must follow the supplied endpoints without inventing intermediate objects.\",\"parameters\":{\"transition\":\"a gradual lighting change from the first frame to the last frame\"},\"conflicts\":[]},{\"id\":\"first-last-camera\",\"en\":\"Locked Transition Camera\",\"category\":\"Video\",\"section\":\"CAMERA / PHOTOGRAPHY\",\"text\":\"Keep the camera locked throughout the transition: identical position, focal length, framing, horizon and perspective in every frame. No dolly, pan, orbit, zoom, shake or reframing. Reject mismatched endpoint cameras rather than inventing a camera path.\",\"parameters\":{},\"conflicts\":[\"video-motion\"]},{\"id\":\"material-id-goal\",\"en\":\"Material ID Map\",\"category\":\"AI terminology\",\"section\":\"GOAL\",\"text\":\"Convert the supplied architectural render into a flat Material ID map for masking and downstream editing.\",\"parameters\":{},\"conflicts\":[]},{\"id\":\"material-id-preserve\",\"en\":\"Preserve Region Boundaries\",\"category\":\"Geometry\",\"section\":\"MUST PRESERVE\",\"text\":\"Preserve the exact source camera, silhouette, object boundaries, window openings, frames, curbs, paving borders, vegetation silhouettes and all visible architectural edges. Do not move, add, remove or redesign geometry.\",\"parameters\":{},\"conflicts\":[]},{\"id\":\"material-id-rules\",\"en\":\"Flat Material Regions\",\"category\":\"AI terminology\",\"section\":\"ALLOWED CHANGES\",\"text\":\"Assign one solid flat RGB color to each visually distinct material or surface class. Use the same color for the same material across light, shadow and repeated disconnected regions. Use different colors for different materials or surface classes.\",\"parameters\":{},\"conflicts\":[]},{\"id\":\"material-id-classes\",\"en\":\"Material Region Classes\",\"category\":\"Materials\",\"section\":\"MATERIAL / SUBJECT\",\"text\":\"Separate facade materials, glazing/windows, window and door frames, roof, metal, wood, concrete, stone, brick, road, paving, curb, vegetation, sky, water and people when visibly present. Keep distinct facade materials separate even when they belong to the same building.\",\"parameters\":{},\"conflicts\":[]},{\"id\":\"material-id-restrictions\",\"en\":\"Material ID Restrictions\",\"category\":\"Negative / Restrictions\",\"section\":\"RESTRICTIONS\",\"text\":\"Output only the flat Material ID map. No textures, lighting, shadows, gradients, reflections, glare, ambient occlusion, photographic detail, outlines, labels, text, legends, watermarks or decorative effects. Do not invent hidden materials.\",\"parameters\":{},\"conflicts\":[]},{\"id\":\"material-id-qc\",\"en\":\"Material ID QC\",\"category\":\"Quality\",\"section\":\"QC\",\"text\":\"Check that every pixel belongs to a clean flat region, repeated instances of the same material use the same RGB color, adjacent different materials use clearly different colors, and region boundaries match the source render without geometry drift.\",\"parameters\":{},\"conflicts\":[]},{\"id\":\"hdri-realism-positive\",\"en\":\"HDRI Realism\",\"category\":\"Lighting\",\"section\":\"LIGHT / ATMOSPHERE\",\"text\":\"Preserve original composition and architecture, enhance the image with realistic HDRI lighting, improve global illumination, reflections, dynamic range, highlight rolloff, shadow detail and material realism, keep the result photorealistic and balanced.\",\"parameters\":{},\"conflicts\":[]},{\"id\":\"hdri-realism-negative\",\"en\":\"HDRI Realism — Negative\",\"category\":\"Negative / Restrictions\",\"section\":\"RESTRICTIONS\",\"text\":\"No overexposure, no crushed shadows, no fake glow, no surreal lighting, no geometry changes, no camera changes, no extra objects, no warped reflections.\",\"parameters\":{},\"conflicts\":[]},{\"id\":\"hero-photo-clean-positive\",\"en\":\"HERO PHOTO CLEAN\",\"category\":\"Lighting\",\"section\":\"LIGHT / ATMOSPHERE\",\"text\":\"Preserve the original architecture, geometry, camera and composition. Create a premium high-end architectural visualization with clean realistic daylight, refined facade materials, rich but natural architectural depth, clear glazing, realistic reflections, controlled highlight rolloff, readable soft shadows, detailed natural landscaping and restrained commercial real-estate photography grading. Keep the result photorealistic, elegant, clean and balanced.\",\"parameters\":{},\"conflicts\":[]},{\"id\":\"hero-photo-clean-negative\",\"en\":\"HERO PHOTO CLEAN — Negative\",\"category\":\"Negative / Restrictions\",\"section\":\"RESTRICTIONS\",\"text\":\"No geometry changes, no altered facade proportions, no moved or redesigned windows, no extra architectural elements, no excessive darkness, no crushed shadows, no burned highlights, no artificial glow, no grunge, no apocalyptic mood, no oversaturation, no cartoon look, no distorted reflections.\",\"parameters\":{},\"conflicts\":[]},{\"id\":\"hero-photo-dramatic-positive\",\"en\":\"HERO PHOTO DRAMATIC\",\"category\":\"Lighting\",\"section\":\"LIGHT / ATMOSPHERE\",\"text\":\"Preserve the original architecture, geometry, camera and composition. Enhance the image into a dramatic premium architectural hero shot with strong but realistic directional daylight, pronounced architectural depth, refined material definition, elegant light-and-shadow separation, rich glazing reflections, controlled high dynamic range, detailed landscaping and cinematic atmospheric depth. Keep all lighting physically plausible and the architecture visually dominant.\",\"parameters\":{},\"conflicts\":[]},{\"id\":\"hero-photo-dramatic-negative\",\"en\":\"HERO PHOTO DRAMATIC — Negative\",\"category\":\"Negative / Restrictions\",\"section\":\"RESTRICTIONS\",\"text\":\"No geometry changes, no camera changes, no invented facade details, no extreme black shadows, no clipped highlights, no fake glow, no fantasy lighting, no excessive HDR halos, no surreal sky, no oversaturation, no grunge, no distorted windows or reflections.\",\"parameters\":{},\"conflicts\":[]},{\"id\":\"hero-sunset-gold-positive\",\"en\":\"HERO SUNSET GOLD\",\"category\":\"Lighting\",\"section\":\"LIGHT / ATMOSPHERE\",\"text\":\"Preserve the original architecture, geometry, camera and composition. Transform the lighting into a premium golden-hour architectural hero shot with warm low-angle sunlight, elegant warm highlights, cooler ambient shadow tones, realistic long soft-edged shadows, refined facade material response, natural glazing reflections, controlled dynamic range, subtle atmospheric depth and polished high-end real-estate photography aesthetics.\",\"parameters\":{},\"conflicts\":[]},{\"id\":\"hero-sunset-gold-negative\",\"en\":\"HERO SUNSET GOLD — Negative\",\"category\":\"Negative / Restrictions\",\"section\":\"RESTRICTIONS\",\"text\":\"No geometry changes, no camera changes, no orange color cast over the entire image, no burned sunlight, no black crushed shadows, no fake glow, no excessive lens flare, no fantasy sunset, no surreal colors, no extra objects, no distorted windows or reflections.\",\"parameters\":{},\"conflicts\":[]},{\"id\":\"custom-art-direction\",\"en\":\"Custom Art Direction\",\"category\":\"AI terminology\",\"section\":\"ALLOWED CHANGES\",\"text\":\"Additional art direction: {{instruction}}. Apply only where it does not contradict source architecture, camera, material identities or other protected constraints.\",\"parameters\":{\"instruction\":\"subtle realism and restrained photographic finishing\"},\"conflicts\":[]},{\"id\":\"custom-material\",\"en\":\"Custom Material\",\"category\":\"Materials\",\"section\":\"MATERIAL / SUBJECT\",\"text\":\"Refine the selected existing material: {{material}}. Desired treatment: {{treatment}}. Keep geometry, UV scale, joints, material-region boundaries and all unselected surfaces unchanged.\",\"parameters\":{\"material\":\"existing stone facade\",\"treatment\":\"natural fine pores and plausible roughness\"},\"conflicts\":[]},{\"id\":\"custom-light\",\"en\":\"Custom Lighting\",\"category\":\"Lighting\",\"section\":\"LIGHT / ATMOSPHERE\",\"text\":\"Set the lighting character to {{lighting}} while retaining physically plausible light sources, source geometry, camera, site and existing material assignments.\",\"parameters\":{\"lighting\":\"soft natural side daylight\"},\"conflicts\":[]},{\"id\":\"custom-atmosphere\",\"en\":\"Custom Atmosphere\",\"category\":\"Atmosphere\",\"section\":\"LIGHT / ATMOSPHERE\",\"text\":\"Apply {{atmosphere}} with physically credible depth and distance falloff. Preserve architectural silhouette, facade readability and the original camera.\",\"parameters\":{\"atmosphere\":\"subtle atmospheric haze\"},\"conflicts\":[]},{\"id\":\"custom-grading\",\"en\":\"Custom Color Grading\",\"category\":\"Camera\",\"section\":\"CAMERA / PHOTOGRAPHY\",\"text\":\"Apply {{grading}} as a restrained photographic grade without changing material identity, original objects or composition.\",\"parameters\":{\"grading\":\"neutral cinematic contrast and gentle highlight rolloff\"},\"conflicts\":[]},{\"id\":\"multi-reference-roles\",\"en\":\"Multi-Reference Roles\",\"category\":\"AI terminology\",\"section\":\"SOURCE / INPUT\",\"text\":\"Assign these input roles: {{roles}}. Never transfer unrelated architecture, objects or geometry from references; the source render remains the geometric authority.\",\"parameters\":{\"roles\":\"reference 1: lighting; reference 2: material; source render: geometry and camera\"},\"conflicts\":[]},{\"id\":\"reference-material\",\"en\":\"Reference Material\",\"category\":\"Materials\",\"section\":\"MATERIAL / SUBJECT\",\"text\":\"Use the supplied material reference only for physical texture, reflectance and surface variation within the selected existing material region; retain panel layout and architectural joints.\",\"parameters\":{},\"conflicts\":[]},{\"id\":\"reference-lighting\",\"en\":\"Reference Lighting\",\"category\":\"Lighting\",\"section\":\"LIGHT / ATMOSPHERE\",\"text\":\"Use the lighting reference only for direction, color temperature, contrast and shadow softness. Do not copy the referenced scene, geometry, camera or objects.\",\"parameters\":{},\"conflicts\":[]},{\"id\":\"photorealism-recovery\",\"en\":\"Photorealism Recovery\",\"category\":\"Quality\",\"section\":\"QC\",\"text\":\"Reduce CGI appearance through natural exposure, credible material response, measured microcontrast and restrained texture variation. Do not invent seams, wear, ornaments, objects or architecture.\",\"parameters\":{},\"conflicts\":[]},{\"id\":\"multiview-consistency\",\"en\":\"Multi-View Consistency\",\"category\":\"Quality\",\"section\":\"QC\",\"text\":\"Across supplied architectural views preserve material identities, colors, lighting logic, site elements and architectural geometry while respecting each camera's original framing.\",\"parameters\":{},\"conflicts\":[]},{\"id\":\"upscale-safety\",\"en\":\"Architecture-Safe Detail\",\"category\":\"Quality\",\"section\":\"QC\",\"text\":\"Increase supported photographic detail without inventing mullions, joints, ornaments, plants, new materials or construction. Compare original facade boundaries and reject geometry drift.\",\"parameters\":{},\"conflicts\":[]},{\"id\":\"cinema-villeneuve\",\"en\":\"Monumental Atmospheric Cinema\",\"category\":\"Camera\",\"section\":\"CAMERA / PHOTOGRAPHY\",\"text\":\"Use a cinematic visual language characterized by monumental scale, deliberate color separation, spacious atmospheric depth. Treat this as color and lighting guidance only; preserve original architectural geometry, approved materials and the camera.\",\"parameters\":{},\"conflicts\":[]},{\"id\":\"cinema-anderson\",\"en\":\"Graphic Pastel Cinema\",\"category\":\"Camera\",\"section\":\"CAMERA / PHOTOGRAPHY\",\"text\":\"Use a cinematic visual language characterized by balanced graphic composition and carefully ordered pastel color relationships. Treat this as color and lighting guidance only; preserve original architectural geometry, approved materials and the camera.\",\"parameters\":{},\"conflicts\":[]},{\"id\":\"cinema-nolan\",\"en\":\"Natural Epic Cinema\",\"category\":\"Camera\",\"section\":\"CAMERA / PHOTOGRAPHY\",\"text\":\"Use a cinematic visual language characterized by credible natural contrast, imposing scale and restrained dramatic daylight. Treat this as color and lighting guidance only; preserve original architectural geometry, approved materials and the camera.\",\"parameters\":{},\"conflicts\":[]},{\"id\":\"cinema-fincher\",\"en\":\"Precision Low-Key Cinema\",\"category\":\"Camera\",\"section\":\"CAMERA / PHOTOGRAPHY\",\"text\":\"Use a cinematic visual language characterized by precise shadow control, muted tones and restrained visual tension. Treat this as color and lighting guidance only; preserve original architectural geometry, approved materials and the camera.\",\"parameters\":{},\"conflicts\":[]},{\"id\":\"cinema-scott\",\"en\":\"Layered Night Cinema\",\"category\":\"Camera\",\"section\":\"CAMERA / PHOTOGRAPHY\",\"text\":\"Use a cinematic visual language characterized by motivated night illumination, layered urban depth and plausible atmospheric light. Treat this as color and lighting guidance only; preserve original architectural geometry, approved materials and the camera.\",\"parameters\":{},\"conflicts\":[]},{\"id\":\"cinema-malick\",\"en\":\"Golden-Hour Naturalism\",\"category\":\"Camera\",\"section\":\"CAMERA / PHOTOGRAPHY\",\"text\":\"Use a cinematic visual language characterized by low-angle natural sunlight, gentle contrast and luminous vegetation. Treat this as color and lighting guidance only; preserve original architectural geometry, approved materials and the camera.\",\"parameters\":{},\"conflicts\":[]},{\"id\":\"photo-editorial-modernist\",\"en\":\"Modernist Architectural Editorial\",\"category\":\"Camera\",\"section\":\"CAMERA / PHOTOGRAPHY\",\"text\":\"Use architectural photography characteristics: clear structural readability, human scale and precise daylight. Preserve the original building design, material identities and camera perspective.\",\"parameters\":{},\"conflicts\":[]},{\"id\":\"photo-sculptural-shadows\",\"en\":\"Sculptural Architectural Photography\",\"category\":\"Camera\",\"section\":\"CAMERA / PHOTOGRAPHY\",\"text\":\"Use architectural photography characteristics: expressive but plausible tonal transitions and geometric light-and-shadow readability. Preserve the original building design, material identities and camera perspective.\",\"parameters\":{},\"conflicts\":[]},{\"id\":\"photo-documentary-context\",\"en\":\"Documentary Architecture\",\"category\":\"Camera\",\"section\":\"CAMERA / PHOTOGRAPHY\",\"text\":\"Use architectural photography characteristics: authentic environmental context and natural observational lighting. Preserve the original building design, material identities and camera perspective.\",\"parameters\":{},\"conflicts\":[]},{\"id\":\"photo-warm-human-scale\",\"en\":\"Human-Centered Architecture\",\"category\":\"Camera\",\"section\":\"CAMERA / PHOTOGRAPHY\",\"text\":\"Use architectural photography characteristics: warm natural light, inviting depth and credible everyday context. Preserve the original building design, material identities and camera perspective.\",\"parameters\":{},\"conflicts\":[]},{\"id\":\"video-motion-custom\",\"en\":\"Custom Video Camera Motion\",\"category\":\"Video\",\"section\":\"CAMERA / PHOTOGRAPHY\",\"text\":\"Use {{movement}} as slow coherent camera motion with stable architectural perspective. Avoid revealing unsupported geometry, cuts, camera shake or sudden zooms.\",\"parameters\":{\"movement\":\"a gentle lateral camera move\"},\"conflicts\":[]},{\"id\":\"video-environment-custom\",\"en\":\"Custom Environmental Motion\",\"category\":\"Video\",\"section\":\"ALLOWED CHANGES\",\"text\":\"Animate only {{motion}} with subtle physically coherent timing. Keep architecture and permanent site objects stable.\",\"parameters\":{\"motion\":\"gentle existing foliage movement\"},\"conflicts\":[]},{\"id\":\"video-temporal-qc\",\"en\":\"Video Temporal QC\",\"category\":\"Video\",\"section\":\"QC\",\"text\":\"Reject flicker, facade morphing, shifting joints, inconsistent material colors, moving windows, implausible parallax and new objects appearing between frames.\",\"parameters\":{},\"conflicts\":[]},{\"id\":\"developer-story\",\"en\":\"Developer Storytelling\",\"category\":\"Quality\",\"section\":\"GOAL\",\"text\":\"Present the original architectural project through credible high-end real-estate storytelling, clear hierarchy, readable entrance and refined site context without redesign.\",\"parameters\":{},\"conflicts\":[]},{\"id\":\"heritage-protection\",\"en\":\"Historical Context Protection\",\"category\":\"Geometry\",\"section\":\"MUST PRESERVE\",\"text\":\"Treat documented historical architecture and approved cultural details as fixed reference. Do not invent heritage ornaments, construction changes or historically unsupported objects.\",\"parameters\":{},\"conflicts\":[]}]");
var DICTIONARY_SECTIONS = [
	"GOAL",
	"SOURCE / INPUT",
	"MUST PRESERVE",
	"ALLOWED CHANGES",
	"MATERIAL / SUBJECT",
	"LIGHT / ATMOSPHERE",
	"CAMERA / PHOTOGRAPHY",
	"RESTRICTIONS",
	"QC"
];
var DICTIONARY_BLOCKS = prompt_blocks_default;
var BLOCKS_BY_ID = new Map(DICTIONARY_BLOCKS.map((block) => [block.id, block]));
/**
* Complete 46 scenario presets imported from lutiy-dev/ARCHVIZ-Prompt-Dictionary-Builder.
*/
var ARCHVIZ_PRESETS = [
	{
		id: "facade",
		name: "Facade",
		group: "Core Edit",
		blocks: [
			"goal",
			"source",
			"geometry",
			"windows",
			"photo",
			"exclude",
			"qc",
			"facade",
			"brick",
			"overcast"
		]
	},
	{
		id: "road",
		name: "Road",
		group: "Core Edit",
		blocks: [
			"goal",
			"source",
			"geometry",
			"windows",
			"photo",
			"exclude",
			"qc",
			"road",
			"overcast"
		]
	},
	{
		id: "greenery",
		name: "Greenery",
		group: "Core Edit",
		blocks: [
			"goal",
			"source",
			"geometry",
			"windows",
			"photo",
			"exclude",
			"qc",
			"greenery"
		]
	},
	{
		id: "people",
		name: "People",
		group: "Core Edit",
		blocks: [
			"goal",
			"source",
			"geometry",
			"windows",
			"photo",
			"exclude",
			"qc",
			"people"
		]
	},
	{
		id: "interior",
		name: "Interior",
		group: "Core Edit",
		blocks: [
			"interior",
			"source",
			"geometry",
			"windows",
			"photo",
			"exclude",
			"qc"
		]
	},
	{
		id: "exterior",
		name: "Exterior",
		group: "Core Edit",
		blocks: [
			"goal",
			"source",
			"geometry",
			"windows",
			"photo",
			"exclude",
			"qc",
			"overcast"
		]
	},
	{
		id: "final-polish",
		name: "Final Polish",
		group: "Core Edit",
		blocks: [
			"goal",
			"source",
			"geometry",
			"windows",
			"photo",
			"exclude",
			"qc",
			"polish"
		]
	},
	{
		id: "material-study",
		name: "Material Study",
		group: "Core Edit",
		blocks: [
			"goal",
			"source",
			"geometry",
			"windows",
			"photo",
			"exclude",
			"qc",
			"facade",
			"limestone"
		]
	},
	{
		id: "day-→-night",
		name: "Day → Night",
		group: "Core Edit",
		blocks: [
			"goal",
			"source",
			"geometry",
			"windows",
			"photo",
			"exclude",
			"qc",
			"night"
		]
	},
	{
		id: "portfolio-polish",
		name: "Portfolio Polish",
		group: "Core Edit",
		blocks: [
			"goal",
			"source",
			"geometry",
			"windows",
			"photo",
			"exclude",
			"qc",
			"polish",
			"overcast"
		]
	},
	{
		id: "environment-context",
		name: "Environment / Context",
		group: "Context & Seasons",
		blocks: [
			"goal",
			"source",
			"geometry",
			"windows",
			"mask",
			"environment-extension",
			"context-description",
			"match-source-lighting",
			"photo",
			"perspective-scale-match",
			"context-restrictions",
			"environment-qc",
			"final-cleanup"
		]
	},
	{
		id: "night-lighting",
		name: "Night / Existing Sources",
		group: "Context & Seasons",
		blocks: [
			"goal",
			"source",
			"geometry",
			"windows",
			"night",
			"night-windows",
			"night-street-sources",
			"night-headlights",
			"photo",
			"exclude",
			"qc",
			"night-source-qc"
		]
	},
	{
		id: "people-insertion",
		name: "Add People",
		group: "Context & Seasons",
		blocks: [
			"goal",
			"source",
			"geometry",
			"windows",
			"mask",
			"add-people",
			"people-integration",
			"photo",
			"perspective-scale-match",
			"exclude",
			"qc",
			"add-people-qc"
		]
	},
	{
		id: "season-spring",
		name: "Spring",
		group: "Context & Seasons",
		blocks: [
			"goal",
			"source",
			"geometry",
			"windows",
			"mask",
			"photo",
			"exclude",
			"qc",
			"spring",
			"final-cleanup"
		]
	},
	{
		id: "season-summer",
		name: "Summer",
		group: "Context & Seasons",
		blocks: [
			"goal",
			"source",
			"geometry",
			"windows",
			"mask",
			"photo",
			"exclude",
			"qc",
			"summer",
			"final-cleanup"
		]
	},
	{
		id: "season-autumn",
		name: "Autumn",
		group: "Context & Seasons",
		blocks: [
			"goal",
			"source",
			"geometry",
			"windows",
			"mask",
			"photo",
			"exclude",
			"qc",
			"autumn",
			"autumn-fallen-leaves",
			"final-cleanup"
		]
	},
	{
		id: "season-winter",
		name: "Winter",
		group: "Context & Seasons",
		blocks: [
			"goal",
			"source",
			"geometry",
			"windows",
			"mask",
			"photo",
			"exclude",
			"qc",
			"winter",
			"added-snow-cover",
			"final-cleanup"
		]
	},
	{
		id: "material-id-map",
		name: "Material ID Map",
		group: "Context & Seasons",
		blocks: [
			"material-id-goal",
			"source",
			"material-id-preserve",
			"material-id-rules",
			"material-id-classes",
			"material-id-restrictions",
			"material-id-qc"
		]
	},
	{
		id: "hdri-realism",
		name: "HDRI Realism",
		group: "Grade & HDRI",
		blocks: ["hdri-realism-positive", "hdri-realism-negative"]
	},
	{
		id: "hero-photo-clean",
		name: "HERO PHOTO CLEAN",
		group: "Grade & HDRI",
		blocks: ["hero-photo-clean-positive", "hero-photo-clean-negative"]
	},
	{
		id: "hero-photo-dramatic",
		name: "HERO PHOTO DRAMATIC",
		group: "Grade & HDRI",
		blocks: ["hero-photo-dramatic-positive", "hero-photo-dramatic-negative"]
	},
	{
		id: "hero-sunset-gold",
		name: "HERO SUNSET GOLD",
		group: "Grade & HDRI",
		blocks: ["hero-sunset-gold-positive", "hero-sunset-gold-negative"]
	},
	{
		id: "director-villeneuve",
		name: "DIRECTOR · Monumental Atmospheric Cinema",
		group: "Cinema Directors",
		blocks: [
			"goal",
			"source",
			"geometry",
			"windows",
			"exclude",
			"qc",
			"cinema-villeneuve"
		]
	},
	{
		id: "director-anderson",
		name: "DIRECTOR · Graphic Pastel Cinema",
		group: "Cinema Directors",
		blocks: [
			"goal",
			"source",
			"geometry",
			"windows",
			"exclude",
			"qc",
			"cinema-anderson"
		]
	},
	{
		id: "director-nolan",
		name: "DIRECTOR · Natural Epic Cinema",
		group: "Cinema Directors",
		blocks: [
			"goal",
			"source",
			"geometry",
			"windows",
			"exclude",
			"qc",
			"cinema-nolan"
		]
	},
	{
		id: "director-fincher",
		name: "DIRECTOR · Precision Low-Key Cinema",
		group: "Cinema Directors",
		blocks: [
			"goal",
			"source",
			"geometry",
			"windows",
			"exclude",
			"qc",
			"cinema-fincher"
		]
	},
	{
		id: "director-scott",
		name: "DIRECTOR · Layered Night Cinema",
		group: "Cinema Directors",
		blocks: [
			"goal",
			"source",
			"geometry",
			"windows",
			"exclude",
			"qc",
			"cinema-scott"
		]
	},
	{
		id: "director-malick",
		name: "DIRECTOR · Golden-Hour Naturalism",
		group: "Cinema Directors",
		blocks: [
			"goal",
			"source",
			"geometry",
			"windows",
			"exclude",
			"qc",
			"cinema-malick"
		]
	},
	{
		id: "photography-editorial-modernist",
		name: "PHOTO · Modernist Editorial",
		group: "Photography",
		blocks: [
			"goal",
			"source",
			"geometry",
			"windows",
			"exclude",
			"qc",
			"photo-editorial-modernist"
		]
	},
	{
		id: "photography-sculptural-shadows",
		name: "PHOTO · Sculptural Shadows",
		group: "Photography",
		blocks: [
			"goal",
			"source",
			"geometry",
			"windows",
			"exclude",
			"qc",
			"photo-sculptural-shadows"
		]
	},
	{
		id: "photography-documentary-context",
		name: "PHOTO · Documentary Context",
		group: "Photography",
		blocks: [
			"goal",
			"source",
			"geometry",
			"windows",
			"exclude",
			"qc",
			"photo-documentary-context"
		]
	},
	{
		id: "photography-warm-human-scale",
		name: "PHOTO · Human-Centered Scale",
		group: "Photography",
		blocks: [
			"goal",
			"source",
			"geometry",
			"windows",
			"exclude",
			"qc",
			"photo-warm-human-scale"
		]
	},
	{
		id: "controlled-custom-material",
		name: "CONTROL · Custom Material",
		group: "Controlled Reference",
		blocks: [
			"goal",
			"source",
			"geometry",
			"windows",
			"exclude",
			"qc",
			"custom-material",
			"upscale-safety"
		]
	},
	{
		id: "controlled-material-reference",
		name: "CONTROL · Material Reference",
		group: "Controlled Reference",
		blocks: [
			"goal",
			"source",
			"geometry",
			"windows",
			"exclude",
			"qc",
			"custom-material",
			"reference-material"
		]
	},
	{
		id: "controlled-reference-light",
		name: "CONTROL · Reference Lighting",
		group: "Controlled Reference",
		blocks: [
			"goal",
			"source",
			"geometry",
			"windows",
			"exclude",
			"qc",
			"reference-lighting",
			"custom-grading"
		]
	},
	{
		id: "controlled-multi-reference",
		name: "CONTROL · Multi-Reference",
		group: "Controlled Reference",
		blocks: [
			"goal",
			"source",
			"geometry",
			"windows",
			"exclude",
			"qc",
			"multi-reference-roles",
			"custom-art-direction"
		]
	},
	{
		id: "controlled-photorealism",
		name: "CONTROL · Photorealism Recovery",
		group: "Controlled Reference",
		blocks: [
			"goal",
			"source",
			"geometry",
			"windows",
			"exclude",
			"qc",
			"photorealism-recovery",
			"upscale-safety"
		]
	},
	{
		id: "controlled-multi-view",
		name: "CONTROL · Multi-View Consistency",
		group: "Controlled Reference",
		blocks: [
			"goal",
			"source",
			"geometry",
			"windows",
			"exclude",
			"qc",
			"multiview-consistency"
		]
	},
	{
		id: "controlled-art-direction",
		name: "CONTROL · Custom Art Direction",
		group: "Controlled Reference",
		blocks: [
			"goal",
			"source",
			"geometry",
			"windows",
			"exclude",
			"qc",
			"custom-art-direction",
			"custom-light",
			"custom-atmosphere",
			"custom-grading"
		]
	},
	{
		id: "marketing-developer",
		name: "MARKETING · Developer Hero",
		group: "Marketing & Heritage",
		blocks: [
			"goal",
			"source",
			"geometry",
			"windows",
			"exclude",
			"qc",
			"developer-story",
			"photo-documentary-context"
		]
	},
	{
		id: "heritage-context",
		name: "HERITAGE · Protected Context",
		group: "Marketing & Heritage",
		blocks: [
			"goal",
			"source",
			"geometry",
			"windows",
			"exclude",
			"qc",
			"heritage-protection",
			"photo-sculptural-shadows"
		]
	},
	{
		id: "object-3d-asset",
		name: "Object / 3D Asset",
		group: "3D Asset & Video",
		blocks: [
			"asset-goal",
			"asset-reference",
			"asset-shape",
			"asset-material",
			"microdetail",
			"roughness-variation",
			"soft-diffused-light",
			"asset-view",
			"asset-background",
			"asset-qc",
			"final-cleanup"
		]
	},
	{
		id: "archviz-video",
		name: "Archviz Image-to-Video",
		group: "3D Asset & Video",
		blocks: [
			"video-arch-goal",
			"video-reference",
			"video-arch-preserve",
			"video-motion",
			"exclude",
			"video-stability"
		]
	},
	{
		id: "object-video",
		name: "Object Video",
		group: "3D Asset & Video",
		blocks: [
			"video-object-goal",
			"video-reference",
			"asset-shape",
			"video-motion",
			"video-stability"
		]
	},
	{
		id: "first-last-video",
		name: "First → Last Frame Video",
		group: "3D Asset & Video",
		blocks: [
			"first-last-goal",
			"first-last-reference",
			"video-arch-preserve",
			"first-last-transition",
			"first-last-camera",
			"video-stability"
		]
	},
	{
		id: "video-art-direction",
		name: "VIDEO · Camera & Environment",
		group: "3D Asset & Video",
		blocks: [
			"video-arch-goal",
			"video-arch-preserve",
			"video-motion-custom",
			"video-environment-custom",
			"video-temporal-qc"
		]
	}
];
/**
* Simple 1-click Mid-Layer Presets bridging Base Geometry (3D/Sketch/ControlNet)
* and Final Visual Rendering (Materials, Atmosphere, Preservation & QC).
*/
var MID_LAYER_PRESETS = [
	{
		id: "preserve-shell",
		pillLabel: "Preserve",
		title: "Architecture Shell Lock",
		badge: "Mid · Geometry",
		description: "Strict structural retention across floors, openings, camera lines, and mullions.",
		promptSnippet: "Strict architecture shell lock: preserve exact building geometry, floor count, window mullions, and camera perspective.",
		blockIds: [
			"goal",
			"source",
			"geometry",
			"windows",
			"exclude",
			"qc"
		],
		advancedPatch: { change: "none" },
		enginePatch: {
			geometryLock: 94,
			annotatorMode: "mlsd",
			depthEnabled: true,
			depthWeight: 78,
			edgeAdherence: 88
		}
	},
	{
		id: "facade-swap",
		pillLabel: "Facade",
		title: "Facade Material Restyle",
		badge: "Mid · Surface",
		description: "Re-clad opaque exterior walls while locking window openings, joints, and perspective.",
		promptSnippet: "Facade material restyle: re-clad opaque exterior surfaces in authentic true-scale stone and timber joinery while keeping glazing and openings unchanged.",
		blockIds: [
			"goal",
			"source",
			"geometry",
			"windows",
			"facade",
			"custom-material",
			"upscale-safety",
			"qc"
		],
		parameters: { "custom-material": {
			material: "primary exterior cladding",
			treatment: "true-scale stone & timber grain with crisp mortar joints"
		} },
		advancedPatch: { change: "facade" },
		enginePatch: {
			geometryLock: 88,
			materialOverride: 78,
			annotatorMode: "canny",
			styleTransferWeight: 72
		}
	},
	{
		id: "material-id",
		pillLabel: "Mat-ID",
		title: "Material ID Segmentation",
		badge: "Mid · Mask",
		description: "Separates facade, glazing, frames, roof, stone, and foliage for clean masking passes.",
		promptSnippet: "Material ID pass: lock clean architectural region boundaries across facade walls, glazing, trim, foliage, water, and paving.",
		blockIds: [
			"material-id-goal",
			"source",
			"material-id-preserve",
			"material-id-rules",
			"material-id-classes",
			"material-id-qc"
		],
		enginePatch: {
			geometryLock: 96,
			annotatorMode: "softedge",
			depthEnabled: true,
			samThreshold: 52
		}
	},
	{
		id: "golden-relight",
		pillLabel: "Golden",
		title: "Golden Hour Relight",
		badge: "Mid · Light",
		description: "Warm low-angle sunlight with cool ambient fill, elongated shadows, and clean rolloff.",
		promptSnippet: "Golden hour relight: warm low-angle sunlight casting elongated natural shadows with cool ambient fill and smooth highlight rolloff.",
		blockIds: [
			"goal",
			"source",
			"geometry",
			"windows",
			"golden-hour",
			"hero-sunset-gold-positive",
			"hero-sunset-gold-negative",
			"highlight-rolloff"
		],
		designPatch: {
			light: "Golden hour",
			time: "Golden hour",
			mood: "Warm"
		},
		advancedPatch: {
			light: "golden-hour",
			grade: "hero-sunset-gold"
		},
		scene3dPatch: {
			d5LightPreset: "golden",
			sunAzimuth: 242,
			sunElevation: 16,
			exposure: 1.15
		}
	},
	{
		id: "night-glow",
		pillLabel: "Night",
		title: "Night & Interior Glow",
		badge: "Mid · Night",
		description: "Physically motivated night fixtures, selective warm windows, and balanced blue sky.",
		promptSnippet: "Night & interior glow: deep blue-hour sky with selective warm 2700K interior window illumination and physically motivated exterior fixtures.",
		blockIds: [
			"goal",
			"source",
			"geometry",
			"windows",
			"night",
			"night-windows",
			"night-street-sources",
			"night-source-qc",
			"exclude"
		],
		designPatch: {
			light: "Night",
			time: "Night",
			mood: "Dramatic"
		},
		advancedPatch: { light: "night" },
		scene3dPatch: {
			d5LightPreset: "blue-hour",
			sunAzimuth: 278,
			sunElevation: 6,
			exposure: 1.24
		}
	},
	{
		id: "seasonal-shift",
		pillLabel: "Season",
		title: "Autumn & Foliage Micro-Pass",
		badge: "Mid · Bio",
		description: "Transforms seasonal leaves and site planting without altering plant count or silhouettes.",
		promptSnippet: "Autumn seasonal shift: crisp golden-amber foliage and subtle fallen leaves on paving while preserving existing plant placement and massing.",
		blockIds: [
			"goal",
			"source",
			"geometry",
			"windows",
			"autumn",
			"autumn-fallen-leaves",
			"natural-greenery-detail",
			"final-cleanup"
		],
		designPatch: {
			mood: "Serene",
			weather: "Clear"
		},
		advancedPatch: {
			season: "autumn",
			change: "greenery"
		}
	},
	{
		id: "context-extend",
		pillLabel: "Extend",
		title: "Site Context Extension",
		badge: "Mid · Urban",
		description: "Extends surrounding urban fabric and landscape matching horizon and source daylight.",
		promptSnippet: "Site context extension: seamlessly extend surrounding urban context, streetscape, and mature planting matched to source daylight and perspective.",
		blockIds: [
			"goal",
			"source",
			"geometry",
			"windows",
			"environment-extension",
			"context-description",
			"perspective-scale-match",
			"match-source-lighting",
			"environment-qc"
		],
		advancedPatch: { air: "light-haze" },
		enginePatch: {
			geometryLock: 86,
			depthEnabled: true,
			depthWeight: 72
		}
	},
	{
		id: "heritage-guard",
		pillLabel: "Heritage",
		title: "Heritage & Stone Guard",
		badge: "Mid · Historic",
		description: "Locks historical moldings, stone blocks, and patinated edges against invented ornaments.",
		promptSnippet: "Heritage stone guard: faithfully preserve historic masonry joints, stone cornices, patina, and sculptural facade shadows without modern clutter.",
		blockIds: [
			"goal",
			"source",
			"geometry",
			"windows",
			"heritage-protection",
			"stone-detail",
			"edge-wear",
			"photo-sculptural-shadows",
			"qc"
		],
		designPatch: { mood: "Quiet" },
		advancedPatch: { grade: "photo-sculptural-shadows" },
		enginePatch: {
			geometryLock: 95,
			annotatorMode: "lineart",
			esrganFaceEnhance: true
		}
	},
	{
		id: "cinema-look",
		pillLabel: "Cinema",
		title: "Editorial Cinema Grade",
		badge: "Mid · Film",
		description: "Monumental color separation and atmospheric depth without mutating geometry.",
		promptSnippet: "Editorial cinema grade: monumental atmospheric haze, dramatic cloud depth, sculpted contrast, and disciplined architectural framing.",
		blockIds: [
			"goal",
			"source",
			"geometry",
			"windows",
			"cinema-villeneuve",
			"dramatic-clouds",
			"subtle-aerial-perspective",
			"editorial-architecture",
			"qc"
		],
		designPatch: { mood: "Dramatic" },
		advancedPatch: {
			grade: "cinema-villeneuve",
			air: "dramatic-clouds"
		},
		enginePatch: {
			mjStylize: 280,
			renderFidelity: "editorial"
		}
	},
	{
		id: "photoreal-recovery",
		pillLabel: "Recover",
		title: "De-CGI Photoreal Recovery",
		badge: "Mid · Polish",
		description: "Removes synthetic CG shine with realistic roughness variation, pores, and safe 2x detail.",
		promptSnippet: "De-CGI photoreal recovery: eliminate synthetic CG gloss with physical roughness variation, subtle edge wear, and crisp micro-surface detail.",
		blockIds: [
			"goal",
			"source",
			"geometry",
			"windows",
			"photorealism-recovery",
			"upscale-safety",
			"microdetail",
			"roughness-variation",
			"final-cleanup"
		],
		advancedPatch: { extras: ["microdetail", "final-cleanup"] },
		enginePatch: {
			geometryLock: 91,
			esrganModel: "4x-ArchSharp",
			esrganFaceEnhance: true,
			enhanceMode: "micro-detail"
		}
	}
];
function getDictionaryBlock(id) {
	return BLOCKS_BY_ID.get(id);
}
function getMidLayerPresetById(id) {
	return MID_LAYER_PRESETS.find((preset) => preset.id === id);
}
/**
* Updates the visible user prompt text when toggling or switching a 1-click
* Mid-Layer Preset pill, preserving any user-written prompt directives.
*/
function applyMidLayerPromptToIdea(currentIdea, nextPreset) {
	let cleaned = currentIdea.trim();
	for (const preset of MID_LAYER_PRESETS) if (cleaned.includes(preset.promptSnippet)) cleaned = cleaned.replace(preset.promptSnippet, "");
	cleaned = cleaned.replace(/\s{2,}/g, " ").replace(/^[\s.,;]+|[\s.,;]+$/g, "").trim();
	if (!nextPreset) return cleaned;
	if (!cleaned) return nextPreset.promptSnippet;
	return `${cleaned}. ${nextPreset.promptSnippet}`;
}
function appendSuggestionToIdea(currentIdea, suggestion) {
	const base = currentIdea.trim();
	const next = suggestion.trim();
	if (!next) return base;
	if (!base) return next;
	if (base.toLowerCase().includes(next.toLowerCase())) return base;
	return `${base.replace(/[.;,\s]+$/, "")}. ${next}.`;
}
/**
* Port of ARCHVIZ-Prompt-Dictionary-Builder/src/composer.mjs:
* interpolates {{key}} parameters, deduplicates lines per section,
* and reports pairwise block conflicts cleanly.
*/
function composeDictionarySelection(blockIds, paramOverrides = {}, extraDirective = "") {
	const uniqueIds = [];
	for (const id of blockIds) if (id && id !== "none" && !uniqueIds.includes(id) && BLOCKS_BY_ID.has(id)) uniqueIds.push(id);
	const chosenSet = new Set(uniqueIds);
	const warnings = [];
	const seenPairs = /* @__PURE__ */ new Set();
	for (const id of uniqueIds) {
		const block = BLOCKS_BY_ID.get(id);
		if (!block) continue;
		for (const conflictId of block.conflicts) {
			if (!chosenSet.has(conflictId)) continue;
			const pairKey = id < conflictId ? `${id}::${conflictId}` : `${conflictId}::${id}`;
			if (seenPairs.has(pairKey)) continue;
			seenPairs.add(pairKey);
			const other = BLOCKS_BY_ID.get(conflictId);
			warnings.push({
				a: id,
				b: conflictId,
				labelA: block.en || id,
				labelB: other?.en || conflictId
			});
		}
	}
	const groups = /* @__PURE__ */ new Map();
	const seenLines = /* @__PURE__ */ new Set();
	const activeParamBlocks = [];
	for (const id of uniqueIds) {
		const block = BLOCKS_BY_ID.get(id);
		if (!block) continue;
		const mergedParams = { ...block.parameters };
		const override = paramOverrides[id];
		if (override) {
			for (const [k, v] of Object.entries(override)) if (k in block.parameters && typeof v === "string") mergedParams[k] = v;
		}
		if (Object.keys(block.parameters).length > 0) activeParamBlocks.push({
			blockId: id,
			label: block.en || id,
			parameters: mergedParams
		});
		const interpolated = block.text.replace(/\{\{(\w+)\}\}/g, (_, key) => {
			const val = mergedParams[key];
			return typeof val === "string" && val.trim() ? val.trim() : block.parameters[key] ?? "";
		});
		const norm = interpolated.trim().replace(/\s+/g, " ").toLowerCase();
		if (!norm || seenLines.has(norm)) continue;
		seenLines.add(norm);
		const bucket = groups.get(block.section) ?? [];
		bucket.push(interpolated.trim());
		groups.set(block.section, bucket);
	}
	const sectionsOut = [];
	for (const section of DICTIONARY_SECTIONS) {
		const lines = groups.get(section);
		if (!lines?.length) continue;
		sectionsOut.push(`${section}\n${lines.join("\n")}`);
	}
	if (extraDirective.trim()) sectionsOut.push(`STUDIO DIRECTIVES\n${extraDirective.trim()}`);
	return {
		text: sectionsOut.join("\n\n").trim(),
		keptIds: uniqueIds,
		warnings,
		activeParamBlocks
	};
}
var PRESET_IDS = new Set(ARCHVIZ_PRESETS.map((p) => p.id));
function isPlainObject(v) {
	return v !== null && typeof v === "object" && !Array.isArray(v);
}
/**
* Validates & normalizes Saved Prompts JSON compatible with
* ARCHVIZ-Prompt-Dictionary-Builder's prompt-transfer.mjs (schema_version: 1).
*/
function validateSavedPromptsBundle(value) {
	if (!isPlainObject(value) || value.schema_version !== 1 || !Array.isArray(value.prompts) || value.prompts.length > 500) throw new Error("Invalid Saved Prompts JSON format (expected schema_version: 1).");
	const seenIds = /* @__PURE__ */ new Set();
	return {
		schema_version: 1,
		prompts: value.prompts.map((raw) => {
			if (!isPlainObject(raw)) throw new Error("Invalid prompt entry.");
			const id = typeof raw.id === "string" ? raw.id.trim() : "";
			const name = typeof raw.name === "string" ? raw.name.trim() : "";
			const scenario = typeof raw.scenario === "string" ? raw.scenario.trim() : "facade";
			const text = typeof raw.text === "string" ? raw.text : "";
			const createdAt = typeof raw.createdAt === "string" ? raw.createdAt : (/* @__PURE__ */ new Date()).toISOString();
			if (!id || id.length > 100 || seenIds.has(id)) throw new Error("Duplicate or invalid prompt ID.");
			if (!name || name.length > 100) throw new Error("Invalid prompt name.");
			if (!text.trim() || text.length > 1e5) throw new Error("Invalid prompt text.");
			if (!Array.isArray(raw.blockIds) || raw.blockIds.length === 0 || raw.blockIds.length > 200) throw new Error("Prompt entry must include 1-200 blockIds.");
			seenIds.add(id);
			const blockIds = [];
			const parameters = {};
			const rawParams = isPlainObject(raw.parameters) ? raw.parameters : {};
			for (const bid of raw.blockIds) {
				if (typeof bid !== "string" || !BLOCKS_BY_ID.has(bid)) throw new Error(`Unknown dictionary block: ${String(bid)}`);
				if (!blockIds.includes(bid)) blockIds.push(bid);
				const block = BLOCKS_BY_ID.get(bid);
				const incomingBlockParams = isPlainObject(rawParams[bid]) ? rawParams[bid] : {};
				parameters[bid] = {};
				for (const [k, v] of Object.entries(incomingBlockParams)) if (k in block.parameters && typeof v === "string") parameters[bid][k] = v.slice(0, 2e3);
			}
			const parsedDate = Date.parse(createdAt);
			const normalizedIso = Number.isFinite(parsedDate) ? new Date(parsedDate).toISOString() : (/* @__PURE__ */ new Date()).toISOString();
			return {
				id,
				name,
				scenario: PRESET_IDS.has(scenario) ? scenario : "custom",
				text,
				blockIds,
				parameters,
				createdAt: normalizedIso
			};
		})
	};
}
function exportSavedPromptsJson(prompts) {
	const checked = validateSavedPromptsBundle({
		schema_version: 1,
		prompts
	});
	return JSON.stringify(checked, null, 2);
}
function importSavedPromptsJson(jsonText, existing) {
	const incoming = validateSavedPromptsBundle(JSON.parse(jsonText));
	const byId = new Map(existing.map((p) => [p.id, p]));
	let skipped = 0;
	let added = 0;
	for (const item of incoming.prompts) {
		if (byId.has(item.id)) {
			skipped++;
			continue;
		}
		byId.set(item.id, item);
		added++;
	}
	return {
		prompts: [...byId.values()],
		added,
		skipped
	};
}
//#endregion
export { applyMidLayerPromptToIdea as a, getDictionaryBlock as c, appendSuggestionToIdea as i, getMidLayerPresetById as l, DICTIONARY_BLOCKS as n, composeDictionarySelection as o, MID_LAYER_PRESETS as r, exportSavedPromptsJson as s, ARCHVIZ_PRESETS as t, importSavedPromptsJson as u };
