/**
 * Smoke test for mw_datainput_item_tinymce + mw_file_picker.
 * Runs in Node with a stubbed DOM and a stubbed window.tinymce.
 *
 *   node mw_tinymce_smoke.js <res/js path>
 */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const JS_DIR = process.argv[2];
if (!JS_DIR) {
	console.error("usage: node mw_tinymce_smoke.js <res/js path>");
	process.exit(2);
}

let checks = 0, fails = 0;
function ok(cond, label) {
	checks++;
	if (cond) {
		console.log("  PASS  " + label);
	} else {
		fails++;
		console.log("  FAIL  " + label);
	}
}

// ---------------------------------------------------------------
// Minimal environment (semantics copied from res/js/main.js)
// ---------------------------------------------------------------
global.window = global;

global.mw_is_object = function (d, f) {
	if (!d) return false;
	if (typeof d == "object") {
		if (!f) return true;
		return typeof d[f] == "function";
	}
	return false;
};
global.mw_is_function = function (d) { return !!d && typeof d == "function"; };
global.mw_is_array = function (d) {
	return global.mw_is_object(d) && Object.prototype.toString.apply(d) == "[object Array]";
};
global.mw_isNumber = function (n) {
	if (n === null || n === undefined || n === "") return false;
	return !isNaN(parseFloat(n)) && isFinite(n);
};
global.mw_dom_remove_children = function () { };
global.mw_hide_obj = function () { };
global.mw_show_obj = function () { };
global.Globalize = { localize: function (s) { return s; } };

// Compact mw_obj supporting the dot notation used by the framework.
global.mw_obj = function () {
	this.params = {};
	this._get = function (cod) {
		if (!cod) return this.params;
		var list = (cod + "").split(".");
		var p = this.params;
		for (var i = 0; i < list.length; i++) {
			if (p === undefined || p === null || typeof p != "object") return undefined;
			p = p[list[i]];
		}
		return p;
	};
	this.set_params = function (d) { if (d && typeof d == "object") { this.params = d; return true; } return false; };
	this.param_exists = function (cod) { return this._get(cod) !== undefined; };
	this.get_param = function (cod) { return this._get(cod); };
	this.get_param_or_def = function (cod, def, nullIfEmpty) {
		var v = this._get(cod);
		if (v === undefined || v === null) return def;
		if (nullIfEmpty && v === "") return def;
		return v;
	};
	this.set_param = function (v, cod) {
		var list = (cod + "").split(".");
		var p = this.params;
		for (var i = 0; i < list.length - 1; i++) {
			if (typeof p[list[i]] != "object") p[list[i]] = {};
			p = p[list[i]];
		}
		p[list[list.length - 1]] = v;
		return true;
	};
	this.set_param_default = function (v, cod) {
		if (this._get(cod) === undefined) return this.set_param(v, cod);
		return false;
	};
	this.get_param_if_object = function (cod, createifnone) {
		var r = this._get(cod);
		if (global.mw_is_object(r)) return r;
		return createifnone ? {} : false;
	};
	this.get_param_if_function = function (cod) {
		var r = this._get(cod);
		return global.mw_is_function(r) ? r : false;
	};
	this.get_param_as_list = function (cod) {
		var r = this._get(cod);
		return global.mw_is_array(r) ? r : false;
	};
};

// Fake DOM (rich enough for mw_file_picker's modal)
function makeEl(tag) {
	var el = {
		tagName: tag,
		children: [],
		attributes: {},
		style: {},
		parentNode: null,
		listeners: {},
		appendChild: function (e) {
			e.parentNode = this;
			this.children.push(e);
			return e;
		},
		removeChild: function (e) {
			var i = this.children.indexOf(e);
			if (i >= 0) this.children.splice(i, 1);
			e.parentNode = null;
			return e;
		},
		setAttribute: function (k, v) { this.attributes[k] = v; },
		getAttribute: function (k) { return this.attributes[k]; },
		addEventListener: function (evt, fnc) {
			(this.listeners[evt] = this.listeners[evt] || []).push(fnc);
		},
		removeEventListener: function (evt, fnc) {
			var l = this.listeners[evt];
			if (!l) return;
			var i = l.indexOf(fnc);
			if (i >= 0) l.splice(i, 1);
		},
		fire: function (evt, ev) {
			var l = this.listeners[evt] || [];
			return l.map(function (f) { return f(ev || {}); });
		}
	};
	return el;
}

