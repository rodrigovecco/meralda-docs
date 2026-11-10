<?php
// Dev helper: try a short list of candidate passwords against the stored hash.
$hash = '$2y$10$8QTvkfaJdugQUHz3f3lxK.a48cuegnDhko46MNE/07QIzYxnn/5P6';
$candidates = array(
    'password', 'meralda', 'admin', 'Admin123', '123456', 'meralda123',
    'Mer@lda2024', 'demo', 'admin123', 'Meralda2024', 'novoingenios', 'adminadmin'
);
foreach ($candidates as $c) {
    if (password_verify($c, $hash)) {
        echo "MATCH: $c\n";
    }
}
echo "done\n";
