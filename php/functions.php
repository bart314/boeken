<?php

function load_env($path) {
    if (!file_exists($path)) {
        throw new RuntimeException(".env file not found: " . $path);
    }
    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (str_starts_with(trim($line), '#')) continue;
        [$name, $value] = explode('=', $line, 2);
        $_ENV[trim($name)] = trim($value);
    }
}

function check_referer() {
    if (!empty($_SERVER['HTTP_REFERER'])) {
        $refererHost = parse_url($_SERVER['HTTP_REFERER'], PHP_URL_HOST);
    
        if (!in_array($refererHost, ['localhost', 'mandarin.nl', 'www.mandarin.nl'])) {
            http_response_code(403);
            exit('Forbidden');
        }
    }
}