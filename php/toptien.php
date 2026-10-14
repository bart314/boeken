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

$data = [];
$stmt = $db->prepare("
    select file, count(distinct ip) as aantal 
    from counter group by file order by aantal desc limit 10;
");

$result = $stmt->execute();
while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    $data[] = $row;
}


header('content-type:application/json');
print(json_encode($data));