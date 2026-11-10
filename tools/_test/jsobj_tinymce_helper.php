<?php
/**
 * Smoke test for mwmod_mw_jsobj_inputs_tinymce (the PHP helper).
 *
 * Renders the JS the helper produces and asserts the exact keys the JS input
 * (res/js/inputs/tinymce.js) reads.
 *
 *   php docs/tools/_test/jsobj_tinymce_helper.php
 */
chdir(__DIR__ . "/../../../src/mwap");
include_once "preinit.php";

$checks = 0;
$fails  = 0;

function ok($cond, $label) {
	global $checks, $fails;
	$checks++;
	if ($cond) {
		echo "  PASS  " . $label . "\n";
	} else {
		$fails++;
		echo "  FAIL  " . $label . "\n";
	}
}

/** @return string The JS snippet for one call, to assert on the rendered output. */
function js_of($fnc) {
	$gr = new mwmod_mw_jsobj_inputs_input("root", "mw_datainput_item_group");
	$fnc($gr);
	return $gr->get_as_js_val();
}

echo "\n== autoload ==\n";
ok(class_exists("mwmod_mw_jsobj_inputs_tinymce"), "class autoloads");
$r = new ReflectionClass("mwmod_mw_jsobj_inputs_tinymce");
ok($r->isSubclassOf("mwmod_mw_jsobj_inputs_input"), "extends the inputs base");
$file = $r->getFileName();
ok(strpos(str_replace("\\", "/", $file), "jsobj/inputs/tinymce.php") !== false,
	"resolved to jsobj/inputs/tinymce.php");

echo "\n== basic wiring ==\n";
$js = js_of(function ($gr) {
	$ed = $gr->addNewTinyMCE("html", "Contenido HTML");
	$ed->set_value("<p>hola</p>");
});
ok(strpos($js, "new mw_datainput_item_tinymce(") !== false, "renders the JS class");
ok(strpos($js, "lbl:'Contenido HTML'") !== false, "addNewTinyMCE sets the label");
// js_escape backslashes < and > : valid JS, the string value is the same.
ok(strpos(str_replace("\\", "", $js), "value:'<p>hola</p>'") !== false,
	"set_value reaches the JS side");
ok(strpos($js, "cod:'html'") !== false, "cod is emitted");

echo "\n== fluent setters ==\n";
$js = js_of(function ($gr) {
	$ed = $gr->addNewTinyMCE("html");
	$ret = $ed->setHeight(420)
		->setLang("es_MX")
		->setValidateOnKeyUp(true)
		->setFileManUrl("/fm")
		->setImageManUrl("/img")
		->setMenuBar(true)
		->setContentCss("/res/content.css")
		->setSchema("html5");
	ok($ret === $ed, "setters are chainable and return the input");
});
ok(strpos($js, "height:420") !== false, "setHeight");
ok(strpos($js, "lang:'es_MX'") !== false, "setLang");
ok(strpos($js, "validateonkeyup:true") !== false, "setValidateOnKeyUp");
ok(strpos($js, "filemanurl:'/fm'") !== false, "setFileManUrl");
ok(strpos($js, "imagemanurl:'/img'") !== false, "setImageManUrl");
ok(strpos($js, "menubar:true") !== false, "setMenuBar(true) overrides the JS default");
ok(strpos($js, "content_css:'/res/content.css'") !== false, "setContentCss");
ok(strpos($js, "schema:'html5'") !== false, "setSchema");

echo "\n== file picker shortcuts ==\n";
$js = js_of(function ($gr) {
	$gr->addNewTinyMCE("html")->setFilePickerUrls("/fm");
});
ok(strpos($js, "filemanurl:'/fm'") !== false, "setFilePickerUrls sets the file url");
ok(strpos($js, "imagemanurl:'/fm'") !== false, "setFilePickerUrls defaults images to the same url");

$js = js_of(function ($gr) {
	$gr->addNewTinyMCE("html")->setFilePickerUrls("/fm", "/img");
});
ok(strpos($js, "imagemanurl:'/img'") !== false, "setFilePickerUrls accepts a separate image url");

echo "\n== plugins / toolbar ==\n";
$js = js_of(function ($gr) {
	$gr->addNewTinyMCE("html")->setPlugins(array("lists", "link"));
});
ok(strpos($js, "plugins:['lists','link']") !== false, "setPlugins with an array emits a JS array");
ok(strpos($js, "plugins:{1:") === false, "setPlugins does not drop the first item");

$js = js_of(function ($gr) {
	$gr->addNewTinyMCE("html")->setPlugins("lists link");
});
ok(strpos($js, "plugins:'lists link'") !== false, "setPlugins with a string keeps the string");

$js = js_of(function ($gr) {
	$gr->addNewTinyMCE("html")->addPlugins(array("lists", "table"))->addPlugins("code media");
});
ok(strpos($js, "plugins:['lists','table','code','media']") !== false, "addPlugins merges and dedupes");
ok(substr_count($js, "'lists'") === 1, "addPlugins does not duplicate an existing plugin");

$js = js_of(function ($gr) {
	$gr->addNewTinyMCE("html")->setToolbar("bold | link");
});
ok(strpos($js, "toolbar:'bold | link'") !== false, "setToolbar with a string");

