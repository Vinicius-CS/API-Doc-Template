<?php

$xml = ''; // xml definition file
$tags = []; // main tags

// ------------------------------------------------------------------------------------------------------------------------------
// INITIALISATION
// ------------------------------------------------------------------------------------------------------------------------------
// Load the XML file
$xml = simplexml_load_file('api-definition.xml');

// Check if the XML file is loaded successfully
if (!$xml)
	die("Config file is missing");

// Load the translations
$currentLanguage = isset($xml->Language) ? trim($xml->Language) : 'en';
echo "<script>
	let currentLanguage = '$currentLanguage';
	let translations = [];
</script>";

InitTags();

// ------------------------------------------------------------------------------------------------------------------------------
// HEADER
// ------------------------------------------------------------------------------------------------------------------------------

$content = ProcessFile('header.html');
echo $content;

// ------------------------------------------------------------------------------------------------------------------------------
// VERTICAL LEFT NAVIGATION
// ------------------------------------------------------------------------------------------------------------------------------

echo ('<body>');

$content = ProcessFile('start-1.html');
echo $content;

// Generate the <ul><li></li></ul> tags
$output = '';
foreach ($xml->APIfunction as $item)
{
	$visible = ( isset($item->visible) ? $item->visible[0] : "true" );
	if( strtolower($visible) == "false" )
		continue;

		$output .= '<li class="scroll-to-link active" data-target="' . $item->source . '">';
		$output .= '<a>' . $item->title . '</a>';
		$output .= '</li>';
}

// Display the generated HTML
echo '<ul>' . $output . '</ul>';

// ------------------------------------------------------------------------------------------------------------------------------
// CONTENT
// ------------------------------------------------------------------------------------------------------------------------------

$output = '</div>';
$output .= '</div>';
$output .= '<div class="content-page">';
$output .= '<div class="content-code"></div>';
$output .= '<div class="content">';
echo $output;

foreach ($xml->APIfunction as $item)
{
	$visible = strtolower(( isset($item->visible) ? $item->visible[0] : "true" ));
	if( $visible == "false" )
		continue;

	$type = strtolower(( isset($item->type) ? $item->type : "html" ));
	$file = 'content/' . $item->source . '.' . $type;

	if ( file_exists($file) == false )
	{
		$output = '<div class="overflow-hidden content-section" id="' . $item->source . '">';
		$output .= '<h1>' . $item->title . '</h1>';
		$output .= '<p>FILE NOT FOUND : ' . $file .' !<p>';
		$output .= '</div>'	;
		echo $output;
		continue;
	}

	$fileContents = ProcessFile( $file );
	if( $fileContents == false )
		continue;

	if( $type == 'php' )
	{
		$tmpfname = tempnam(sys_get_temp_dir(), "");
		rename($tmpfname, $tmpfname .= '.php');
		file_put_contents($tmpfname, $fileContents );

		include ( $tmpfname );

		unlink( $tmpfname );
	}
	else
	{
		$output = '<div class="overflow-hidden content-section" id="' . $item->source . '">';
		$output .= '<h1 data-i18n=\'' . $item->i18n . '\'>' . $item->title . '<img src="./images/link-icon.svg" alt="Copy Link" class="link-icon" style="visibility: hidden;" onclick="copyLink(\'' . $item->source . '\')"></h1>';
		$output .= $fileContents;
		$output .= '</div>'	;

		echo $output;
	}
}


// ------------------------------------------------------------------------------------------------------------------------------
// FOOTER
// ------------------------------------------------------------------------------------------------------------------------------

$content = ProcessFile('end-1.html');
echo($content);

echo ('</body>');
echo ('</html>');

// ==============================================================================================================================
// == INTERNAL FUNCTIONS ========================================================================================================
// ==============================================================================================================================
function InitTags()
{
	global $xml, $tags;

	$tags['{{Version}}'] = (isset($xml->Version) ? trim($xml->Version) : '1.0.0');
	$tags['{{LastUpdate}}'] = (isset($xml->LastUpdate) ? trim($xml->LastUpdate) : '');
	$tags['{{MainTitle}}'] = (isset($xml->MainTitle) ? trim($xml->MainTitle) : '');
	$tags['{{TabTitle}}'] = (isset($xml->TabTitle) ? trim($xml->TabTitle) : '');
	$tags['{{Logo}}'] = (isset($xml->Logo) ? trim($xml->Logo) : 'images/logo.svg');
	$tags['{{HLTheme}}'] = (isset($xml->HLTheme) ? trim($xml->HLTheme) : 'hightlightjs-dark.css');
	$tags['{{EMail}}'] = (isset($xml->EMail) ? trim($xml->EMail) : '');

	$serversOptions = '';
	if (isset($xml->Servers)) {
			foreach ($xml->Servers->Server as $server) {
					$serverUrl = trim($server->url);
					$serverName = trim($server->name);
					$i18n = trim($server->i18n);
					$serversOptions .= '<option value=\'' . $serverUrl . '\' data-i18n=\'' . $i18n . '\'>' . $serverName . '</option>';
			}
	}
	$tags['{{Servers}}'] = $serversOptions;
}

function ProcessFile($filename)
{
	global $tags;

	$fileContents = file_get_contents($filename);
	$replacedContents = str_replace(array_keys($tags), array_values($tags), $fileContents);

	return $replacedContents;
}

?>
