TRUNCATE TABLE product_images, recent_views CASCADE;
TRUNCATE TABLE products RESTART IDENTITY CASCADE;

-- 1. Traditional Khadua Silk Saree
INSERT INTO products (id, name, category, price, original_price, image, description, fabric, weave, color, rating, reviews, badge, created_date, modified_date)
VALUES (1, 'Traditional Khadua Silk Saree', 'Khadua Silk', 34999, 42999, '/images/products/p3/front.jpg', 'A signature Khadua Looms masterpiece woven with sacred calligraphic motifs and lotus medallions in sanctified crimson and gold zari.', 'Pure Mulberry Silk', 'Nuapatna Khadua Ikat', 'Crimson Red & Gold', 4.9, 142, 'Bestseller', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO product_images (product_id, image_url) VALUES (1, '/images/products/p3/front.jpg');
INSERT INTO product_images (product_id, image_url) VALUES (1, '/images/products/p3/pallu.jpg');
INSERT INTO product_images (product_id, image_url) VALUES (1, '/images/products/p3/border.jpg');
INSERT INTO product_images (product_id, image_url) VALUES (1, '/images/products/p3/side.jpg');

-- 2. Maroon & Gold Heritage Khadua
INSERT INTO products (id, name, category, price, original_price, image, description, fabric, weave, color, rating, reviews, badge, created_date, modified_date)
VALUES (2, 'Maroon & Gold Heritage Khadua', 'Khadua Silk', 38999, 46999, '/images/products/p18/front.jpg', 'Opulent heritage Khadua drape in imperial maroon with extensive zari pallu, handwoven for festive ceremonies and milestone celebrations.', 'Malda Mulberry Silk', 'Traditional Khadua Weave', 'Deep Maroon & Antique Gold', 5, 118, 'Heritage', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO product_images (product_id, image_url) VALUES (2, '/images/products/p18/front.jpg');
INSERT INTO product_images (product_id, image_url) VALUES (2, '/images/products/p18/pallu.jpg');
INSERT INTO product_images (product_id, image_url) VALUES (2, '/images/products/p18/border.jpg');
INSERT INTO product_images (product_id, image_url) VALUES (2, '/images/products/p18/side.jpg');

-- 3. Sambalpuri Ikat Handloom Saree
INSERT INTO products (id, name, category, price, original_price, image, description, fabric, weave, color, rating, reviews, badge, created_date, modified_date)
VALUES (3, 'Sambalpuri Ikat Handloom Saree', 'Sambalpuri Ikat', 27999, 34999, '/images/products/p2/front.jpg', 'Iconic Sambalpuri Bandha tie-dye silk saree featuring traditional conch (shankha) and wheel (chakra) motifs in regal purple and gold.', 'Pure Mulberry Silk', 'Bandha Tie-Dye Ikat', 'Royal Purple & Gold', 4.9, 188, 'Bestseller', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO product_images (product_id, image_url) VALUES (3, '/images/products/p2/front.jpg');
INSERT INTO product_images (product_id, image_url) VALUES (3, '/images/products/p2/pallu.jpg');
INSERT INTO product_images (product_id, image_url) VALUES (3, '/images/products/p2/border.jpg');
INSERT INTO product_images (product_id, image_url) VALUES (3, '/images/products/p2/side.jpg');

-- 4. Traditional Bomkai Silk Saree
INSERT INTO products (id, name, category, price, original_price, image, description, fabric, weave, color, rating, reviews, badge, created_date, modified_date)
VALUES (4, 'Traditional Bomkai Silk Saree', 'Bomkai', 29999, 37999, '/images/products/p4/front.jpg', 'Classical Bomkai silk from Subarnapur featuring extra-weft jhabba pallu and traditional bitter gourd (karela) and peacock motifs.', 'Pure Mulberry Silk', 'Extra Weft Jaal', 'Saffron Orange & Gold', 4.8, 96, 'New Arrival', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO product_images (product_id, image_url) VALUES (4, '/images/products/p4/front.jpg');
INSERT INTO product_images (product_id, image_url) VALUES (4, '/images/products/p4/pallu.jpg');
INSERT INTO product_images (product_id, image_url) VALUES (4, '/images/products/p4/border.jpg');
INSERT INTO product_images (product_id, image_url) VALUES (4, '/images/products/p4/side.jpg');

-- 5. Wedding Heritage Silk Saree
INSERT INTO products (id, name, category, price, original_price, image, description, fabric, weave, color, rating, reviews, badge, created_date, modified_date)
VALUES (5, 'Wedding Heritage Silk Saree', 'Wedding & Bridal', 44999, 54999, '/images/products/p5/front.jpg', 'An illustrious bridal masterpiece showcasing needle-interlocked Phoda Kumbha temple borders in auspicious emerald green and ruby red.', 'Heavy Bridal Silk', 'Phoda Kumbha Handloom', 'Emerald Green & Ruby', 5, 78, 'Bridal Pick', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO product_images (product_id, image_url) VALUES (5, '/images/products/p5/front.jpg');
INSERT INTO product_images (product_id, image_url) VALUES (5, '/images/products/p5/pallu.jpg');
INSERT INTO product_images (product_id, image_url) VALUES (5, '/images/products/p5/border.jpg');
INSERT INTO product_images (product_id, image_url) VALUES (5, '/images/products/p5/side.jpg');

-- 6. Classic Odisha Cotton Handloom Saree
INSERT INTO products (id, name, category, price, original_price, image, description, fabric, weave, color, rating, reviews, badge, created_date, modified_date)
VALUES (6, 'Classic Odisha Cotton Handloom Saree', 'Traditional Odisha Handlooms', 18999, 23999, '/images/products/p1/front.jpg', 'Breathable handspun organic cotton saree from the tribal looms of Koraput, dyed with earthy vegetable madder root and indigo temple spires.', 'Organic Handspun Cotton', 'Padua Mirgan Handloom', 'Earthy Terracotta & Indigo', 4.9, 142, 'Classic Weave', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO product_images (product_id, image_url) VALUES (6, '/images/products/p1/front.jpg');
INSERT INTO product_images (product_id, image_url) VALUES (6, '/images/products/p1/pallu.jpg');
INSERT INTO product_images (product_id, image_url) VALUES (6, '/images/products/p1/border.jpg');
INSERT INTO product_images (product_id, image_url) VALUES (6, '/images/products/p1/side.jpg');

-- 7. Kotpad Organic Aal Tree Mirgan Drape
INSERT INTO products (id, name, category, price, original_price, image, description, fabric, weave, color, rating, reviews, badge, created_date, modified_date)
VALUES (7, 'Kotpad Organic Aal Tree Mirgan Drape', 'Traditional Odisha Handlooms', 18499, 22999, '/images/products/p7/front.jpg', 'Certified organic tribal handloom from Kotpad, dyed exclusively with natural Aal tree root extract on hand-spun unbleached cotton.', 'Organic Handspun Cotton', 'Pit Loom Mirgan Weave', 'Rust Ochre & Madder Red', 4.8, 92, 'Organic Dye', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO product_images (product_id, image_url) VALUES (7, '/images/products/p7/front.jpg');
INSERT INTO product_images (product_id, image_url) VALUES (7, '/images/products/p7/pallu.jpg');
INSERT INTO product_images (product_id, image_url) VALUES (7, '/images/products/p7/border.jpg');
INSERT INTO product_images (product_id, image_url) VALUES (7, '/images/products/p7/side.jpg');

-- 8. Pasapalli Royal Chessboard Ikat Saree
INSERT INTO products (id, name, category, price, original_price, image, description, fabric, weave, color, rating, reviews, badge, created_date, modified_date)
VALUES (8, 'Pasapalli Royal Chessboard Ikat Saree', 'Sambalpuri Ikat', 32999, 39999, '/images/products/p6/front.jpg', 'Western Odisha Pasapalli saree named after the ancient royal dice game (Pasa), woven in an unmistakable contrast chessboard ikat grid.', 'Pure Silk', 'Pasapalli Double Bandha', 'Ebony & Imperial Maroon', 4.9, 134, 'Exclusive', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO product_images (product_id, image_url) VALUES (8, '/images/products/p6/front.jpg');
INSERT INTO product_images (product_id, image_url) VALUES (8, '/images/products/p6/pallu.jpg');
INSERT INTO product_images (product_id, image_url) VALUES (8, '/images/products/p6/border.jpg');
INSERT INTO product_images (product_id, image_url) VALUES (8, '/images/products/p6/side.jpg');

-- 9. Habaspuri Kumbha Heritage Saree
INSERT INTO products (id, name, category, price, original_price, image, description, fabric, weave, color, rating, reviews, badge, created_date, modified_date)
VALUES (9, 'Habaspuri Kumbha Heritage Saree', 'Traditional Odisha Handlooms', 23999, 29999, '/images/products/p8/front.jpg', 'Revival handloom from Kalahandi, Odisha, featuring traditional Kumbha (temple spires) and geometric flora in ivory and amber gold.', 'Fine Cotton Silk', 'Habaspuri Handloom', 'Ivory & Amber Gold', 4.7, 65, 'Artisan Heritage', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO product_images (product_id, image_url) VALUES (9, '/images/products/p8/front.jpg');
INSERT INTO product_images (product_id, image_url) VALUES (9, '/images/products/p8/pallu.jpg');
INSERT INTO product_images (product_id, image_url) VALUES (9, '/images/products/p8/border.jpg');
INSERT INTO product_images (product_id, image_url) VALUES (9, '/images/products/p8/side.jpg');

-- 10. Dongria Kondh Kapadaganda Tribal Saree
INSERT INTO products (id, name, category, price, original_price, image, description, fabric, weave, color, rating, reviews, badge, created_date, modified_date)
VALUES (10, 'Dongria Kondh Kapadaganda Tribal Saree', 'Traditional Odisha Handlooms', 26499, 32999, '/images/products/p9/front.jpg', 'Woven and hand-embroidered by the Dongria Kondh indigenous women of Niyamgiri Hills, featuring symbolic geometric mountain motifs.', 'Handloom Coarse Cotton', 'Kapadaganda Embroidery', 'Natural Off-White & Multicolored', 5, 53, 'Tribal Art', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO product_images (product_id, image_url) VALUES (10, '/images/products/p9/front.jpg');
INSERT INTO product_images (product_id, image_url) VALUES (10, '/images/products/p9/pallu.jpg');
INSERT INTO product_images (product_id, image_url) VALUES (10, '/images/products/p9/border.jpg');
INSERT INTO product_images (product_id, image_url) VALUES (10, '/images/products/p9/side.jpg');

-- 11. Padua Mirgan Tribal Handloom Saree
INSERT INTO products (id, name, category, price, original_price, image, description, fabric, weave, color, rating, reviews, badge, created_date, modified_date)
VALUES (11, 'Padua Mirgan Tribal Handloom Saree', 'Traditional Odisha Handlooms', 21999, 27999, '/images/products/p10/front.jpg', 'Authentic Padua handloom woven on primitive wooden frame looms by Koraput artisans, featuring earthy tribal motifs and river-clay washed yarn.', 'Handspun Organic Cotton', 'Tribal Handloom', 'Deep Clay Maroon & Charcoal', 4.8, 86, 'Loom Craft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO product_images (product_id, image_url) VALUES (11, '/images/products/p10/front.jpg');
INSERT INTO product_images (product_id, image_url) VALUES (11, '/images/products/p10/pallu.jpg');
INSERT INTO product_images (product_id, image_url) VALUES (11, '/images/products/p10/border.jpg');
INSERT INTO product_images (product_id, image_url) VALUES (11, '/images/products/p10/side.jpg');

-- 12. Maniabandha Buddhist Ahimsa Silk Saree
INSERT INTO products (id, name, category, price, original_price, image, description, fabric, weave, color, rating, reviews, badge, created_date, modified_date)
VALUES (12, 'Maniabandha Buddhist Ahimsa Silk Saree', 'Festive Collection', 24999, 30999, '/images/products/p11/front.jpg', 'Woven by the vegetarian Buddhist weaver community of Maniabandha, Cuttack, using ethical non-violent Ahimsa silk and delicate tie-dye waves.', 'Ahimsa Silk', 'Single Ikat Bandha', 'Golden Honey & Cobalt', 4.9, 71, 'Ethical Silk', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO product_images (product_id, image_url) VALUES (12, '/images/products/p11/front.jpg');
INSERT INTO product_images (product_id, image_url) VALUES (12, '/images/products/p11/pallu.jpg');
INSERT INTO product_images (product_id, image_url) VALUES (12, '/images/products/p11/border.jpg');
INSERT INTO product_images (product_id, image_url) VALUES (12, '/images/products/p11/side.jpg');

-- 13. Dhalapathar Rangani Tapestry Saree
INSERT INTO products (id, name, category, price, original_price, image, description, fabric, weave, color, rating, reviews, badge, created_date, modified_date)
VALUES (13, 'Dhalapathar Rangani Tapestry Saree', 'Traditional Odisha Handlooms', 17999, 22999, '/images/products/p12/front.jpg', 'Exceptional heritage weave from Khordha created using the indigenous wooden Chiada technique with auspicious chariot motifs.', 'Handloom Cotton', 'Rangani Tapestry', 'Sky Cyan & Silver', 4.7, 59, 'Rare Weave', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO product_images (product_id, image_url) VALUES (13, '/images/products/p12/front.jpg');
INSERT INTO product_images (product_id, image_url) VALUES (13, '/images/products/p12/pallu.jpg');
INSERT INTO product_images (product_id, image_url) VALUES (13, '/images/products/p12/border.jpg');
INSERT INTO product_images (product_id, image_url) VALUES (13, '/images/products/p12/side.jpg');

-- 14. Sonepuri Hansa & Asavali Silk Saree
INSERT INTO products (id, name, category, price, original_price, image, description, fabric, weave, color, rating, reviews, badge, created_date, modified_date)
VALUES (14, 'Sonepuri Hansa & Asavali Silk Saree', 'Bomkai', 31499, 38999, '/images/products/p13/front.jpg', 'Opulent Sonepuri handloom silk from Western Odisha, displaying classical Hansa (sacred swan), lotus bud, and Asavali creeping vine borders.', 'Pure Mulberry Silk', 'Sonepuri Handloom', 'Forest Pine & Antique Gold', 4.9, 104, 'Popular', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO product_images (product_id, image_url) VALUES (14, '/images/products/p13/front.jpg');
INSERT INTO product_images (product_id, image_url) VALUES (14, '/images/products/p13/pallu.jpg');
INSERT INTO product_images (product_id, image_url) VALUES (14, '/images/products/p13/border.jpg');
INSERT INTO product_images (product_id, image_url) VALUES (14, '/images/products/p13/side.jpg');

-- 15. Bapta Silk-Cotton Bandha Saree
INSERT INTO products (id, name, category, price, original_price, image, description, fabric, weave, color, rating, reviews, badge, created_date, modified_date)
VALUES (15, 'Bapta Silk-Cotton Bandha Saree', 'Festive Collection', 16999, 21999, '/images/products/p14/front.jpg', 'Traditional Odia Bapta weave uniting pure silk warp with breathable fine cotton weft, adorned with delicate Bandha tie-dye florets.', 'Silk Cotton Bapta', 'Bandha Weft Ikat', 'Magenta & Golden Zari', 4.8, 122, 'Festive Pick', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO product_images (product_id, image_url) VALUES (15, '/images/products/p14/front.jpg');
INSERT INTO product_images (product_id, image_url) VALUES (15, '/images/products/p14/pallu.jpg');
INSERT INTO product_images (product_id, image_url) VALUES (15, '/images/products/p14/border.jpg');
INSERT INTO product_images (product_id, image_url) VALUES (15, '/images/products/p14/side.jpg');

-- 16. Padua Wild Forest Tussar Saree
INSERT INTO products (id, name, category, price, original_price, image, description, fabric, weave, color, rating, reviews, badge, created_date, modified_date)
VALUES (16, 'Padua Wild Forest Tussar Saree', 'Traditional Odisha Handlooms', 28499, 35999, '/images/products/p15/front.jpg', 'Hand-reeled wild forest Tussar silk nurtured in the tribal highlands of Koraput, with natural golden sheen and charcoal temple kumbha.', 'Pure Forest Tussar', 'Tribal Handloom', 'Natural Honey Gold & Charcoal', 4.9, 89, 'Limited Stock', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO product_images (product_id, image_url) VALUES (16, '/images/products/p15/front.jpg');
INSERT INTO product_images (product_id, image_url) VALUES (16, '/images/products/p15/pallu.jpg');
INSERT INTO product_images (product_id, image_url) VALUES (16, '/images/products/p15/border.jpg');
INSERT INTO product_images (product_id, image_url) VALUES (16, '/images/products/p15/side.jpg');

-- 17. Barpali Double Ikat Bandha Silk Saree
INSERT INTO products (id, name, category, price, original_price, image, description, fabric, weave, color, rating, reviews, badge, created_date, modified_date)
VALUES (17, 'Barpali Double Ikat Bandha Silk Saree', 'Sambalpuri Ikat', 38999, 46999, '/images/products/p16/front.jpg', 'Mathematical precision in silk by master weavers of Barpali, featuring double-ikat warp and weft alignment with sacred conch motifs.', 'Pure Mulberry Silk', 'Double Ikat Bandha', 'Midnight Indigo & Crimson', 5, 68, 'Masterpiece', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO product_images (product_id, image_url) VALUES (17, '/images/products/p16/front.jpg');
INSERT INTO product_images (product_id, image_url) VALUES (17, '/images/products/p16/pallu.jpg');
INSERT INTO product_images (product_id, image_url) VALUES (17, '/images/products/p16/border.jpg');
INSERT INTO product_images (product_id, image_url) VALUES (17, '/images/products/p16/side.jpg');

-- 18. Nuapatna Khadua Malabati Bridal Saree
INSERT INTO products (id, name, category, price, original_price, image, description, fabric, weave, color, rating, reviews, badge, created_date, modified_date)
VALUES (18, 'Nuapatna Khadua Malabati Bridal Saree', 'Wedding & Bridal', 41999, 51999, '/images/products/p17/front.jpg', 'Grand bridal Khadua Pata woven with the signature Malabati border and auspicious floral bandha motifs, consecrated for sacred wedding ceremonies.', 'Pure Mulberry Silk', 'Nuapatna Bridal Ikat', 'Champagne Gold & Rose', 5, 97, 'Bridal Heirloom', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO product_images (product_id, image_url) VALUES (18, '/images/products/p17/front.jpg');
INSERT INTO product_images (product_id, image_url) VALUES (18, '/images/products/p17/pallu.jpg');
INSERT INTO product_images (product_id, image_url) VALUES (18, '/images/products/p17/border.jpg');
INSERT INTO product_images (product_id, image_url) VALUES (18, '/images/products/p17/side.jpg');

