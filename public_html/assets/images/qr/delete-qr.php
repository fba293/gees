<?php
/**
 * GEES QR Delete API — /api/delete-qr.php
 * Accepts POST JSON {filename: "GEES-RA-2026-001"}
 * Returns JSON success/failure
 * Security: Bearer token, path traversal prevention, logging
 */

declare(strict_types=1);

/* ─── CORS ─── */
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: https://globaleducationexpert.com');
header('Access-Control-Allow-Methods: POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-API-Key, Authorization');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

/* ─── METHOD CHECK ─── */
if (!in_array($_SERVER['REQUEST_METHOD'], ['POST', 'DELETE'], true)) {
    respond(405, false, 'Method not allowed. Use POST or DELETE.');
}

/* ─── CONFIG ─── */
define('API_SECRET',      getenv('GEES_API_SECRET') ?: 'GEES_SECURE_TOKEN_2026');
define('QR_DIR',          dirname(__DIR__) . '/images/qr/');
define('RATE_LIMIT_FILE', sys_get_temp_dir() . '/gees_rl_delete.json');
define('RATE_LIMIT_MAX',  30);
define('RATE_LIMIT_WIN',  3600);

/* ─── RATE LIMITING ─── */
$ip = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
if (!rateLimit($ip)) {
    respond(429, false, 'Rate limit exceeded.');
}

/* ─── AUTH ─── */
$apiKey = $_SERVER['HTTP_X_API_KEY']
       ?? $_SERVER['HTTP_AUTHORIZATION']
       ?? '';
$apiKey = str_replace('Bearer ', '', $apiKey);

if (!hash_equals(API_SECRET, $apiKey)) {
    logEvent('AUTH_FAIL', $ip);
    respond(403, false, 'Unauthorized.');
}

/* ─── BODY PARSE ─── */
$raw  = file_get_contents('php://input');
$data = json_decode($raw, true);

if (json_last_error() !== JSON_ERROR_NONE) {
    respond(400, false, 'Invalid JSON: ' . json_last_error_msg());
}

/* ─── INPUT VALIDATION ─── */
$rawFilename   = $data['filename']     ?? '';
$agreementId   = $data['agreement_id'] ?? '';
$confirmDelete = $data['confirm']      ?? false;

if (empty($rawFilename)) {
    respond(400, false, 'Missing required field: filename');
}

// Optional double-confirm guard
if ($confirmDelete !== true && $confirmDelete !== 'true' && $confirmDelete !== 1) {
    respond(400, false, 'Deletion requires confirm: true in request body.');
}

/* ─── STRICT FILENAME SANITISATION ─── */
$cleaned  = strtoupper((string)$rawFilename);
$cleaned  = preg_replace('/[^A-Z0-9\-]/', '', $cleaned);

if (strlen($cleaned) < 3 || strlen($cleaned) > 100) {
    respond(400, false, 'Invalid filename length.');
}

$filename = $cleaned . '.png';

/* ─── PATH TRAVERSAL CHECK ─── */
if (!is_dir(QR_DIR)) {
    respond(404, false, 'QR storage directory does not exist.');
}

$realBase   = realpath(QR_DIR);
$targetPath = $realBase . DIRECTORY_SEPARATOR . $filename;

// Ensure resolved path is inside QR_DIR
if (strpos(realpath(dirname($targetPath)) ?: '', $realBase) !== 0) {
    logEvent('PATH_TRAVERSAL', $ip, $filename);
    respond(400, false, 'Invalid file path detected.');
}

/* ─── FILE EXISTS CHECK ─── */
if (!file_exists($targetPath)) {
    respond(404, false, "QR file not found: $filename");
}

/* ─── CONFIRM IT'S A REGULAR FILE (not symlink) ─── */
if (!is_file($targetPath) || is_link($targetPath)) {
    logEvent('NOT_REGULAR_FILE', $ip, $filename);
    respond(400, false, 'Target is not a regular file.');
}

/* ─── CONFIRM MIME IS PNG BEFORE DELETING ─── */
$finfo = finfo_open(FILEINFO_MIME_TYPE);
$mime  = finfo_file($finfo, $targetPath);
finfo_close($finfo);

if ($mime !== 'image/png') {
    logEvent('WRONG_MIME_DELETE', $ip, "File: $filename, MIME: $mime");
    respond(400, false, 'File is not a valid PNG. Deletion aborted for safety.');
}

/* ─── DELETE ─── */
if (!unlink($targetPath)) {
    respond(500, false, "Failed to delete file: $filename");
}

logEvent('QR_DELETED', $ip, "File: $filename, Agreement: $agreementId");

respond(200, true, "QR file deleted successfully.", [
    'filename'     => $filename,
    'agreement_id' => htmlspecialchars($agreementId, ENT_QUOTES, 'UTF-8'),
    'deleted_at'   => date('c'),
]);


/* ═══════════════════════════════════════════
   HELPER FUNCTIONS
═══════════════════════════════════════════ */

function respond(int $code, bool $success, string $message, array $data = []): never
{
    http_response_code($code);
    echo json_encode(array_merge([
        'success' => $success,
        'message' => $message,
        'code'    => $code,
    ], $data), JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit;
}

function rateLimit(string $ip): bool
{
    $store = [];
    if (file_exists(RATE_LIMIT_FILE)) {
        $store = json_decode(file_get_contents(RATE_LIMIT_FILE), true) ?? [];
    }
    $now = time();
    $key = hash('sha256', $ip);
    if (!isset($store[$key])) {
        $store[$key] = ['count' => 0, 'window_start' => $now];
    }
    if ($now - $store[$key]['window_start'] > RATE_LIMIT_WIN) {
        $store[$key] = ['count' => 0, 'window_start' => $now];
    }
    $store[$key]['count']++;
    file_put_contents(RATE_LIMIT_FILE, json_encode($store), LOCK_EX);
    return $store[$key]['count'] <= RATE_LIMIT_MAX;
}

function logEvent(string $event, string $ip, string $detail = ''): void
{
    $logDir  = dirname(__DIR__) . '/logs/';
    $logFile = $logDir . 'qr_api_' . date('Y-m') . '.log';
    if (!is_dir($logDir)) {
        @mkdir($logDir, 0750, true);
        @file_put_contents($logDir . '.htaccess', "Deny from all\n");
    }
    $line = sprintf("[%s] %s | IP: %s | %s\n",
        date('Y-m-d H:i:s'), $event,
        substr(hash('sha256', $ip), 0, 12) . '…',
        $detail
    );
    @file_put_contents($logFile, $line, FILE_APPEND | LOCK_EX);
}
