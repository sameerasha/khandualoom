-- 1. Traditional Khandua Silk Saree
INSERT INTO products (id, name, category, price, original_price, image, description, fabric, weave, color, rating, reviews, badge, created_date, modified_date)
VALUES (1, 'Traditional Khandua Silk Saree', 'Khandua Silk', 34999, 42999, '/images/products/p3/front.jpg', 'A signature Khandua Looms masterpiece woven with sacred calligraphic motifs and lotus medallions in sanctified crimson and gold zari.', 'Pure Mulberry Silk', 'Nuapatna Khandua Ikat', 'Crimson Red & Gold', 4.9, 142, 'Bestseller', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;
INSERT INTO product_images (product_id, image_url) VALUES (1, '/images/products/p3/front.jpg');
INSERT INTO product_images (product_id, image_url) VALUES (1, '/images/products/p3/pallu.jpg');
INSERT INTO product_images (product_id, image_url) VALUES (1, '/images/products/p3/border.jpg');
INSERT INTO product_images (product_id, image_url) VALUES (1, '/images/products/p3/side.jpg');

-- 2. Maroon & Gold Heritage Khandua
INSERT INTO products (id, name, category, price, original_price, image, description, fabric, weave, color, rating, reviews, badge, created_date, modified_date)
VALUES (2, 'Maroon & Gold Heritage Khandua', 'Khandua Silk', 38999, 46999, '/images/products/p18/front.jpg', 'Opulent heritage Khandua drape in imperial maroon with extensive zari pallu, handwoven for festive ceremonies and milestone celebrations.', 'Malda Mulberry Silk', 'Traditional Khandua Weave', 'Deep Maroon & Antique Gold', 5, 118, 'Heritage', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;
INSERT INTO product_images (product_id, image_url) VALUES (2, '/images/products/p18/front.jpg');
INSERT INTO product_images (product_id, image_url) VALUES (2, '/images/products/p18/pallu.jpg');
INSERT INTO product_images (product_id, image_url) VALUES (2, '/images/products/p18/border.jpg');
INSERT INTO product_images (product_id, image_url) VALUES (2, '/images/products/p18/side.jpg');

-- 3. Sambalpuri Ikat Handloom Saree
INSERT INTO products (id, name, category, price, original_price, image, description, fabric, weave, color, rating, reviews, badge, created_date, modified_date)
VALUES (3, 'Sambalpuri Ikat Handloom Saree', 'Sambalpuri Ikat', 27999, 34999, '/images/products/p2/front.jpg', 'Iconic Sambalpuri Bandha tie-dye silk saree featuring traditional conch (shankha) and wheel (chakra) motifs in regal purple and gold.', 'Pure Mulberry Silk', 'Bandha Tie-Dye Ikat', 'Royal Purple & Gold', 4.9, 188, 'Bestseller', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;
INSERT INTO product_images (product_id, image_url) VALUES (3, '/images/products/p2/front.jpg');
INSERT INTO product_images (product_id, image_url) VALUES (3, '/images/products/p2/pallu.jpg');
INSERT INTO product_images (product_id, image_url) VALUES (3, '/images/products/p2/border.jpg');
INSERT INTO product_images (product_id, image_url) VALUES (3, '/images/products/p2/side.jpg');

-- 4. Traditional Bomkai Silk Saree
INSERT INTO products (id, name, category, price, original_price, image, description, fabric, weave, color, rating, reviews, badge, created_date, modified_date)
VALUES (4, 'Traditional Bomkai Silk Saree', 'Bomkai', 29999, 37999, '/images/products/p4/front.jpg', 'Classical Bomkai silk from Subarnapur featuring extra-weft jhabba pallu and traditional bitter gourd (karela) and peacock motifs.', 'Pure Mulberry Silk', 'Extra Weft Jaal', 'Saffron Orange & Gold', 4.8, 96, 'New Arrival', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;
INSERT INTO product_images (product_id, image_url) VALUES (4, '/images/products/p4/front.jpg');
INSERT INTO product_images (product_id, image_url) VALUES (4, '/images/products/p4/pallu.jpg');
INSERT INTO product_images (product_id, image_url) VALUES (4, '/images/products/p4/border.jpg');
INSERT INTO product_images (product_id, image_url) VALUES (4, '/images/products/p4/side.jpg');

-- 5. Wedding Heritage Silk Saree
INSERT INTO products (id, name, category, price, original_price, image, description, fabric, weave, color, rating, reviews, badge, created_date, modified_date)
VALUES (5, 'Wedding Heritage Silk Saree', 'Wedding & Bridal', 44999, 54999, '/images/products/p5/front.jpg', 'An illustrious bridal masterpiece showcasing needle-interlocked Phoda Kumbha temple borders in auspicious emerald green and ruby red.', 'Heavy Bridal Silk', 'Phoda Kumbha Handloom', 'Emerald Green & Ruby', 5, 78, 'Bridal Pick', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;
INSERT INTO product_images (product_id, image_url) VALUES (5, '/images/products/p5/front.jpg');
INSERT INTO product_images (product_id, image_url) VALUES (5, '/images/products/p5/pallu.jpg');
INSERT INTO product_images (product_id, image_url) VALUES (5, '/images/products/p5/border.jpg');
INSERT INTO product_images (product_id, image_url) VALUES (5, '/images/products/p5/side.jpg');

-- 6. Classic Odisha Cotton Handloom Saree
INSERT INTO products (id, name, category, price, original_price, image, description, fabric, weave, color, rating, reviews, badge, created_date, modified_date)
VALUES (6, 'Classic Odisha Cotton Handloom Saree', 'Traditional Odisha Handlooms', 18999, 23999, '/images/products/p1/front.jpg', 'Breathable handspun organic cotton saree from the tribal looms of Koraput, dyed with earthy vegetable madder root and indigo temple spires.', 'Organic Handspun Cotton', 'Padua Mirgan Handloom', 'E earthy Terracotta & Indigo', 4.9, 142, 'Classic Weave', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;
INSERT INTO product_images (product_id, image_url) VALUES (6, '/images/products/p1/front.jpg');
INSERT INTO product_images (product_id, image_url) VALUES (6, '/images/products/p1/pallu.jpg');
INSERT INTO product_images (product_id, image_url) VALUES (6, '/images/products/p1/border.jpg');
INSERT INTO product_images (product_id, image_url) VALUES (6, '/images/products/p1/side.jpg');

-- 7. Berhampuri Double Pallu Silk
INSERT INTO products (id, name, category, price, original_price, image, description, fabric, weave, color, rating, reviews, badge, created_date, modified_date)
VALUES (7, 'Berhampuri Double Pallu Silk', 'Berhampuri Patta', 36999, 45999, '/images/products/p6/front.jpg', 'Ganjam silk heritage saree famous for its heavy Kumbha borders woven with authentic pure mulberry threads, celebrated for temple ceremonies.', 'Berhampur Mulberry Silk', 'Kumbha Temple Border', 'Deep Indigo & Crimson', 4.7, 64, 'Temple Craft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;
INSERT INTO product_images (product_id, image_url) VALUES (7, '/images/products/p6/front.jpg');
INSERT INTO product_images (product_id, image_url) VALUES (7, '/images/products/p6/pallu.jpg');
INSERT INTO product_images (product_id, image_url) VALUES (7, '/images/products/p6/border.jpg');
INSERT INTO product_images (product_id, image_url) VALUES (7, '/images/products/p6/side.jpg');

-- 8. Pasapalli Checkerboard Silk Saree
INSERT INTO products (id, name, category, price, original_price, image, description, fabric, weave, color, rating, reviews, badge, created_date, modified_date)
VALUES (8, 'Pasapalli Checkerboard Silk Saree', 'Pasapalli', 31999, 39999, '/images/products/p7/front.jpg', 'Centuries-old chessboard (pasa) geometric tie-dye weave from Bargarh with contrast red kumbha edging, honoring the epic Mahabharata heritage.', 'Pure Mulberry Silk', 'Pasapalli Bandha', 'Monochrome Ebony & Vermilion', 4.8, 112, 'Limited Edition', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;
INSERT INTO product_images (product_id, image_url) VALUES (8, '/images/products/p7/front.jpg');
INSERT INTO product_images (product_id, image_url) VALUES (8, '/images/products/p7/pallu.jpg');
INSERT INTO product_images (product_id, image_url) VALUES (8, '/images/products/p7/border.jpg');
INSERT INTO product_images (product_id, image_url) VALUES (8, '/images/products/p7/side.jpg');

-- 9. Kotpad Natural Dye Tribal Saree
INSERT INTO products (id, name, category, price, original_price, image, description, fabric, weave, color, rating, reviews, badge, created_date, modified_date)
VALUES (9, 'Kotpad Natural Dye Tribal Saree', 'Kotpad Tribal', 22999, 28999, '/images/products/p8/front.jpg', 'GI-tagged unbleached tribal drape crafted by Mirgan weavers of Koraput using non-toxic Aal (madder) bark dye and traditional pit loom beaters.', 'Unbleached Organic Cotton', 'Pit Loom Mirgan Weave', 'Coffee Brown & Ochre', 4.9, 87, 'GI Tagged', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;
INSERT INTO product_images (product_id, image_url) VALUES (9, '/images/products/p8/front.jpg');
INSERT INTO product_images (product_id, image_url) VALUES (9, '/images/products/p8/pallu.jpg');
INSERT INTO product_images (product_id, image_url) VALUES (9, '/images/products/p8/border.jpg');
INSERT INTO product_images (product_id, image_url) VALUES (9, '/images/products/p8/side.jpg');

-- 10. Dongria Kondh Tribal Shawl Saree
INSERT INTO products (id, name, category, price, original_price, image, description, fabric, weave, color, rating, reviews, badge, created_date, modified_date)
VALUES (10, 'Dongria Kondh Tribal Shawl Saree', 'Dongria Kondh', 25999, 32999, '/images/products/p9/front.jpg', 'Rare hand-embroidered tribal textile from the Niyamgiri hills featuring triangular temple spires and mountain deity symbols in sacred hues.', 'Coarse Handloom Cotton', 'Kapdaganda Embroidery', 'Natural Cream & Marigold', 5, 53, 'Artisan Heritage', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;
INSERT INTO product_images (product_id, image_url) VALUES (10, '/images/products/p9/front.jpg');
INSERT INTO product_images (product_id, image_url) VALUES (10, '/images/products/p9/pallu.jpg');
INSERT INTO product_images (product_id, image_url) VALUES (10, '/images/products/p9/border.jpg');
INSERT INTO product_images (product_id, image_url) VALUES (10, '/images/products/p9/side.jpg');

SELECT setval('products_id_seq', (SELECT MAX(id) FROM products));