global.document = {
	head: makeEl("head"),
	body: makeEl("body"),
	createElement: makeEl,
	createTextNode: function (t) { return { nodeValue: t, text: t }; },
	getElementById: function (id) {
		var found = null;
		(function walk(n) {
			if (found) return;
			if (n.id === id || (n.attributes && n.attributes.id === id)) { found = n; return; }
			(n.children || []).forEach(walk);
		})(global.document.head);
		return found;
	},
	addEventListener: function () { },
	removeEventListener: function () { }
};

// jQuery stub: the base input classes only use the chainable setters.
function fakeJQ(el) {
	return {
		el: el,
		prop: function (k, v) { if (v !== undefined) el[k] = v; return this; },
		css: function () { return this; },
		addClass: function () { return this; },
		removeClass: function () { return this; },
		attr: function () { return this; },
		append: function () { return this; },
		html: function () { return this; }
	};
}
global.$ = fakeJQ;
global.jQuery = { extend: function () {
	var deep = arguments[0] === true;
	var target = arguments[deep ? 1 : 0];
	for (var i = (deep ? 2 : 1); i < arguments.length; i++) {
		var src = arguments[i];
		for (var k in src) {
			if (!Object.prototype.hasOwnProperty.call(src, k)) continue;
			if (deep && src[k] && typeof src[k] === 'object' && !Array.isArray(src[k])) {
				target[k] = global.jQuery.extend(true, target[k] || {}, src[k]);
			} else {
				target[k] = src[k];
			}
		}
	}
	return target;
} };

// ---------------------------------------------------------------
// Load the framework files under test
// ---------------------------------------------------------------
["inputs/inputs.js", "inputs/other.js", "inputs/tinymce.js", "mw_file_picker.js"].forEach(function (f) {
	const p = path.join(JS_DIR, f);
	vm.runInThisContext(fs.readFileSync(p, "utf8"), { filename: p });
});

// ---------------------------------------------------------------
// Fake TinyMCE
// ---------------------------------------------------------------
let initOpts = null;
let fakeEditor = null;
const fakeEditors = [];

function makeEditor(opts) {
	const listeners = {};
	const ed = {
		opts: opts,
		content: "<p>init</p>",
		buttons: {},
		modeValue: false,
		inserted: [],
		removed: false,
		dom: { encode: function (s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); } },
		ui: { registry: { addButton: function (n, cfg) { ed.buttons[n] = cfg; } } },
		on: function (evts, fnc) {
			evts.split(" ").forEach(function (e) { (listeners[e] = listeners[e] || []).push(fnc); });
		},
		fire: function (e) { (listeners[e] || []).forEach(function (f) { f(); }); },
		getContent: function () { return ed.content; },
		setContent: function (v) { ed.content = v; },
		insertContent: function (v) { ed.inserted.push(v); ed.content = ed.content + v; },
		focus: function () { },
		mode: { set: function (v) { ed.modeValue = v; } },
		remove: function () { ed.removed = true; }
	};
	fakeEditors.push(ed);
	return ed;
}

global.tinymce = {
	init: function (opts) {
		initOpts = opts;
		const ed = makeEditor(opts);
		fakeEditor = ed;
		if (opts.setup) opts.setup(ed);
		return { then: function (cb) { cb([ed]); } };
	}
};

// Fake popup helper to capture the file picked
let pickerCalls = [];
global.mw_file_picker = {
	open: function (opts, cb) {
		pickerCalls.push({ opts: opts, cb: cb });
		// simulate the user picking a file immediately
		cb({ url: "/files/photo.png", path: "photo.png", name: "photo.png", isDirectory: false });
		return {};
	}
};

