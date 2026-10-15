<?php
declare(strict_types=1);
session_start();
require __DIR__ . '/review-config.php';
$dataFile = __DIR__ . '/data/resenas.json';
if (!is_dir(dirname($dataFile))) { mkdir(dirname($dataFile), 0755, true); }
if (!file_exists($dataFile)) { file_put_contents($dataFile, "[]", LOCK_EX); }

function reviewsLoad(string $path): array {
  $decoded = json_decode((string) @file_get_contents($path), true);
  return is_array($decoded) ? $decoded : [];
}
function reviewsSave(string $path, array $reviews): void {
  file_put_contents($path, json_encode(array_values($reviews), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE), LOCK_EX);
}

$error = '';
if (isset($_POST['login'])) {
  if (hash_equals(REVIEW_ADMIN_PASSWORD_HASH, hash('sha256', (string) ($_POST['password'] ?? '')))) {
    session_regenerate_id(true);
    $_SESSION['reviews_admin'] = true;
  } else { $error = 'Contraseña incorrecta.'; }
}
if (isset($_GET['logout'])) { session_destroy(); header('Location: administrar-resenas.php'); exit; }
$loggedIn = !empty($_SESSION['reviews_admin']);
if (!isset($_SESSION['admin_csrf'])) { $_SESSION['admin_csrf'] = bin2hex(random_bytes(24)); }

if ($loggedIn && isset($_POST['action'], $_POST['id'], $_POST['csrf']) && hash_equals($_SESSION['admin_csrf'], (string) $_POST['csrf'])) {
  $reviews = reviewsLoad($dataFile);
  foreach ($reviews as $index => $review) {
    if (($review['id'] ?? '') === $_POST['id']) {
      if ($_POST['action'] === 'approve') { $reviews[$index]['approved'] = true; }
      if ($_POST['action'] === 'hide') { $reviews[$index]['approved'] = false; }
      if ($_POST['action'] === 'delete') { unset($reviews[$index]); }
      break;
    }
  }
  reviewsSave($dataFile, $reviews);
  header('Location: administrar-resenas.php'); exit;
}
$reviews = $loggedIn ? array_reverse(reviewsLoad($dataFile)) : [];
?>
<!doctype html><html lang="es"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>Administrar reseñas</title><link rel="stylesheet" href="styles.css?v=6"></head>
<body class="review-page"><main class="review-shell"><header class="review-header"><a class="brand" href="index.html"><img src="assets/images/logo-jennifer.jpg" alt="Jennifer Muñoz"></a><?php if ($loggedIn): ?><a class="text-link" href="?logout=1">Cerrar sesión</a><?php endif; ?></header>
<?php if (!$loggedIn): ?>
  <section class="review-intro"><p class="eyebrow">Acceso privado</p><h1>Administrar reseñas</h1></section>
  <?php if ($error): ?><p class="form-status"><?= htmlspecialchars($error) ?></p><?php endif; ?>
  <form class="review-form" method="post"><div class="form-field"><label for="password">Contraseña</label><input id="password" type="password" name="password" required></div><button class="button cream" name="login" value="1">Ingresar</button></form>
<?php else: ?>
  <section class="review-intro"><p class="eyebrow">Panel privado</p><h1>Reseñas recibidas</h1><p>Aprueba, oculta o elimina cada experiencia antes de mostrarla públicamente.</p></section>
  <section class="review-list">
  <?php if (!$reviews): ?><p class="empty-reviews">Aún no hay reseñas recibidas.</p><?php endif; ?>
  <?php foreach ($reviews as $review): ?><article class="review-card"><blockquote>“<?= nl2br(htmlspecialchars((string) ($review['comment'] ?? ''), ENT_QUOTES, 'UTF-8')) ?>”</blockquote><div class="review-person"><strong><?= htmlspecialchars((string) ($review['name'] ?? '')) ?></strong><span><?= htmlspecialchars((string) ($review['country'] ?? '')) ?> · <?= !empty($review['approved']) ? 'Publicada' : 'Pendiente' ?></span></div><form class="moderation-actions" method="post"><input type="hidden" name="csrf" value="<?= htmlspecialchars($_SESSION['admin_csrf'], ENT_QUOTES, 'UTF-8') ?>"><input type="hidden" name="id" value="<?= htmlspecialchars((string) ($review['id'] ?? '')) ?>"><?php if (empty($review['approved'])): ?><button class="button primary" name="action" value="approve">Aprobar</button><?php else: ?><button class="button" name="action" value="hide">Ocultar</button><?php endif; ?><button class="button danger" name="action" value="delete" onclick="return confirm('¿Eliminar esta reseña?')">Eliminar</button></form></article><?php endforeach; ?>
  </section>
<?php endif; ?></main></body></html>
