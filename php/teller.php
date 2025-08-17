<?php
require_once('functions.php');

load_env(__DIR__ . '/../.env');

if (!empty($_SERVER['HTTP_REFERER'])) {
    $refererHost = parse_url($_SERVER['HTTP_REFERER'], PHP_URL_HOST);

    if (!in_array($refererHost, ['localhost', 'mandarin.nl', 'www.mandarin.nl'])) {
        http_response_code(403);
        exit('Forbidden');
    }
}

$secret = $_ENV['SECRET_KEY'] ?? null;
if (!$secret) {
    http_response_code(500);
    exit("Secret key not configured");
}

$file = basename($_GET['file'] ?? '');
$sig  = $_GET['sig'] ?? '';

if ($file === '' || $sig === '') {
    http_response_code(400);
    exit;
}

// recompute signature
$expected = hash_hmac('sha256', $file, $secret);

if (!hash_equals($expected, $sig)) {
    http_response_code(403);
    exit;
}

$ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';

// Connect to database with credentials from .env
try {
    $dsn  = $_ENV['DB_DSN']  ?? '';
    $user = $_ENV['DB_USER'] ?? '';
    $pass = $_ENV['DB_PASS'] ?? '';
    $db = new PDO($dsn, $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    exit("DB connection failed");
}

// snelle reloads negeren.
$stmt = $db->prepare("SELECT COUNT(*) FROM counter
WHERE file = ?
  AND ip = ?
  AND last_seen >= NOW() - INTERVAL 1 MINUTE");

$stmt->execute([$file, $ip]);
$check = $stmt->fetchColumn();
var_dump($check);

if($check > 0) {
    exit;
}

// Insert log
$stmt = $db->prepare("INSERT INTO counter (file, ip, last_seen) VALUES (?, ?, NOW())");
$stmt->execute([$file, $ip]);

http_response_code(204); // no content
