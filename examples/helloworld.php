<?php

// Open standard input for reading
$stdin = fopen("php://stdin", "r");

// Print a welcome message
print "This is a two-way Hello World application.\n";
print "Please enter your name: ";

// Read the user's input and trim any whitespace
$name = trim(fgets($stdin));

// Print a friendly greeting
print "So,\n\n";
print "\tWorld: Hello $name!!\n";
print "\t$name: Hello World!!\n\n";
print "Now you're friends.\n";

// Close the standard input
fclose($stdin);
?>
