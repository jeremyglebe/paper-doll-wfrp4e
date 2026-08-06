//#region src/types/patches/paper-doll/Equipment.ts
var e = [
	"HEAD",
	"BODY",
	"GLOVES",
	"BOOTS"
], t = ["MAIN_LEFT", "MAIN_RIGHT"], n = [
	"head",
	"lArm",
	"rArm",
	"lLeg",
	"rLeg",
	"body"
], r = {
	BODY: ["body"],
	BOOTS: ["lLeg", "rLeg"],
	GLOVES: ["lArm", "rArm"],
	HEAD: ["head"]
};
function i(e, t) {
	return t.coverage - e.coverage || t.points - e.points || e.item.name.localeCompare(t.item.name) || e.item.id.localeCompare(t.item.id);
}
function a(e, t) {
	return Math.max(...r[t].map((t) => e.armourPoints?.[t] ?? 0));
}
function o(e, t) {
	return r[t].filter((t) => (e.armourPoints?.[t] ?? 0) > 0).length;
}
function s(e, t, n) {
	return a(n.item, e) - a(t.item, e) || o(n.item, e) - o(t.item, e) || i(t, n);
}
function ee(e) {
	return e.type === "armour" && e.equipped && !!e.armourPoints;
}
function c(e) {
	let t = e.armourPoints ?? {
		body: 0,
		head: 0,
		lArm: 0,
		lLeg: 0,
		rArm: 0,
		rLeg: 0
	}, r = n.filter((e) => t[e] > 0);
	return {
		coverage: r.length,
		item: e,
		points: r.reduce((e, n) => e + t[n], 0)
	};
}
function te(t) {
	let n = t.filter(ee).map(c);
	return e.flatMap((e) => {
		let t = n.filter((t) => a(t.item, e) > 0).sort((t, n) => s(e, t, n))[0];
		return t ? [{
			slotId: e,
			uuid: t.item.uuid
		}] : [];
	});
}
function ne(e, t) {
	return e.twoHanded ? "both" : e.offhand ? t === "l" ? "r" : "l" : t;
}
function re(e, t) {
	return Number(t.twoHanded) - Number(e.twoHanded) || e.name.localeCompare(t.name) || e.id.localeCompare(t.id);
}
function ie(e, n) {
	let r = e.filter((e) => e.type === "weapon" && e.equipped).sort(re);
	return t.flatMap((e) => {
		let t = e === "MAIN_LEFT" ? "l" : "r", i = r.find((e) => {
			let r = ne(e, n);
			return r === "both" || r === t;
		});
		return i ? [{
			slotId: e,
			uuid: i.uuid
		}] : [];
	});
}
function ae(e, t) {
	return [...te(e), ...ie(e, t)];
}
//#endregion
//#region src/functions/patches/paper-doll/is-paper-doll-slot-state.ts
function l(e) {
	return typeof e == "object" && !!e && !Array.isArray(e);
}
function oe(e) {
	return /^(0|[1-9]\d*)$/.test(e);
}
function se(e) {
	return e == null || typeof e == "string" && e.length > 0;
}
function u(e) {
	return l(e) && Object.entries(e).every(([e, t]) => e.length > 0 && l(t) && Object.entries(t).every(([e, t]) => oe(e) && se(t)));
}
//#endregion
//#region src/module/patches/paper-doll/wfrp-runtime-types.ts
function d(e) {
	return typeof e == "object" && !!e;
}
function f(e) {
	return d(e) ? typeof e.getFlag == "function" && e.items !== void 0 && typeof e.setFlag == "function" && typeof e.type == "string" && typeof e.uuid == "string" : !1;
}
function p(e) {
	return d(e) ? typeof e.id == "string" && typeof e.name == "string" && typeof e.type == "string" && typeof e.update == "function" && typeof e.uuid == "string" : !1;
}
//#endregion
//#region src/module/patches/paper-doll/wfrp-equipment.ts
var ce = [
	"head",
	"lArm",
	"rArm",
	"lLeg",
	"rLeg",
	"body"
];
function m(e) {
	if (!d(e.system)) throw Error(`WFRP item ${e.uuid} has no usable system data.`);
	return e.system;
}
function h(e, t) {
	let n = m(e)[t];
	if (n === void 0) return null;
	if (!d(n) || typeof n.value != "boolean") throw Error(`WFRP item ${e.uuid} has an invalid ${t} field.`);
	return n.value;
}
function g(e, t) {
	let n = h(e, t);
	if (n === null) throw Error(`WFRP item ${e.uuid} is missing its ${t} field.`);
	return n;
}
function _(e) {
	return h(e, "equipped");
}
function le(e) {
	return _(e) !== null;
}
function v(e) {
	let t = m(e).AP;
	if (!d(t)) throw Error(`WFRP armour ${e.uuid} has no usable AP data.`);
	return Object.fromEntries(ce.map((n) => {
		let r = t[n];
		if (typeof r != "number" || !Number.isFinite(r)) throw Error(`WFRP armour ${e.uuid} has an invalid AP.${n} value.`);
		return [n, r];
	}));
}
function y(e) {
	if (!d(e.system) || !d(e.system.details)) throw Error(`WFRP actor ${e.uuid} has no usable details data.`);
	let t = e.system.details.mainHand;
	if (t !== "l" && t !== "r") throw Error(`WFRP actor ${e.uuid} has an invalid details.mainHand value.`);
	return t;
}
function b(e) {
	if (e.type !== "armour" && e.type !== "weapon") return null;
	let t = {
		equipped: g(e, "equipped"),
		id: e.id,
		name: e.name,
		type: e.type,
		uuid: e.uuid
	};
	return e.type === "armour" ? t.armourPoints = v(e) : (t.offhand = g(e, "offhand"), t.twoHanded = g(e, "twohanded")), t;
}
function ue(e, t) {
	if (e.type !== "armour") return !1;
	let n = v(e);
	switch (t) {
		case "HEAD": return n.head > 0;
		case "BODY": return n.body > 0;
		case "GLOVES": return n.lArm > 0 || n.rArm > 0;
		case "BOOTS": return n.lLeg > 0 || n.rLeg > 0;
		default: return !1;
	}
}
function x(e, t) {
	return t === "MAIN_LEFT" || t === "MAIN_RIGHT" ? e.type === "weapon" : t === "HEAD" || t === "BODY" || t === "GLOVES" || t === "BOOTS" ? ue(e, t) : e.type !== "weapon" && e.type !== "armour";
}
function de(e) {
	return e.slotId === "MAIN_LEFT" ? "l" : e.slotId === "MAIN_RIGHT" ? "r" : null;
}
async function S(e, t, n) {
	let r = _(t);
	if (r === null) return;
	let i = b(t), a = {}, o;
	if (i?.type === "weapon") {
		let t = de(n);
		i.twoHanded ? o = !1 : t && (o = t !== y(e));
	}
	r || (a["system.equipped.value"] = !0), o !== void 0 && i?.offhand !== o && (a["system.offhand.value"] = o), Object.keys(a).length && await t.update(a);
}
async function fe(e) {
	_(e) === !0 && await e.update({ "system.equipped.value": !1 });
}
//#endregion
//#region src/module/constants.ts
var C = "paper-doll-wfrp4e", pe = "Paper Doll - WFRP4e";
//#endregion
//#region src/module/patches/paper-doll/report-paper-doll-error.ts
function me(e) {
	return e instanceof Error ? e.message : String(e);
}
function w(e, t) {
	let n = `${pe}: ${e}. ${me(t)}`;
	console.error(n, t), globalThis.ui?.notifications?.error(n);
}
function T(e, t) {
	e.catch((e) => w(t, e));
}
//#endregion
//#region src/module/patches/paper-doll/synchronize-paper-doll.ts
var E = "fvtt-paper-doll-ui", D = "slots", O = /* @__PURE__ */ new Map(), k = /* @__PURE__ */ new Set();
function A(e) {
	return Object.fromEntries(Object.entries(e).map(([e, t]) => [e, { ...t }]));
}
function he(e) {
	let t = e.getFlag(E, D);
	if (t === void 0) return {};
	if (!u(t)) throw Error("Paper Doll's existing slot flag has an invalid shape.");
	return A(t);
}
function j() {
	let n = game?.settings.get(E, "globalConfig");
	if (!d(n) || !d(n.SLOTS)) return new Set([...e, ...t]);
	let r = new Set(Object.values(n.SLOTS).filter(d).flatMap((e) => Object.keys(e)));
	return r.size ? r : new Set([...e, ...t]);
}
function M(e, t) {
	return JSON.stringify(e) === JSON.stringify(t);
}
function N(n, r, i, a) {
	let o = A(n), s = new Map(r.map((e) => [e.slotId, e.uuid]));
	for (let n of [...e, ...t]) {
		if (!a.has(n)) continue;
		let e = o[n]?.["0"] ?? null, t = s.get(n) ?? null;
		t ? (o[n] ??= {}, o[n][0] = t) : e && i.has(e) && (o[n] ??= {}, o[n][0] = null);
	}
	return o;
}
function P(e, t, n) {
	let r = new Map(t.map((e) => [e.uuid, e])), i = A(e);
	for (let e of Object.values(i)) for (let [t, i] of Object.entries(e)) {
		if (!i || n.has(i)) continue;
		let a = r.get(i);
		a && _(a) === !1 && (e[t] = null);
	}
	return i;
}
function F(e) {
	return O.has(e.uuid);
}
function I(e) {
	if (!f(e)) throw Error("Paper Doll synchronization requires a WFRP actor document.");
}
function L() {
	if (!game || game.system.id !== "wfrp4e") throw Error("Paper Doll synchronization is only available in a WFRP4e world.");
}
async function R(e) {
	let t = he(e), n = Array.from(e.items), r = n.map(b).filter((e) => e !== null), i = new Set(r.map((e) => e.uuid)), a = P(N(t, ae(r, y(e)), i, j()), n, i);
	return M(t, a) ? "unchanged" : (await e.setFlag(E, D, a), "synchronized");
}
async function z(e) {
	I(e), L();
	let t = e;
	if (game.modules.get("fvtt-paper-doll-ui")?.active !== !0) return "unavailable";
	let n = O.get(t.uuid);
	if (n) return await n, z(t);
	let r = R(t).finally(() => {
		O.get(t.uuid) === r && O.delete(t.uuid);
	});
	return O.set(t.uuid, r), r;
}
function ge(e) {
	k.has(e.uuid) || (k.add(e.uuid), queueMicrotask(() => {
		k.delete(e.uuid), T(z(e), `could not synchronize equipped items for ${e.uuid}`);
	}));
}
async function B() {
	return L(), Promise.all(Array.from(game.actors, (e) => z(e)));
}
//#endregion
//#region src/module/api/create-module-api.ts
function _e() {
	return {
		syncActor: z,
		syncAllActors: B
	};
}
//#endregion
//#region src/module/api/register-module-api.ts
function ve() {
	if (!game) throw Error("Foundry game global is unavailable during module API registration.");
	let e = game.modules.get(C);
	if (!e) throw Error(`Foundry module registry entry was not found for ${C}.`);
	e.api = _e();
}
//#endregion
//#region src/functions/patches/paper-doll/find-slot-changes.ts
function V(e, t, n) {
	return e[t]?.[n] ?? null;
}
function ye(e, t) {
	let n = new Set([...Object.keys(e), ...Object.keys(t)]), r = [];
	for (let i of n) {
		let n = new Set([...Object.keys(e[i] ?? {}), ...Object.keys(t[i] ?? {})]);
		for (let a of n) {
			let n = V(e, i, a), o = V(t, i, a);
			n !== o && r.push({
				from: n,
				slotId: i,
				slotIndex: Number(a),
				to: o
			});
		}
	}
	return r;
}
//#endregion
//#region src/module/patches/paper-doll/enforce-paper-doll-equipped-state.ts
var H = Symbol.for("paper-doll-wfrp4e.equipped-state");
function be() {
	return globalThis.ui?.paperDoll?.prototype ?? null;
}
function xe(e, t, n) {
	if (!e || typeof t != "function" || typeof n != "function") throw Error("Paper Doll's required equip integration API is unavailable.");
}
function U(e) {
	if (!d(e) || typeof e.slotId != "string") return null;
	let t = Number(e.slotIndex);
	return Number.isInteger(t) ? {
		slotId: e.slotId,
		slotIndex: t
	} : null;
}
function Se() {
	return Promise.resolve();
}
function Ce() {
	let e = be(), t = e?.equip, n = globalThis.fromUuid;
	if (xe(e, t, n), e[H] === !0) return;
	let r = t;
	e.equip = async function(e, t, i) {
		let a = await n(e);
		if (!p(a)) return r.call(this, e, t, i);
		let o = U(i);
		if (!t) return Se();
		if (!f(this.actor)) throw Error(`Paper Doll did not provide a WFRP actor while equipping ${a.uuid}.`);
		if (!o) throw Error(`Paper Doll did not provide a valid slot while equipping ${a.uuid}.`);
		if (!x(a, o.slotId)) throw Error(`Paper Doll attempted to equip ${a.uuid} in incompatible ${o.slotId} slot.`);
		try {
			await S(this.actor, a, o);
		} catch (e) {
			w(`could not equip ${a.name} from Paper Doll`, e);
			try {
				await z(this.actor);
			} catch (e) {
				w(`could not restore ${a.name}'s Paper Doll slot`, e);
			}
			throw e;
		}
	}, e[H] = !0;
}
//#endregion
//#region src/module/patches/paper-doll/enforce-paper-doll-slot-types.ts
var W = Symbol.for("paper-doll-wfrp4e.slot-type-filter");
function we() {
	return globalThis.ui?.paperDoll?.prototype ?? null;
}
function Te(e, t) {
	if (!e || typeof t != "function") throw Error("Paper Doll's required filterItems integration API is unavailable.");
}
function Ee() {
	let e = we(), t = e?.filterItems;
	if (Te(e, t), e[W] === !0) return;
	let n = t;
	e.filterItems = function(e, t, r) {
		return n.call(this, e, t, r).filter((e) => p(e) && x(e, t));
	}, e[W] = !0;
}
//#endregion
//#region src/module/patches/paper-doll/register-slot-tooltips.ts
var G = ".paper-doll .paper-doll-slot", K = `data-${C}-drag-tooltip`, q = `data-${C}-tooltip`, J = `data-${C}-original-tooltip`, De = {
	HEAD: {
		key: `${C}.SlotTooltip.Head`,
		fallback: "Head armour"
	},
	CAPE: {
		key: `${C}.SlotTooltip.Cape`,
		fallback: "Aesthetic Item"
	},
	BODY: {
		key: `${C}.SlotTooltip.Body`,
		fallback: "Body armour"
	},
	GLOVES: {
		key: `${C}.SlotTooltip.Gloves`,
		fallback: "Arm armour"
	},
	BOOTS: {
		key: `${C}.SlotTooltip.Boots`,
		fallback: "Leg armour"
	},
	TRINKET: {
		key: `${C}.SlotTooltip.Trinket`,
		fallback: "Ready Item"
	},
	PENDANT: {
		key: `${C}.SlotTooltip.Pendant`,
		fallback: "Amulet"
	},
	RING: {
		key: `${C}.SlotTooltip.Ring`,
		fallback: "Worn Item"
	},
	WRIST_LEFT: {
		key: `${C}.SlotTooltip.WristLeft`,
		fallback: "Light Source"
	},
	WRIST_RIGHT: {
		key: `${C}.SlotTooltip.WristRight`,
		fallback: "Quick Use Item"
	},
	MAIN_LEFT: {
		key: `${C}.SlotTooltip.MainLeft`,
		fallback: "Main hand"
	},
	MAIN_RIGHT: {
		key: `${C}.SlotTooltip.MainRight`,
		fallback: "Off hand"
	}
}, Y = !1;
function Oe(e) {
	if (!(e instanceof Element)) return null;
	let t = e.closest(G);
	return t?.closest(".paper-doll") ? t : null;
}
function ke() {
	document.querySelectorAll(`[${q}]`).forEach((e) => {
		let t = e.getAttribute(J);
		t ? e.dataset.tooltip = t : e.removeAttribute("data-tooltip"), e.removeAttribute(q), e.removeAttribute(J);
	});
}
function Ae() {
	document.querySelectorAll(G).forEach((e) => {
		let t = e.getAttribute("data-tooltip");
		t && (e.setAttribute(K, t), e.removeAttribute("data-tooltip"));
	});
}
function je() {
	document.querySelectorAll(`[${K}]`).forEach((e) => {
		let t = e.getAttribute(K);
		t && (e.dataset.tooltip = t), e.removeAttribute(K);
	});
}
function Me(e) {
	if (Y || e.hasAttribute(q)) return;
	let t = De[e.dataset.id ?? ""];
	if (!t || !game) return;
	let n = game.i18n.localize(t.key), r = n === t.key ? t.fallback : n, i = e.dataset.tooltip;
	i && e.setAttribute(J, i), e.dataset.tooltip = i ? `${r}: ${i}` : r, e.setAttribute(q, "");
}
function Ne(e) {
	let t = Oe(e.target);
	t && Me(t);
}
function Pe() {
	Y = !0, ke(), Ae();
}
function Fe() {
	Y = !1, je();
}
function Ie() {
	document.addEventListener("pointerover", Ne, !0), document.addEventListener("dragstart", Pe, !0), document.addEventListener("dragend", Fe, !0);
}
//#endregion
//#region src/module/patches/paper-doll/register-paper-doll-hooks.ts
var X = /* @__PURE__ */ new Map();
function Z() {
	return game?.system.id === "wfrp4e" && game.modules.get("fvtt-paper-doll-ui")?.active === !0;
}
function Le(e) {
	if (!d(e) || !("flags" in e)) return { kind: "absent" };
	let t = e.flags;
	if (!d(t)) return {
		kind: "malformed",
		reason: "the flags update is not an object"
	};
	if (!("fvtt-paper-doll-ui" in t)) return { kind: "absent" };
	let n = t[E];
	return d(n) ? "slots" in n ? u(n.slots) ? {
		kind: "valid",
		state: n[D]
	} : {
		kind: "malformed",
		reason: "the Paper Doll slots update has an invalid shape"
	} : { kind: "absent" } : {
		kind: "malformed",
		reason: "the Paper Doll flag update is not an object"
	};
}
function Q(e) {
	let t = Le(e);
	if (t.kind === "malformed") throw Error(`Paper Doll slot update cannot be synchronized: ${t.reason}.`);
	return t.kind === "valid" ? t.state : null;
}
function $(e, t) {
	return Array.from(e.items).find((e) => e.uuid === t) ?? null;
}
function Re(e, t) {
	let n = X.get(e.uuid) ?? /* @__PURE__ */ new Set();
	n.add(t), X.set(e.uuid, n);
}
function ze(e) {
	if (!d(e) || typeof e.slotId != "string") return null;
	let t = Number(e.slotIndex);
	return Number.isInteger(t) ? {
		slotId: e.slotId,
		slotIndex: t
	} : null;
}
function Be(e, t, n) {
	if (!(!Z() || !f(e))) for (let r of [t, n]) {
		if (!d(r) || typeof r.item != "string") continue;
		let t = ze(r), n = t ? $(e, r.item) : null;
		n && t && x(n, t.slotId) && T(S(e, n, t), `could not equip ${n.name} after a Paper Doll slot swap`);
	}
}
function Ve(e, t) {
	if (!Z() || !f(e) || F(e)) return;
	let n = Q(t);
	if (!n) return;
	let r = e.getFlag(E, D);
	if (r !== void 0) {
		if (!u(r)) throw Error("Paper Doll's existing slot flag has an invalid shape.");
		for (let t of ye(r, n)) {
			if (!t.from) continue;
			let n = $(e, t.from);
			n && (!t.to || n.type !== "armour") && Re(e, n.uuid);
		}
	}
}
function He(e, t) {
	if (!Z() || !f(e) || !Q(t)) return;
	let n = X.get(e.uuid);
	if (X.delete(e.uuid), !n?.size) return;
	let r = Array.from(n, (t) => $(e, t)).filter((e) => e !== null);
	T(Promise.all(r.map(fe)), `could not unequip removed Paper Doll items for ${e.uuid}`);
}
function Ue(e) {
	!Z() || !p(e) || e.type !== "armour" && e.type !== "weapon" && !le(e) || f(e.parent) && ge(e.parent);
}
function We() {
	Ie(), Hooks.on("paper-doll-swap", Be), Hooks.on("preUpdateActor", Ve), Hooks.on("updateActor", He), Hooks.on("updateItem", Ue), Hooks.once("ready", () => {
		if (Z()) {
			try {
				Ee(), Ce();
			} catch (e) {
				throw w("could not initialize the required Paper Doll integration", e), e;
			}
			T(B(), "could not synchronize all equipped items at startup");
		}
	});
}
//#endregion
//#region src/module/hooks/register-module-hooks.ts
function Ge() {
	Hooks.once("init", () => {
		ve(), We();
	});
}
//#endregion
//#region src/main.ts
Ge();
//#endregion

//# sourceMappingURL=paper-doll-wfrp4e.mjs.map