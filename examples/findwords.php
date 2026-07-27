<?php

main($argv);
exit;




function main($a) {

	$myself = array_shift($a);
	$files  = array_shift($a); if((!$files)or($files==="?")) die(syntaxHelp());
	$words  = arrayLower($a); // all the rest
	foreach(glob($files) as $f) parseOneFile($f,$words);
	
}



#;
function arrayLower($a) {
	foreach($a as $i=>$x) $a[$i] = strtolower($x);
	return $a;
}



#;
function parseOneFile($filename,$words) {

	$head = "$filename:\n";	
	$f = fopen($filename,"r"); if(!$f) return;
	$line = 0;
	while(!feof($f)) {
		++$line;
		$s = rtrim(fgets($f));
		if(containsAllWords($s,$words)) {
			printf("%s%5d | %s\n",$head,$line,trim($s));
			$head="";
		}
	}
	fclose($f);
	
}



#;
function containsAllWords($s,$words) {

	$s = strtolower($s);
	foreach($words as $w) if(false===strpos($s,$w)) return false;
	return true;
	
}



#;
function syntaxHelp() {

	return "\n".ltrim(strtr("

findwords                                            (a PHPFlexer example tool) 
-------------------------------------------------------------------------------

	Finds lines where all your words occur. You give it a file mask and a
	list of words and it will show you which files contain those words in
	the same line together, in any order. Typically a feature that cannot
	be found in a lot of search tools and sometimes we miss it painfully.
   

Syntax:

	findwords <filemask> <word1> <word2> ...
		
Example:

	findwords *.php func db get
	findwords access*.log GET index 304
	findwords marvelmovies.txt stark rodgers romanova

",["\t"=>"    "]));

}



#;

