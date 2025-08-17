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

load_env(__DIR__ . '/.env');

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

$stmt = $db->prepare("SELECT last_seen FROM counter WHERE file=? AND ip=? ORDER BY last_seen DESC LIMIT 1");
$stmt->execute([$file, $ip]);
$lastSeen = $stmt->fetchColumn();

if ($lastSeen && (time() - strtotime($lastSeen)) < 600) {
    // skip duplicate
    exit;
}

// Insert log
$stmt = $db->prepare("INSERT INTO counter (file, ip, last_seen) VALUES (?, ?, NOW())");
$stmt->execute([$file, $ip]);

http_response_code(204); // no content
