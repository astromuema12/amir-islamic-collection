<?php
/**
 * Fallback entry point — used when mod_rewrite is disabled.
 * Passes through to public/index.php with the correct URL parameter.
 */

$scriptDir = rtrim(dirname($_SERVER['SCRIPT_NAME']), '/\\');
$requestUri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

if ($scriptDir && $scriptDir !== '.' && strpos($requestUri, $scriptDir) === 0) {
    $relativePath = substr($requestUri, strlen($scriptDir));
} else {
    $relativePath = $requestUri;
}

$_GET['url'] = ltrim($relativePath, '/');

require __DIR__ . '/public/index.php';