// ---------------------------------------------------------------
// Test the input
// ---------------------------------------------------------------
console.log("\n== mw_datainput_item_tinymce ==");

const phModalCalls = [];
const phMan = {
	openModalForMWInput: function (elem) { phModalCalls.push(elem); return true; }
};

const input = new global.mw_datainput_item_tinymce({
	cod: "html",
	value: "<p>hello</p>",
	height: 420,
	filemanurl: "/admin/index.php?cmd=json_fileman",
	imagemanurl: "/admin/index.php?cmd=json_fileman&mode=images",
	placeholderman: phMan,
	editorcfg: { plugins: ["lists", "link"], toolbar: "bold italic" }
});

ok(!!input, "instance created");
ok(input.cod === "html", "cod set by init()");

input.beforeAppend();
ok(input.orig_value === "<p>hello</p>", "beforeAppend captured the value");
input.afterAppend();

ok(!!initOpts, "tinymce.init() called on afterAppend");
ok(!!input.getEditor(), "editor instance exposed with getEditor()");

// --- options built by the input ---
ok(initOpts.target && initOpts.target.tagName === "textarea", "textarea used as target");
ok(initOpts.height === 420, "height param applied");
ok(initOpts.language === "es", "default language es");
ok(initOpts.promotion === false, "promotion disabled (no Upgrade button)");
ok(JSON.stringify(initOpts.plugins) === '["lists","link"]', "caller editorcfg.plugins preserved");
ok(initOpts.toolbar.indexOf("bold italic") === 0, "caller editorcfg.toolbar preserved");
ok(initOpts.toolbar.indexOf("mwplaceholders") > -1, "placeholders button appended to the toolbar");
ok(global.mw_is_function(initOpts.setup), "setup chained");
ok(global.mw_is_function(initOpts.file_picker_callback), "file_picker_callback installed");
ok(initOpts.target.id.indexOf("html_tinymce_") === 0, "unique DOM id generated: " + initOpts.target.id);

// --- editor wiring ---
ok(!!fakeEditor.buttons["mwplaceholders"], "mwplaceholders button registered");
fakeEditor.fire("init");
ok(fakeEditor.modeValue === "design", "mode design after the init event");

// --- defaults that shape the UI ---
ok(initOpts.menubar === false, "menubar disabled (no File/Edit menus)");
ok(initOpts.toolbar_mode === "wrap", "toolbar wraps instead of overflowing");
ok(initOpts.convert_urls === false, "convert_urls disabled (absolute URLs kept)");
ok(initOpts.relative_urls === false, "relative_urls disabled");
ok(initOpts.remove_script_host === false, "remove_script_host disabled");

// --- textarea sync (TinyMCE does not update it) ---
fakeEditor.content = "<p>only in the editor</p>";
ok(input.input_elem.value !== "<p>only in the editor</p>", "textarea is NOT synced by TinyMCE itself");
ok(input.syncInputElem() === true, "syncInputElem() reports success");
ok(input.input_elem.value === "<p>only in the editor</p>", "syncInputElem() copies the content");

const fakeForm = makeEl("form");
const prevEditor = fakeEditor;
const prevInitOpts = initOpts;
const formInput = new global.mw_datainput_item_tinymce({
	cod: "body",
	editorcfg: { plugins: ["lists"], toolbar: "bold" }
});
formInput.beforeAppend();
formInput.afterAppend();
formInput.input_elem.form = fakeForm;
ok(formInput.attachFormSync() === true, "attachFormSync hooks the form");
fakeEditor.content = "<p>submitted value</p>";
formInput.input_elem.value = "";
fakeForm.fire("submit");
ok(formInput.input_elem.value === "<p>submitted value</p>", "form submit syncs the textarea (capture phase)");
ok(formInput.attachFormSync() === true, "attachFormSync is idempotent");
ok(fakeForm.listeners["submit"].length === 1, "only one submit listener per form");
formInput.destroy();
fakeEditor = prevEditor;  // tinymce.init() stub reassigns these
initOpts = prevInitOpts;


