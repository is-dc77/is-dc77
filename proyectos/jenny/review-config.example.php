<?php
declare(strict_types=1);

// Copiar a review-config.php y definir la variable en el entorno local.
// No contiene contraseñas ni hashes del sitio publicado.
$adminHash = getenv('REVIEW_ADMIN_PASSWORD_HASH');
if (!is_string($adminHash) || preg_match('/\A[a-f0-9]{64}\z/i', $adminHash) !== 1) {
    http_response_code(503);
    exit('Configura REVIEW_ADMIN_PASSWORD_HASH antes de utilizar el panel.');
}
define('REVIEW_ADMIN_PASSWORD_HASH', strtolower($adminHash));
