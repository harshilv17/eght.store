-- Replace dead Unsplash URL for Wide Leg Trouser (old photo-1594938298603 returns 404).
UPDATE products
SET images = ARRAY['https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800']
WHERE slug = 'wide-leg-trouser';