// --- value round trip ---
fakeEditor.content = "<p>typed by the user</p>";
ok(input.get_input_value() === "<p>typed by the user</p>", "get_input_value reads the editor");
input.set_input_value("<b>set from code</b>");
ok(fakeEditor.content === "<b>set from code</b>", "set_input_value writes the editor");
ok(input.input_elem.value === "<b>set from code</b>", "textarea kept in sync");
input.set_input_value(null);
ok(fakeEditor.content === "" && input.input_elem.value === "", "null normalised to empty string");

// --- placeholders ---
fakeEditor.inserted = [];
input.insertText("[[customer.fullName]]");
ok(fakeEditor.inserted[0] === "[[customer.fullName]]", "insertText inserts the raw token");
ok(fakeEditor.inserted.length === 1, "insertText inserts exactly one token");
ok(fakeEditor.inserted[0].indexOf("&amp;") < 0, "token not double encoded");

fakeEditor.inserted = [];
input.insertText("a & b <tag>");
ok(fakeEditor.inserted[0].indexOf("&amp;") > -1, "insertText encodes HTML entities");
ok(fakeEditor.inserted[0].indexOf("&lt;tag&gt;") > -1, "insertText encodes < >");

ok(input.getPHMan() === phMan, "getPHMan returns the configured manager");
fakeEditor.buttons["mwplaceholders"].onAction();
ok(phModalCalls.length === 1 && phModalCalls[0] === input,
	"toolbar button opens the Meralda placeholder modal with the input as target");

// --- file picker ---
pickerCalls = [];
let picked = null;
initOpts.file_picker_callback(function (url, meta) { picked = { url: url, meta: meta }; }, "", { filetype: "image" });
ok(pickerCalls.length === 1, "picker popup opened");
ok(pickerCalls[0].opts.url.indexOf("mode=images") > -1, "image picker used imagemanurl");
ok(picked && picked.url === "/files/photo.png", "cb() received the selected url");
ok(picked.meta && picked.meta.alt === "photo.png", "image meta carries alt/title");

pickerCalls = [];
picked = null;
initOpts.file_picker_callback(function (url, meta) { picked = { url: url, meta: meta }; }, "", { filetype: "file" });
ok(pickerCalls[0].opts.url.indexOf("mode=images") < 0, "link picker used filemanurl");
ok(picked.meta && picked.meta.text === "photo.png", "link meta carries text/title");

// --- read only ---
input.setReadOnly(true);
ok(fakeEditor.modeValue === "readonly", "setReadOnly(true) puts the editor in readonly");
input.setReadOnly(false);
ok(fakeEditor.modeValue === "design", "setReadOnly(false) restores design");

// --- hidden form + destroy ---
const hiddenContainer = { children: [], appendChild: function (e) { this.children.push(e); } };
fakeEditor.content = "<p>to submit</p>";
input.append2hiddenFrm(hiddenContainer);
const hiddenArea = hiddenContainer.children[0].children[0];
ok(hiddenArea.value === "<p>to submit</p>", "append2hiddenFrm carries the editor content");
ok(hiddenArea.name === "html", "append2hiddenFrm carries the input name");

input.destroy();
ok(fakeEditor.removed === true, "destroy() removes the TinyMCE instance");

// --- fallbacks when no placeholderman / no fileman ---
console.log("\n== fallbacks ==");
initOpts = null;
const bare = new global.mw_datainput_item_tinymce({ cod: "txt" });
bare.beforeAppend();
bare.afterAppend();
ok(!!initOpts, "input works without editorcfg / placeholderman");
ok(initOpts.toolbar.indexOf("mwplaceholders") < 0, "no placeholders button without a manager");
ok(initOpts.plugins.length >= 4, "default plugin list applied");
let warned = false;
const oldWarn = console.warn;
console.warn = function () { warned = true; };
initOpts.file_picker_callback(function () { }, "", { filetype: "image" });
console.warn = oldWarn;
ok(warned === true, "missing fileman warns instead of throwing");
ok(bare.get_input_value() !== undefined, "get_input_value safe before the editor exists");

