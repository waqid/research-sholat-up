<?php

main($argv);
exit;




function main($a) {

	$myself = array_shift($a); // $a[0] is always the script/exe name
	$path   = array_shift($a); if($path==="?") die(syntaxHelp());
	$path   = $path?:".";
	$path	= realpath($path);
	$sizes  = [];
	
	foreach(glob("$path/*",GLOB_ONLYDIR) as $dir) {
		$dir = winSlashes($dir);
		$name = basename($dir);
		printf("\rScanning %-50s",substr($name,0,47)."...");
		$sizes[$dir] = getFolderSize($dir);
	}
	
	if(!count($sizes)) die("No children of this folder ($path)\n");
	
	printf("\r%-60s\n\n","Children of $path:");
	showChart($sizes);
	
}



#;
function syntaxHelp() {

	return "\n".ltrim(strtr("

dirstats                                             (a PHPFlexer example tool) 
-------------------------------------------------------------------------------

	Displays a summary of subfolder sizes, with a chart display on the right.
	Well, not much of a chart display but it will show you the heaviest guys.
   

	Syntax:

		dirstats <path>
		
	Example:

		dirstats d:/dev/steve/public_html

",["\t"=>"    "]));
                                  
}



#;
function winSlashes($s) {
	return strtr($s,'/','\\');
}



#;
function getFolderSize($start) {
	
	exec("dir \"$start\" /s",$a);
	$a = array_slice($a,-2,1);
	$size = array_shift($a);
	$size = explode(")",$size)[1];
	$size = preg_replace("/[^0-9]/","",$size);
	return intval($size);

}



#;
function showChart($folderSizes) {
	$a = $folderSizes;
	$m = 0;foreach($a as $dir=>$sum) $m = max($m,$sum); if(!$m) return;
	$r = 20/$m;
	print "       Total size   Folder                           Chart\n";
	print "-------------------------------------------------------------------------------\n";
	foreach($a as $dir=>$sum) {
		$name = basename($dir);
		$bar = str_repeat("#",ceil($sum*$r));
		printf("  %15s | %-30s | %s\n",number_format($sum),substr($name,0,30),$bar);
	}
}



#;


