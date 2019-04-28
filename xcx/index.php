<?php

if (version_compare(PHP_VERSION, '5.3.0', '<')) die('require PHP > 5.3.0 !');
define('APP_DEBUG', true);
define('APP_PATH', './Application/');
define('BUILD_DIR_SECURE', false);
header('Content-Type:text/html; charset=utf8');
require '../ThinkPHP/ThinkPHP.php';