// ---------------------------------------------------------------
console.log("\n== mw_file_picker (iframe modal) ==");
const opened = [];
global.window.open = function (url, name) {
	opened.push({ url: url, name: name });
	return { focus: function () { }, closed: false };
};
// reload the real helper over the stub
vm.runInThisContext(fs.readFileSync(path.join(JS_DIR, "mw_file_picker.js"), "utf8"));

let answer = null;
const handle = global.mw_file_picker.open({ url: "/picker", title: "Pick" }, function (d) { answer = d; });
ok(!!handle, "open() returns a handle");
ok(opened.length === 0, "no window is opened in the default (modal) mode");
ok(global.mw_is_function(global.window.mw_filepicker_receive), "receiver installed on the page");

const token = handle.token;
ok(/^mw_filepicker_\d+$/.test(token), "unique token: " + token);

// the overlay is appended to body, with a titled header and a named iframe
const overlay = global.document.body.children[0];
ok(!!overlay && overlay.className === "mwfp-overlay", "overlay appended to body");
const box = overlay.children[0];
const frame = box.children[1];
ok(box.children[0].className === "mwfp-head", "header present");
ok(frame.tagName === "iframe" && frame.name === token, "iframe named with the token");
ok(frame.src === "/picker", "iframe src is the picker url");
ok(global.document.body.style.overflow === "hidden", "body scroll locked while open");
ok(!!global.document.getElementById("mw_file_picker_css"), "stylesheet injected once");

// other pickers can be open at the same time
const handle2 = global.mw_file_picker.open({ url: "/picker2" }, function () { });
ok(handle2.token !== token, "second picker gets its own token");
ok(Object.keys(global.mw_file_picker._handlers).length === 2, "two pending handlers");
global.mw_file_picker.close(handle2.token);

// the picker page answers via window.parent -> receiver
global.window.mw_filepicker_receive({ url: "/a.png", path: "p/a.png", name: "a.png" }, token);
ok(answer && answer.url === "/a.png", "answer routed to the right callback");
ok(global.document.body.children.length === 0, "modal removed after delivery");
ok(global.document.body.style.overflow === "", "body scroll restored");
ok(Object.keys(global.mw_file_picker._handlers).length === 0, "handler consumed");

// an empty answer closes without calling back
let emptyCalled = false;
const h3 = global.mw_file_picker.open({ url: "/p3" }, function () { emptyCalled = true; });
global.window.mw_filepicker_receive({ url: "" }, h3.token);
ok(emptyCalled === false, "empty answer does not call the callback");
ok(global.document.body.children.length === 0, "modal removed on empty answer");

// unknown token is ignored
let unknownWarn = false;
const oldWarn3 = console.warn;
console.warn = function () { unknownWarn = true; };
global.window.mw_filepicker_receive({ url: "/x.png" }, "nope");
console.warn = oldWarn3;
ok(unknownWarn === true, "unknown token warns and does not throw");

// window mode still available
opened.length = 0;
const wh = global.mw_file_picker.open({ url: "/picker", mode: "window" }, function () { });
ok(opened.length === 1, "mode:'window' opens a real window");
ok(/^mw_filepicker_\d+$/.test(opened[0].name), "window name is the token");
ok(!!wh, "window handle returned");
wh.close();

// blocked window returns false and leaks nothing
opened.length = 0;
let blockedWarn = false;
const oldWarn2 = console.warn;
console.warn = function () { blockedWarn = true; };
global.window.open = function () { return null; };
const blocked = global.mw_file_picker.open({ url: "/picker", mode: "window" }, function () { });
console.warn = oldWarn2;
ok(blocked === false, "blocked popup returns false");
ok(blockedWarn === true, "blocked popup warns");
ok(Object.keys(global.mw_file_picker._handlers).length === 0, "no handler leaked when blocked");

// ---------------------------------------------------------------
console.log("\n" + (fails === 0 ? "ALL PASS" : "FAILURES: " + fails) + "  (" + checks + " checks)");
process.exit(fails === 0 ? 0 : 1);
