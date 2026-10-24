TRUNCATE TABLE product_images, recent_views CASCADE;
TRUNCATE TABLE products RESTART IDENTITY CASCADE;

-- 1. Padua Koraput Temple Weave (Brand New AI Generated Cover & 3 Side Angles)
INSERT INTO products (id, name, category, price, original_price, image, description, fabric, weave, color, rating, reviews, badge, created_date, modified_date)
VALUES (1, 'Padua Koraput Temple Weave', 'Padua', 19999, 26999, '/images/products/p1/front.jpg', 'Handspun organic cotton woven by the master Mirgan weavers of Padua, Koraput, featuring sacred geometric temple spires and deep madder root dyes.', 'Organic Handspun Cotton', 'Mirgan Handloom', 'Earthy Terracotta & Indigo', 4.9, 142, 'GI Certified', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO product_images (product_id, image_url) VALUES (1, '/images/products/p1/front.jpg');
INSERT INTO product_images (product_id, image_url) VALUES (1, '/images/products/p1/pallu.jpg');
INSERT INTO product_images (product_id, image_url) VALUES (1, '/images/products/p1/border.jpg');
INSERT INTO product_images (product_id, image_url) VALUES (1, '/images/products/p1/side.jpg');

-- 2. Sambalpuri Royal Bandha Silk (Brand New AI Generated Cover & Pallu)
INSERT INTO products (id, name, category, price, original_price, image, description, fabric, weave, color, rating, reviews, badge, created_date, modified_date)
VALUES (2, 'Sambalpuri Royal Bandha Silk', 'Sambalpuri', 27999, 35999, '/images/products/p2/front.jpg', 'Masterpiece Sambalpuri Bandha tie-dye silk from Bargarh, featuring intricate shankha (conch) and chakra motifs woven with pure gold zari accents.', 'Pure Mulberry Silk', 'Bandha Tie-Dye', 'Royal Purple & Gold', 5.0, 188, 'Bestseller', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO product_images (product_id, image_url) VALUES (2, '/images/products/p2/front.jpg');
INSERT INTO product_images (product_id, image_url) VALUES (2, '/images/products/p2/pallu.jpg');
INSERT INTO product_images (product_id, image_url) VALUES (2, '/images/products/p2/border.jpg');
INSERT INTO product_images (product_id, image_url) VALUES (2, '/images/products/p2/side.jpg');

-- 3. Khandua Pata Gita Govinda Drape (Brand New AI Generated Cover & Pallu)
INSERT INTO products (id, name, category, price, original_price, image, description, fabric, weave, color, rating, reviews, badge, created_date, modified_date)
VALUES (3, 'Khandua Pata Gita Govinda Drape', 'Khandua', 34999, 44999, '/images/products/p3/front.jpg', 'Sacred Nuapatna Khandua Pata traditionally consecrated for Lord Jagannath, woven with revered Gitagovinda calligraphic verses and lotus medallions.', 'Malda Mulberry Silk', 'Nuapatna Ikat', 'Sanctified Crimson & Gold', 4.9, 115, 'Heirloom', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO product_images (product_id, image_url) VALUES (3, '/images/products/p3/front.jpg');
INSERT INTO product_images (product_id, image_url) VALUES (3, '/images/products/p3/pallu.jpg');
INSERT INTO product_images (product_id, image_url) VALUES (3, '/images/products/p3/border.jpg');
INSERT INTO product_images (product_id, image_url) VALUES (3, '/images/products/p3/side.jpg');

-- 4. Bomkai Sonepuri Silk Masterpiece (Brand New AI Generated Cover & Pallu)
INSERT INTO products (id, name, category, price, original_price, image, description, fabric, weave, color, rating, reviews, badge, created_date, modified_date)
VALUES (4, 'Bomkai Sonepuri Silk Masterpiece', 'Bomkai', 29999, 39999, '/images/products/p4/front.jpg', 'Legendary Bomkai silk from Subarnapur featuring intricate jhabba pallu and traditional bitter gourd (karela) and peacock motifs woven with extra-weft artistry.', 'Pure Mulberry Silk', 'Extra Weft Jaal', 'Saffron Orange & Gold', 4.8, 96, 'Royal Heritage', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO product_images (product_id, image_url) VALUES (4, '/images/products/p4/front.jpg');
INSERT INTO product_images (product_id, image_url) VALUES (4, '/images/products/p4/pallu.jpg');
INSERT INTO product_images (product_id, image_url) VALUES (4, '/images/products/p4/border.jpg');
INSERT INTO product_images (product_id, image_url) VALUES (4, '/images/products/p4/side.jpg');

-- 5. Berhampuri Phoda Kumbha Pata (Brand New AI Generated Cover & Pallu)
INSERT INTO products (id, name, category, price, original_price, image, description, fabric, weave, color, rating, reviews, badge, created_date, modified_date)
VALUES (5, 'Berhampuri Phoda Kumbha Pata', 'Berhampuri', 36999, 46999, '/images/products/p5/front.jpg', 'From the historic Silk City of Berhampur, this GI-tagged pure silk saree showcases distinct needle-interlocked Phoda Kumbha temple spires along the border.', 'Heavy Mulberry Silk', 'Phoda Kumbha Handloom', 'Emerald Green & Ruby', 5.0, 78, 'GI Certified', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO product_images (product_id, image_url) VALUES (5, '/images/products/p5/front.jpg');
INSERT INTO product_images (product_id, image_url) VALUES (5, '/images/products/p5/pallu.jpg');
INSERT INTO product_images (product_id, image_url) VALUES (5, '/images/products/p5/border.jpg');
INSERT INTO product_images (product_id, image_url) VALUES (5, '/images/products/p5/side.jpg');

-- 6. Pasapalli Imperial Chessboard Silk (Brand New AI Generated Cover)
INSERT INTO products (id, name, category, price, original_price, image, description, fabric, weave, color, rating, reviews, badge, created_date, modified_date)
VALUES (6, 'Pasapalli Imperial Chessboard Silk', 'Pasapalli', 32999, 41999, '/images/products/p6/front.jpg', 'Iconic Pasapalli saree from Western Odisha, named after the ancient royal dice game (Pasa), woven in an unmistakable contrast chessboard ikat grid.', 'Pure Silk', 'Pasapalli Double Bandha', 'Ebony & Imperial Maroon', 4.9, 134, 'Limited Edition', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO product_images (product_id, image_url) VALUES (6, '/images/products/p6/front.jpg');
INSERT INTO product_images (product_id, image_url) VALUES (6, '/images/products/p6/pallu.jpg');
INSERT INTO product_images (product_id, image_url) VALUES (6, '/images/products/p6/border.jpg');
INSERT INTO product_images (product_id, image_url) VALUES (6, '/images/products/p6/side.jpg');

-- 7. Kotpad Organic Aal Tree Mirgan Drape
INSERT INTO products (id, name, category, price, original_price, image, description, fabric, weave, color, rating, reviews, badge, created_date, modified_date)
VALUES (7, 'Kotpad Organic Aal Tree Mirgan Drape', 'Kotpad', 18499, 23999, '/images/products/p7/front.jpg', 'Eco-certified tribal handloom from Kotpad, Koraput, dyed exclusively with non-toxic natural Aal (Madder) root extract and castor oil on hand-spun unbleached cotton.', 'Organic Handspun Cotton', 'Pit Loom Mirgan Weave', 'Rust Ochre & Madder Red', 4.8, 92, 'GI Certified', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO product_images (product_id, image_url) VALUES (7, '/images/products/p7/front.jpg');
INSERT INTO product_images (product_id, image_url) VALUES (7, '/images/products/p7/pallu.jpg');
INSERT INTO product_images (product_id, image_url) VALUES (7, '/images/products/p7/border.jpg');
INSERT INTO product_images (product_id, image_url) VALUES (7, '/images/products/p7/side.jpg');

-- 8. Habaspuri Kumbha Heritage Weave
INSERT INTO products (id, name, category, price, original_price, image, description, fabric, weave, color, rating, reviews, badge, created_date, modified_date)
VALUES (8, 'Habaspuri Kumbha Heritage Weave', 'Habaspuri', 23999, 30999, '/images/products/p8/front.jpg', 'Rare revival handloom from Kalahandi, Odisha, featuring traditional Kumbha (temple spires), fishes, and geometric flora preserved by master weavers.', 'Fine Cotton Silk', 'Habaspuri Handloom', 'Ivory & Amber Gold', 4.7, 65, 'Artisan Guild', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO product_images (product_id, image_url) VALUES (8, '/images/products/p8/front.jpg');
INSERT INTO product_images (product_id, image_url) VALUES (8, '/images/products/p8/pallu.jpg');
INSERT INTO product_images (product_id, image_url) VALUES (8, '/images/products/p8/border.jpg');
INSERT INTO product_images (product_id, image_url) VALUES (8, '/images/products/p8/side.jpg');

-- 9. Dongria Kondh Kapadaganda Tribal Saree
INSERT INTO products (id, name, category, price, original_price, image, description, fabric, weave, color, rating, reviews, badge, created_date, modified_date)
VALUES (9, 'Dongria Kondh Kapadaganda Tribal Saree', 'Dongria', 26499, 33999, '/images/products/p9/front.jpg', 'Woven and hand-embroidered by the Dongria Kondh indigenous women of Niyamgiri Hills, Rayagada, featuring symbolic red, green, and yellow mountain motifs.', 'Handloom Coarse Cotton', 'Kapadaganda Embroidery', 'Natural Off-White & Multicolored', 5.0, 53, 'GI Certified', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO product_images (product_id, image_url) VALUES (9, '/images/products/p9/front.jpg');
INSERT INTO product_images (product_id, image_url) VALUES (9, '/images/products/p9/pallu.jpg');
INSERT INTO product_images (product_id, image_url) VALUES (9, '/images/products/p9/border.jpg');
INSERT INTO product_images (product_id, image_url) VALUES (9, '/images/products/p9/side.jpg');

-- 10. Padua Mirgan Tribal Handloom
INSERT INTO products (id, name, category, price, original_price, image, description, fabric, weave, color, rating, reviews, badge, created_date, modified_date)
VALUES (10, 'Padua Mirgan Tribal Handloom', 'Padua', 21999, 28499, '/images/products/p10/front.jpg', 'Authentic Padua handloom woven on primitive wooden frame looms by Koraput artisans, featuring earthy tribal bird motifs and river-clay washed yarn.', 'Handspun Organic Cotton', 'Tribal Handloom', 'Deep Clay Maroon & Charcoal', 4.8, 86, 'Exclusive', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO product_images (product_id, image_url) VALUES (10, '/images/products/p10/front.jpg');
INSERT INTO product_images (product_id, image_url) VALUES (10, '/images/products/p10/pallu.jpg');
INSERT INTO product_images (product_id, image_url) VALUES (10, '/images/products/p10/border.jpg');
INSERT INTO product_images (product_id, image_url) VALUES (10, '/images/products/p10/side.jpg');

-- 11. Maniabandha Buddhist Ikkat Pata
INSERT INTO products (id, name, category, price, original_price, image, description, fabric, weave, color, rating, reviews, badge, created_date, modified_date)
VALUES (11, 'Maniabandha Buddhist Ikkat Pata', 'Maniabandha', 24999, 31999, '/images/products/p11/front.jpg', 'Woven by the vegetarian Buddhist weaver community of Maniabandha, Cuttack, using ethical non-violent Ahimsa silk and delicate tie-dye waves.', 'Ahimsa Silk', 'Single Ikat Bandha', 'Golden Honey & Cobalt', 4.9, 71, 'Ethical Heirloom', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO product_images (product_id, image_url) VALUES (11, '/images/products/p11/front.jpg');
INSERT INTO product_images (product_id, image_url) VALUES (11, '/images/products/p11/pallu.jpg');
INSERT INTO product_images (product_id, image_url) VALUES (11, '/images/products/p11/border.jpg');
INSERT INTO product_images (product_id, image_url) VALUES (11, '/images/products/p11/side.jpg');

-- 12. Dhalapathar Rangani Tapestry Saree
INSERT INTO products (id, name, category, price, original_price, image, description, fabric, weave, color, rating, reviews, badge, created_date, modified_date)
VALUES (12, 'Dhalapathar Rangani Tapestry Saree', 'Dhalapathar', 17999, 24999, '/images/products/p12/front.jpg', 'Exceptional heritage weave from Khordha, Odisha, created without drawboys using the indigenous wooden Chiada technique with Lord Jagannath chariot motifs.', 'Handloom Cotton', 'Rangani Tapestry', 'Sky Cyan & Silver', 4.7, 59, 'Heritage Revival', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO product_images (product_id, image_url) VALUES (12, '/images/products/p12/front.jpg');
INSERT INTO product_images (product_id, image_url) VALUES (12, '/images/products/p12/pallu.jpg');
INSERT INTO product_images (product_id, image_url) VALUES (12, '/images/products/p12/border.jpg');
INSERT INTO product_images (product_id, image_url) VALUES (12, '/images/products/p12/side.jpg');

-- 13. Sonepuri Hansa & Asavali Zari Silk
INSERT INTO products (id, name, category, price, original_price, image, description, fabric, weave, color, rating, reviews, badge, created_date, modified_date)
VALUES (13, 'Sonepuri Hansa & Asavali Zari Silk', 'Bomkai', 31499, 39999, '/images/products/p13/front.jpg', 'Opulent Sonepuri handloom silk from Western Odisha, displaying classical Hansa (sacred swan), lotus bud, and Asavali creeping vine borders.', 'Pure Mulberry Silk', 'Sonepuri Handloom', 'Forest Pine & Antique Gold', 4.9, 104, 'Premium', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO product_images (product_id, image_url) VALUES (13, '/images/products/p13/front.jpg');
INSERT INTO product_images (product_id, image_url) VALUES (13, '/images/products/p13/pallu.jpg');
INSERT INTO product_images (product_id, image_url) VALUES (13, '/images/products/p13/border.jpg');
INSERT INTO product_images (product_id, image_url) VALUES (13, '/images/products/p13/side.jpg');

-- 14. Bapta Silk-Cotton Bandha
INSERT INTO products (id, name, category, price, original_price, image, description, fabric, weave, color, rating, reviews, badge, created_date, modified_date)
VALUES (14, 'Bapta Silk-Cotton Bandha', 'Sambalpuri', 16999, 22499, '/images/products/p14/front.jpg', 'Traditional Odia Bapta weave uniting pure silk warp with breathable fine cotton weft, adorned with delicate Bandha tie-dye florets.', 'Silk Cotton Bapta', 'Bandha Weft Ikat', 'Magenta & Golden Zari', 4.8, 122, 'Artisan Guild', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO product_images (product_id, image_url) VALUES (14, '/images/products/p14/front.jpg');
INSERT INTO product_images (product_id, image_url) VALUES (14, '/images/products/p14/pallu.jpg');
INSERT INTO product_images (product_id, image_url) VALUES (14, '/images/products/p14/border.jpg');
INSERT INTO product_images (product_id, image_url) VALUES (14, '/images/products/p14/side.jpg');

-- 15. Padua Wild Forest Tussar Drape
INSERT INTO products (id, name, category, price, original_price, image, description, fabric, weave, color, rating, reviews, badge, created_date, modified_date)
VALUES (15, 'Padua Wild Forest Tussar Drape', 'Padua', 28499, 36999, '/images/products/p15/front.jpg', 'Hand-reeled wild forest Tussar silk nurtured in the tribal highlands of Padua, Koraput, with natural golden sheen and charcoal temple kumbha.', 'Pure Forest Tussar', 'Tribal Handloom', 'Natural Honey Gold & Charcoal', 4.9, 89, 'Limited Edition', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO product_images (product_id, image_url) VALUES (15, '/images/products/p15/front.jpg');
INSERT INTO product_images (product_id, image_url) VALUES (15, '/images/products/p15/pallu.jpg');
INSERT INTO product_images (product_id, image_url) VALUES (15, '/images/products/p15/border.jpg');
INSERT INTO product_images (product_id, image_url) VALUES (15, '/images/products/p15/side.jpg');

-- 16. Barpali Double Ikat Bandha Silk
INSERT INTO products (id, name, category, price, original_price, image, description, fabric, weave, color, rating, reviews, badge, created_date, modified_date)
VALUES (16, 'Barpali Double Ikat Bandha Silk', 'Sambalpuri', 38999, 48999, '/images/products/p16/front.jpg', 'Mathematical perfection in silk by national award-winning weavers of Barpali, featuring double-ikat warp and weft alignment with sacred conch shell motifs.', 'Pure Mulberry Silk', 'Double Ikat Bandha', 'Midnight Indigo & Crimson', 5.0, 68, 'Masterpiece', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO product_images (product_id, image_url) VALUES (16, '/images/products/p16/front.jpg');
INSERT INTO product_images (product_id, image_url) VALUES (16, '/images/products/p16/pallu.jpg');
INSERT INTO product_images (product_id, image_url) VALUES (16, '/images/products/p16/border.jpg');
INSERT INTO product_images (product_id, image_url) VALUES (16, '/images/products/p16/side.jpg');

-- 17. Gopalpur GI Tussar Handloom
INSERT INTO products (id, name, category, price, original_price, image, description, fabric, weave, color, rating, reviews, badge, created_date, modified_date)
VALUES (17, 'Gopalpur GI Tussar Handloom', 'Tussar Odia', 22999, 29999, '/images/products/p17/front.jpg', 'Celebrated GI-registered handloom from Gopalpur, Jajpur district, woven from wild Ghicha Tussar silk with rich natural slub texture and tribal motifs.', 'Ghicha Tussar Silk', 'Handloom Ribbed Weave', 'Champagne Gold & Cocoa', 4.8, 114, 'GI Certified', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO product_images (product_id, image_url) VALUES (17, '/images/products/p17/front.jpg');
INSERT INTO product_images (product_id, image_url) VALUES (17, '/images/products/p17/pallu.jpg');
INSERT INTO product_images (product_id, image_url) VALUES (17, '/images/products/p17/border.jpg');
INSERT INTO product_images (product_id, image_url) VALUES (17, '/images/products/p17/side.jpg');

-- 18. Nuapatna Khandua Malabati Bridal Pata
INSERT INTO products (id, name, category, price, original_price, image, description, fabric, weave, color, rating, reviews, badge, created_date, modified_date)
VALUES (18, 'Nuapatna Khandua Malabati Bridal Pata', 'Khandua', 41999, 52999, '/images/products/p18/front.jpg', 'Grand bridal Khandua Pata woven with the signature Malabati border and auspicious floral bandha motifs, consecrated for sacred wedding ceremonies.', 'Pure Mulberry Silk', 'Nuapatna Bridal Ikat', 'Blush Rose & Rich Gold', 5.0, 97, 'Bridal Heritage', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO product_images (product_id, image_url) VALUES (18, '/images/products/p18/front.jpg');
INSERT INTO product_images (product_id, image_url) VALUES (18, '/images/products/p18/pallu.jpg');
INSERT INTO product_images (product_id, image_url) VALUES (18, '/images/products/p18/border.jpg');
INSERT INTO product_images (product_id, image_url) VALUES (18, '/images/products/p18/side.jpg');
