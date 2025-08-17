<?php
require_once('functions.php');

load_env(__DIR__ . '/../.env');
check_referer();

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

$file = $_GET['file'];

$stmt = $db->prepare("select count(distinct ip) from counter where file = ?");

$stmt->execute([$file]);
$res = $stmt->fetchColumn();

header('content-type:application/json');
print(json_encode(['total'=>$res]));