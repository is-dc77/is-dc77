<?php
declare(strict_types=1);
session_start();

$dataDir = __DIR__ . '/data';
$dataFile = $dataDir . '/resenas.json';
if (!is_dir($dataDir)) { mkdir($dataDir, 0755, true); }
if (!file_exists($dataFile)) { file_put_contents($dataFile, "[]", LOCK_EX); }

function clean(string $value, int $max): string {
  $value = trim(strip_tags($value));
  return mb_substr($value, 0, $max);
}

function loadReviews(string $path): array {
  $decoded = json_decode((string) @file_get_contents($path), true);
  return is_array($decoded) ? $decoded : [];
}

$status = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $token = (string) ($_POST['csrf'] ?? '');
  $honeypot = (string) ($_POST['website'] ?? '');
  $lastSubmission = (int) ($_SESSION['last_review_submission'] ?? 0);
  if (!$honeypot && time() - $lastSubmission >= 45 && isset($_SESSION['csrf']) && hash_equals($_SESSION['csrf'], $token)) {
    $name = clean((string) ($_POST['name'] ?? ''), 70);
    $country = clean((string) ($_POST['country'] ?? ''), 60);
    $comment = clean((string) ($_POST['comment'] ?? ''), 900);
    if (mb_strlen($name) >= 2 && mb_strlen($country) >= 2 && mb_strlen($comment) >= 20) {
      $reviews = loadReviews($dataFile);
      $reviews[] = [
        'id' => bin2hex(random_bytes(8)),
        'name' => $name,
        'country' => $country,
        'comment' => $comment,
        'approved' => false,
        'created_at' => date('c')
      ];
      file_put_contents($dataFile, json_encode($reviews, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE), LOCK_EX);
      $_SESSION['last_review_submission'] = time();
      $status = 'Gracias. Tu reseña fue enviada y se publicará después de ser revisada.';
    } else {
      $status = 'Completa tu nombre, país y una experiencia de al menos 20 caracteres.';
    }
  } else {
    $status = 'Espera unos segundos, actualiza la página e inténtalo nuevamente.';
  }
}

$_SESSION['csrf'] = bin2hex(random_bytes(24));
$approved = array_values(array_filter(loadReviews($dataFile), fn($review) => !empty($review['approved'])));
usort($approved, fn($a, $b) => strcmp((string) ($b['created_at'] ?? ''), (string) ($a['created_at'] ?? '')));
?>
<!doctype html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Reseñas de personas acompañadas por Jennifer Muñoz en sesiones de PNL.">
  <title>Reseñas | Jennifer Muñoz</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Playfair+Display:ital,wght@0,500;0,600;1,500&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="styles.css?v=6">
</head>
<body class="review-page">
  <main class="review-shell">
    <header class="review-header">
      <a class="brand" href="index.html" aria-label="Volver al inicio"><img src="assets/images/logo-jennifer.jpg" alt="Jennifer Muñoz, Master en PNL"></a>
      <a class="text-link" href="index.html">Volver al sitio</a>
    </header>
    <section class="review-intro">
      <p class="eyebrow">Experiencias reales</p>
      <h1>Lo que comparten quienes han vivido este proceso</h1>
      <p>Cada reseña es enviada directamente por una persona acompañada y revisada antes de su publicación.</p>
    </section>
    <?php if ($status): ?><div class="form-status" role="status"><?= htmlspecialchars($status, ENT_QUOTES, 'UTF-8') ?></div><?php endif; ?>
    <div class="review-layout">
      <section class="review-list" aria-label="Reseñas publicadas">
        <?php if (!$approved): ?>
          <p class="empty-reviews">Las primeras experiencias aparecerán aquí después de ser revisadas.</p>
        <?php else: ?>
          <?php foreach ($approved as $review): ?>
            <article class="review-card">
              <blockquote>“<?= nl2br(htmlspecialchars((string) $review['comment'], ENT_QUOTES, 'UTF-8')) ?>”</blockquote>
              <div class="review-person"><strong><?= htmlspecialchars((string) $review['name'], ENT_QUOTES, 'UTF-8') ?></strong><span><?= htmlspecialchars((string) $review['country'], ENT_QUOTES, 'UTF-8') ?></span></div>
            </article>
          <?php endforeach; ?>
        <?php endif; ?>
      </section>
      <form class="review-form" method="post" action="resenas.php">
        <h2>Comparte tu experiencia</h2>
        <p>Tu correo no será solicitado ni publicado. La reseña será revisada antes de aparecer en el sitio.</p>
        <input type="hidden" name="csrf" value="<?= htmlspecialchars($_SESSION['csrf'], ENT_QUOTES, 'UTF-8') ?>">
        <div class="honeypot" aria-hidden="true"><label>Deja este campo vacío<input type="text" name="website" tabindex="-1" autocomplete="off"></label></div>
        <div class="form-field"><label for="name">Nombre</label><input id="name" name="name" minlength="2" maxlength="70" required autocomplete="name"></div>
        <div class="form-field"><label for="country">País</label><input id="country" name="country" minlength="2" maxlength="60" required autocomplete="country-name"></div>
        <div class="form-field"><label for="comment">Tu experiencia</label><textarea id="comment" name="comment" maxlength="900" minlength="20" required></textarea></div>
        <button class="button cream" type="submit">Enviar reseña <span>→</span></button>
      </form>
    </div>
  </main>
</body>
</html>
