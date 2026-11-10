<?php
/**
 * Dev-only renderer: reproduces the JS that the filemanager popup emits, so the
 * generated code can be inspected without a browser.
 *
 * Run:  php docs/tools/_test/render_filemanager_popup.php
 */
chdir(__DIR__ . "/../../../src/mwap");
include_once "preinit.php";

$fnc = new mwmod_mw_jsobj_functionext();
$fnc->add_fnc_arg("e");
$fnc->add_cont("console.log('onSelectedFileOpened',e);\n");
$fnc->add_cont("if(!e.file){\n");
$fnc->add_cont("    console.warn('No se ha seleccionado ningún archivo');\n");
$fnc->add_cont("    return;\n");
$fnc->add_cont("}\n");
$fnc->add_cont("var fileUrl='/dlf/'+e.file.path;\n");
$fnc->add_cont("var fileData={url:fileUrl,path:e.file.path,name:e.file.name,isDirectory:false};\n");
$fnc->add_cont("if(window.opener&&typeof(window.opener.mw_filepicker_receive)==='function'){\n");
$fnc->add_cont("    window.opener.mw_filepicker_receive(fileData,window.name);\n");
$fnc->add_cont("}\n");

$params = new mwmod_mw_jsobj_obj();
$params->set_prop("name", "fm1");
$params->set_prop("height", 400);
$params->set_prop("onSelectedFileOpened", $fnc);

echo "=== set_prop(functionext) ===\n";
echo $params->get_as_js_val() . "\n\n";

$nested = new mwmod_mw_jsobj_obj();
$nested->set_prop("blob", $fnc);
$nested->set_prop("plain", "text");
$arr = $nested->get_array_prop("list");
$arr->add_data("a");

echo "=== nested function value ===\n";
echo $nested->get_as_js_val() . "\n";
