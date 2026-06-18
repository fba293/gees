<?php
/**
 * GEES QR Save API — /api/save-qr.php
 * Accepts POST JSON, validates, saves QR PNG to /images/qr/
 * Security: Bearer token, MIME validation, path traversal prevention
 * Returns JSON
 */

declare(strict_types=1);

/* ─── CORS HEADERS ─── */
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: https://globaleducationexpert.com');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-API-Key, Authorization');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

/* ─── METHOD CHECK ─── */
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(405, false, 'Method not allowed. Use POST.');
}

/* ─── CONFIG ─── */
define('API_SECRET',    getenv('GEES_API_SECRET') ?: 'GEES_SECURE_TOKEN_2026');
define('MAX_FILE_SIZE', 1_048_576);          // 1 MB
define('QR_DIR',        dirname(__DIR__) . '/images/qr/');
define('QR_WEB_PATH',   '/images/qr/');
define('ALLOWED_MIME',  'image/png');
define('RATE_LIMIT_FILE', sys_get_temp_dir() . '/gees_rl_save.json');
define('RATE_LIMIT_MAX',  60);               // requests per window
define('RATE_LIMIT_WIN',  3600);             // 1 hour window

/* ─── RATE LIMITING ─── */
$ip = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
if (!rateLimit($ip)) {
    respond(429, false, 'Rate limit exceeded. Try again later.');
}

/* ─── AUTH ─── */
$apiKey = $_SERVER['HTTP_X_API_KEY']
       ?? $_SERVER['HTTP_AUTHORIZATION']
       ?? '';
$apiKey = str_replace('Bearer ', '', $apiKey);

if (!hash_equals(API_SECRET, $apiKey)) {
    logEvent('AUTH_FAIL', $ip);
    respond(403, false, 'Unauthorized: invalid API key.');
}

/* ─── BODY PARSE ─── */
$raw = file_get_contents('php://input');
if (strlen($raw) > 5_000_000) {
    respond(413, false, 'Request body too large.');
}

$data = json_decode($raw, true);
if (json_last_error() !== JSON_ERROR_NONE) {
    respond(400, false, 'Invalid JSON: ' . json_last_error_msg());
}

/* ─── INPUT VALIDATION ─── */
$filename = $data['filename'] ?? '';
$imageB64 = $data['image']    ?? '';
$agreementId = $data['agreement_id'] ?? '';

if (empty($filename) || empty($imageB64)) {
    respond(400, false, 'Missing required fields: filename, image');
}

// Strict filename sanitisation — only uppercase alphanumeric + hyphen
$filename = strtoupper((string)$filename);
$filename = preg_replace('/[^A-Z0-9\-]/', '', $filename);
if (strlen($filename) < 3 || strlen($filename) > 100) {
    respond(400, false, 'Invalid filename length (3–100 chars).');
}
$filename .= '.png';

/* ─── BASE64 DECODE ─── */
$imageB64 = preg_replace('#^data:image/\w+;base64,#i', '', $imageB64);
$imageB64 = str_replace([' ', "\n", "\r"], ['+', '', ''], $imageB64);
$imageData = base64_decode($imageB64, true);

if ($imageData === false || strlen($imageData) < 67) {
    respond(400, false, 'Invalid or empty base64 image data.');
}

/* ─── FILE SIZE LIMIT ─── */
if (strlen($imageData) > MAX_FILE_SIZE) {
    respond(413, false, 'Image exceeds 1MB limit.');
}

/* ─── MIME TYPE VALIDATION (binary check, not extension) ─── */
if (!function_exists('finfo_open')) {
    respond(500, false, 'Server missing fileinfo extension.');
}
$finfo = finfo_open(FILEINFO_MIME_TYPE);
$detectedMime = finfo_buffer($finfo, $imageData);
finfo_close($finfo);

if ($detectedMime !== ALLOWED_MIME) {
    logEvent('MIME_REJECT', $ip, "Got: $detectedMime");
    respond(400, false, "Invalid file type. Only PNG accepted. Got: $detectedMime");
}

/* ─── VALIDATE PNG MAGIC BYTES ─── */
$pngMagic = "\x89PNG\r\n\x1a\n";
if (substr($imageData, 0, 8) !== $pngMagic) {
    respond(400, false, 'File does not appear to be a valid PNG.');
}

/* ─── DIRECTORY SETUP ─── */
if (!is_dir(QR_DIR)) {
    if (!mkdir(QR_DIR, 0750, true)) {
        respond(500, false, 'Failed to create QR directory.');
    }
    // Deny direct web access
    file_put_contents(QR_DIR . '.htaccess', "Options -Indexes\n");
}

/* ─── PATH TRAVERSAL PREVENTION ─── */
$targetPath = realpath(QR_DIR) . DIRECTORY_SEPARATOR . $filename;
$realBase   = realpath(QR_DIR);

// realpath before writing: use a manual check
if (strpos(dirname($targetPath), $realBase) !== 0) {
    logEvent('PATH_TRAVERSAL', $ip, $filename);
    respond(400, false, 'Invalid file path detected.');
}

/* ─── DUPLICATE CHECK ─── */
if (file_exists($targetPath)) {
    respond(409, false, 'QR file already exists: ' . $filename);
}

/* ─── WRITE FILE ─── */
$bytes = file_put_contents($targetPath, $imageData, LOCK_EX);
if ($bytes === false) {
    respond(500, false, 'Failed to write QR file to disk.');
}
chmod($targetPath, 0640);

/* ─── LOG + RESPOND ─── */
logEvent('QR_SAVED', $ip, "File: $filename, Agreement: $agreementId, Bytes: $bytes");

respond(201, true, 'QR code saved successfully.', [
    'file'         => QR_WEB_PATH . $filename,
    'filename'     => $filename,
    'bytes'        => $bytes,
    'agreement_id' => htmlspecialchars($agreementId, ENT_QUOTES, 'UTF-8'),
    'timestamp'    => date('c'),
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
        substr(hash('sha256', $ip), 0, 12) . '…', // hashed for privacy
        $detail
    );
    @file_put_contents($logFile, $line, FILE_APPEND | LOCK_EX);
}