$js = js_of(function ($gr) {
	$gr->addNewTinyMCE("html")->setToolbar(array("bold", "italic"));
});
ok(strpos($js, "toolbar:'bold italic'") !== false, "setToolbar with an array is joined");

$js = js_of(function ($gr) {
	$gr->addNewTinyMCE("html")->setToolbar("bold")->addToolbarItems("link image");
});
ok(strpos($js, "toolbar:'bold | link image'") !== false, "addToolbarItems appends a group");

$js = js_of(function ($gr) {
	$gr->addNewTinyMCE("html")->addToolbarItems("bold");
});
ok(strpos($js, "toolbar:'bold'") !== false, "addToolbarItems works with no previous toolbar");

echo "\n== placeholders ==\n";
$js = js_of(function ($gr) {
	$ed = $gr->addNewTinyMCE("html");
	$man = $ed->setPlaceholders();
	ok($man instanceof mwmod_mw_jsobj_objcoladv_base, "setPlaceholders returns the catalog");
	ok($ed->getPlaceholdersMan() === $man, "getPlaceholdersMan returns the same catalog");

	$ed->addPlaceholder("customer.fullName", "Customer full name");
	$inputs = $ed->addPlaceholderWithParams("order.summary", "Order summary");
	$inputs->add_new_child("headline")->set_prop("lbl", "Headline");
	$ed->setPlaceholdersButtonLabel("Insertar marcador");
});
ok(strpos($js, "placeholderman:new mw_placeholders(") !== false, "renders the placeholders manager");
ok(strpos($js, "placeholder_xx") === false, "no placeholder junk");
ok(strpos($js, "cod:'customer.fullName'") !== false, "addPlaceholder emits the code");
ok(strpos($js, "lbl:'Customer full name'") !== false, "addPlaceholder emits the label");
ok(strpos($js, "lbl:'Order summary'") !== false, "addPlaceholderWithParams emits the label");
ok(strpos($js, "lbl:'Headline'") !== false, "params inputs accept children");
ok(strpos($js, "placeholders:{lbl:'Insertar marcador'}") !== false,
	"setPlaceholdersButtonLabel nests under placeholders");

$js = js_of(function ($gr) {
	$gr->addNewTinyMCE("html");
});
ok(strpos($js, "placeholderman") === false, "no catalog unless requested");

$js = js_of(function ($gr) {
	$ed = $gr->addNewTinyMCE("html");
	$shared = new mwmod_mw_jsobj_objcoladv_base("placeholderman", "mw_placeholders");
	$shared->add_new_child("order.number")->set_prop("lbl", "Order number");
	$ed->setPlaceholders($shared);
	ok($ed->getPlaceholdersMan() === $shared, "an existing catalog can be shared");
});
ok(strpos($js, "cod:'order.number'") !== false, "a shared catalog keeps its items");

echo "\n== state inheritance ==\n";
$js = js_of(function ($gr) {
	$ed = $gr->addNewTinyMCE("html");
	$ed->setReadOnly(true);
	$ed->setRequired(true);
});
ok(strpos($js, "state:{readOnly:true,required:true}") !== false
	|| (strpos($js, "readOnly:true") !== false && strpos($js, "required:true") !== false),
	"readOnly / required use the base state props");

echo "\n== array serialization (jsobj obj) ==\n";
$o = new mwmod_mw_jsobj_obj();
$o->set_prop("list", array("a", "b", "c"));
ok(strpos($o->get_as_js_val(), "list:['a','b','c']") !== false,
	"PHP 0-based list renders as a JS array");

$o = new mwmod_mw_jsobj_obj();
$o->set_prop("assoc", array("x" => "uno", "y" => "dos"));
ok(strpos($o->get_as_js_val(), "assoc:{x:'uno',y:'dos'}") !== false,
	"associative array renders as an object");

$o = new mwmod_mw_jsobj_obj();
$o->set_prop("zero", array(0 => "a", 5 => "b"));
$rendered = $o->get_as_js_val();
ok(strpos($rendered, "0:'a'") !== false, "key 0 is no longer dropped");
ok(strpos($rendered, "5:'b'") !== false, "the other keys are kept");

$o = new mwmod_mw_jsobj_obj();
$o->set_prop("empty", array());
ok(strpos($o->get_as_js_val(), "empty:{}") !== false, "an empty array renders as {}");

$o = new mwmod_mw_jsobj_obj();
$o->unassocArraysAsList = false;
$o->set_prop("list", array("a", "b"));
ok(strpos($o->get_as_js_val(), "list:{0:'a',1:'b'}") !== false,
	"unassocArraysAsList=false renders an object with every key");

$o = new mwmod_mw_jsobj_obj();
$o->set_prop("nested", array(array("a", "b"), array("c")));
ok(strpos($o->get_as_js_val(), "nested:[['a','b'],['c']]") !== false,
	"nested lists stay lists");

$o = new mwmod_mw_jsobj_obj();
$o->set_prop("mixed", array("k" => array("a", "b")));
ok(strpos($o->get_as_js_val(), "mixed:{k:['a','b']}") !== false,
	"a list inside an object is still a list");

echo "\n" . ($fails === 0 ? "ALL PASS" : "FAILURES: " . $fails) . "  (" . $checks . " checks)\n";
exit($fails === 0 ? 0 : 1);
