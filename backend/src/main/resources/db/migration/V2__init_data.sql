INSERT INTO app_config (config_key, config_value) VALUES ('OTP_VALIDITY_MINUTES', '2');
INSERT INTO app_config (config_key, config_value) VALUES ('OTP_MAX_ATTEMPTS', '5');

INSERT INTO users (first_name, last_name, email, password, phone, role, email_verified, phone_verified, provider, created_date, modified_date) 
VALUES ('Super', 'Admin', 'admin@vastraloom.com', '$2a$10$w0X3nFjSgYtJ8L/jE.rMDeu5G0zK1CqBkVrR0Z5hV6LgGvJ/mD8kS', '9999999999', 'ROLE_ADMIN', true, true, 'local', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- 1. Padua Koraput Temple Weave
INSERT INTO products (id, name, category, price, original_price, image, description, fabric, weave, color, rating, reviews, badge, created_date, modified_date)
VALUES (1, 'Padua Koraput Temple Weave', 'Padua', 19999, 26999, '/images/saree_front_1.png', 'Handspun organic cotton woven by the master Mirgan weavers of Padua, Koraput, featuring sacred geometric temple spires and deep madder root dyes.', 'Organic Handspun Cotton', 'Mirgan Handloom', 'Earthy Terracotta & Indigo', 4.9, 142, 'GI Certified', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO product_images (product_id, image_url) VALUES (1, '/images/saree_front_1.png');
INSERT INTO product_images (product_id, image_url) VALUES (1, '/images/saree_master_pallu.png');
INSERT INTO product_images (product_id, image_url) VALUES (1, '/images/saree_master_border.png');
INSERT INTO product_images (product_id, image_url) VALUES (1, '/images/saree_master_side.png');

-- 2. Sambalpuri Royal Bandha Silk
INSERT INTO products (id, name, category, price, original_price, image, description, fabric, weave, color, rating, reviews, badge, created_date, modified_date)
VALUES (2, 'Sambalpuri Royal Bandha Silk', 'Sambalpuri', 27999, 35999, '/images/saree_purple_gold.png', 'Masterpiece Sambalpuri Bandha tie-dye silk from Bargarh, featuring intricate shankha (conch) and chakra motifs woven with pure gold zari accents.', 'Pure Mulberry Silk', 'Bandha Tie-Dye', 'Royal Purple & Gold', 5.0, 188, 'Bestseller', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO product_images (product_id, image_url) VALUES (2, '/images/saree_purple_gold.png');
INSERT INTO product_images (product_id, image_url) VALUES (2, '/images/saree_master_pallu.png');
INSERT INTO product_images (product_id, image_url) VALUES (2, '/images/saree_master_border.png');
INSERT INTO product_images (product_id, image_url) VALUES (2, '/images/saree_master_side.png');

-- 3. Khandua Pata Gita Govinda Drape
INSERT INTO products (id, name, category, price, original_price, image, description, fabric, weave, color, rating, reviews, badge, created_date, modified_date)
VALUES (3, 'Khandua Pata Gita Govinda Drape', 'Khandua', 34999, 44999, '/images/saree_crimson_red.png', 'Sacred Nuapatna Khandua Pata traditionally consecrated for Lord Jagannath, woven with revered Gitagovinda calligraphic verses and lotus medallions.', 'Malda Mulberry Silk', 'Nuapatna Ikat', 'Sanctified Crimson & Gold', 4.9, 115, 'Heirloom', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO product_images (product_id, image_url) VALUES (3, '/images/saree_crimson_red.png');
INSERT INTO product_images (product_id, image_url) VALUES (3, '/images/saree_master_pallu.png');
INSERT INTO product_images (product_id, image_url) VALUES (3, '/images/saree_master_border.png');
INSERT INTO product_images (product_id, image_url) VALUES (3, '/images/saree_master_side.png');

-- 4. Bomkai Sonepuri Silk Masterpiece
INSERT INTO products (id, name, category, price, original_price, image, description, fabric, weave, color, rating, reviews, badge, created_date, modified_date)
VALUES (4, 'Bomkai Sonepuri Silk Masterpiece', 'Bomkai', 29999, 39999, '/images/saree_saffron_orange.png', 'Legendary Bomkai silk from Subarnapur featuring intricate jhabba pallu and traditional bitter gourd (karela) and peacock motifs woven with extra-weft artistry.', 'Pure Mulberry Silk', 'Extra Weft Jaal', 'Saffron Orange & Gold', 4.8, 96, 'Royal Heritage', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO product_images (product_id, image_url) VALUES (4, '/images/saree_saffron_orange.png');
INSERT INTO product_images (product_id, image_url) VALUES (4, '/images/saree_master_pallu.png');
INSERT INTO product_images (product_id, image_url) VALUES (4, '/images/saree_master_border.png');
INSERT INTO product_images (product_id, image_url) VALUES (4, '/images/saree_master_side.png');

-- 5. Berhampuri Phoda Kumbha Pata
INSERT INTO products (id, name, category, price, original_price, image, description, fabric, weave, color, rating, reviews, badge, created_date, modified_date)
VALUES (5, 'Berhampuri Phoda Kumbha Pata', 'Berhampuri', 36999, 46999, '/images/saree_emerald_green.png', 'From the historic Silk City of Berhampur, this GI-tagged pure silk saree showcases distinct needle-interlocked Phoda Kumbha temple spires along the border.', 'Heavy Mulberry Silk', 'Phoda Kumbha Handloom', 'Emerald Green & Ruby', 5.0, 78, 'GI Certified', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO product_images (product_id, image_url) VALUES (5, '/images/saree_emerald_green.png');
INSERT INTO product_images (product_id, image_url) VALUES (5, '/images/saree_master_pallu.png');
INSERT INTO product_images (product_id, image_url) VALUES (5, '/images/saree_master_border.png');
INSERT INTO product_images (product_id, image_url) VALUES (5, '/images/saree_master_side.png');

-- 6. Pasapalli Imperial Chessboard Silk
INSERT INTO products (id, name, category, price, original_price, image, description, fabric, weave, color, rating, reviews, badge, created_date, modified_date)
VALUES (6, 'Pasapalli Imperial Chessboard Silk', 'Pasapalli', 32999, 41999, '/images/saree_master_front.png', 'Iconic Pasapalli saree from Western Odisha, named after the ancient royal dice game (Pasa), woven in an unmistakable contrast chessboard ikat grid.', 'Pure Silk', 'Pasapalli Double Bandha', 'Ebony & Imperial Maroon', 4.9, 134, 'Limited Edition', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO product_images (product_id, image_url) VALUES (6, '/images/saree_master_front.png');
INSERT INTO product_images (product_id, image_url) VALUES (6, '/images/saree_master_pallu.png');
INSERT INTO product_images (product_id, image_url) VALUES (6, '/images/saree_master_border.png');
INSERT INTO product_images (product_id, image_url) VALUES (6, '/images/saree_master_side.png');

-- 7. Kotpad Organic Aal Tree Mirgan Drape
INSERT INTO products (id, name, category, price, original_price, image, description, fabric, weave, color, rating, reviews, badge, created_date, modified_date)
VALUES (7, 'Kotpad Organic Aal Tree Mirgan Drape', 'Kotpad', 18499, 23999, '/images/saree_front_2.png', 'Eco-certified tribal handloom from Kotpad, Koraput, dyed exclusively with non-toxic natural Aal (Madder) root extract and castor oil on hand-spun unbleached cotton.', 'Organic Handspun Cotton', 'Pit Loom Mirgan Weave', 'Rust Ochre & Madder Red', 4.8, 92, 'GI Certified', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO product_images (product_id, image_url) VALUES (7, '/images/saree_front_2.png');
INSERT INTO product_images (product_id, image_url) VALUES (7, '/images/saree_master_pallu.png');
INSERT INTO product_images (product_id, image_url) VALUES (7, '/images/saree_master_border.png');
INSERT INTO product_images (product_id, image_url) VALUES (7, '/images/saree_master_side.png');

-- 8. Habaspuri Kumbha Heritage Weave
INSERT INTO products (id, name, category, price, original_price, image, description, fabric, weave, color, rating, reviews, badge, created_date, modified_date)
VALUES (8, 'Habaspuri Kumbha Heritage Weave', 'Habaspuri', 23999, 30999, '/images/saree_front_3.png', 'Rare revival handloom from Kalahandi, Odisha, featuring traditional Kumbha (temple spires), fishes, and geometric flora preserved by master weavers.', 'Fine Cotton Silk', 'Habaspuri Handloom', 'Ivory & Amber Gold', 4.7, 65, 'Artisan Guild', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO product_images (product_id, image_url) VALUES (8, '/images/saree_front_3.png');
INSERT INTO product_images (product_id, image_url) VALUES (8, '/images/saree_master_pallu.png');
INSERT INTO product_images (product_id, image_url) VALUES (8, '/images/saree_master_border.png');
INSERT INTO product_images (product_id, image_url) VALUES (8, '/images/saree_master_side.png');

-- 9. Dongria Kondh Kapadaganda Tribal Saree
INSERT INTO products (id, name, category, price, original_price, image, description, fabric, weave, color, rating, reviews, badge, created_date, modified_date)
VALUES (9, 'Dongria Kondh Kapadaganda Tribal Saree', 'Dongria', 26499, 33999, '/images/saree_front_4.png', 'Woven and hand-embroidered by the Dongria Kondh indigenous women of Niyamgiri Hills, Rayagada, featuring symbolic red, green, and yellow mountain motifs.', 'Handloom Coarse Cotton', 'Kapadaganda Embroidery', 'Natural Off-White & Multicolored', 5.0, 53, 'GI Certified', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO product_images (product_id, image_url) VALUES (9, '/images/saree_front_4.png');
INSERT INTO product_images (product_id, image_url) VALUES (9, '/images/saree_master_pallu.png');
INSERT INTO product_images (product_id, image_url) VALUES (9, '/images/saree_master_border.png');
INSERT INTO product_images (product_id, image_url) VALUES (9, '/images/saree_master_side.png');

-- 10. Padua Mirgan Tribal Handloom
INSERT INTO products (id, name, category, price, original_price, image, description, fabric, weave, color, rating, reviews, badge, created_date, modified_date)
VALUES (10, 'Padua Mirgan Tribal Handloom', 'Padua', 21999, 28499, '/images/saree_front_5.png', 'Authentic Padua handloom woven on primitive wooden frame looms by Koraput artisans, featuring earthy tribal bird motifs and river-clay washed yarn.', 'Handspun Organic Cotton', 'Tribal Handloom', 'Deep Clay Maroon & Charcoal', 4.8, 86, 'Exclusive', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO product_images (product_id, image_url) VALUES (10, '/images/saree_front_5.png');
INSERT INTO product_images (product_id, image_url) VALUES (10, '/images/saree_master_pallu.png');
INSERT INTO product_images (product_id, image_url) VALUES (10, '/images/saree_master_border.png');
INSERT INTO product_images (product_id, image_url) VALUES (10, '/images/saree_master_side.png');

-- 11. Maniabandha Buddhist Ikkat Pata
INSERT INTO products (id, name, category, price, original_price, image, description, fabric, weave, color, rating, reviews, badge, created_date, modified_date)
VALUES (11, 'Maniabandha Buddhist Ikkat Pata', 'Maniabandha', 24999, 31999, '/images/saree_front_6.png', 'Woven by the vegetarian Buddhist weaver community of Maniabandha, Cuttack, using ethical non-violent Ahimsa silk and delicate tie-dye waves.', 'Ahimsa Silk', 'Single Ikat Bandha', 'Golden Honey & Cobalt', 4.9, 71, 'Ethical Heirloom', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO product_images (product_id, image_url) VALUES (11, '/images/saree_front_6.png');
INSERT INTO product_images (product_id, image_url) VALUES (11, '/images/saree_master_pallu.png');
INSERT INTO product_images (product_id, image_url) VALUES (11, '/images/saree_master_border.png');
INSERT INTO product_images (product_id, image_url) VALUES (11, '/images/saree_master_side.png');

-- 12. Dhalapathar Rangani Tapestry Saree
INSERT INTO products (id, name, category, price, original_price, image, description, fabric, weave, color, rating, reviews, badge, created_date, modified_date)
VALUES (12, 'Dhalapathar Rangani Tapestry Saree', 'Dhalapathar', 17999, 24999, '/images/saree_front_7.png', 'Exceptional heritage weave from Khordha, Odisha, created without drawboys using the indigenous wooden Chiada technique with Lord Jagannath chariot motifs.', 'Handloom Cotton', 'Rangani Tapestry', 'Sky Cyan & Silver', 4.7, 59, 'Heritage Revival', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO product_images (product_id, image_url) VALUES (12, '/images/saree_front_7.png');
INSERT INTO product_images (product_id, image_url) VALUES (12, '/images/saree_master_pallu.png');
INSERT INTO product_images (product_id, image_url) VALUES (12, '/images/saree_master_border.png');
INSERT INTO product_images (product_id, image_url) VALUES (12, '/images/saree_master_side.png');

-- 13. Sonepuri Hansa & Asavali Zari Silk
INSERT INTO products (id, name, category, price, original_price, image, description, fabric, weave, color, rating, reviews, badge, created_date, modified_date)
VALUES (13, 'Sonepuri Hansa & Asavali Zari Silk', 'Bomkai', 31499, 39999, '/images/saree_front_8.png', 'Opulent Sonepuri handloom silk from Western Odisha, displaying classical Hansa (sacred swan), lotus bud, and Asavali creeping vine borders.', 'Pure Mulberry Silk', 'Sonepuri Handloom', 'Forest Pine & Antique Gold', 4.9, 104, 'Premium', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO product_images (product_id, image_url) VALUES (13, '/images/saree_front_8.png');
INSERT INTO product_images (product_id, image_url) VALUES (13, '/images/saree_master_pallu.png');
INSERT INTO product_images (product_id, image_url) VALUES (13, '/images/saree_master_border.png');
INSERT INTO product_images (product_id, image_url) VALUES (13, '/images/saree_master_side.png');

-- 14. Bapta Silk-Cotton Bandha
INSERT INTO products (id, name, category, price, original_price, image, description, fabric, weave, color, rating, reviews, badge, created_date, modified_date)
VALUES (14, 'Bapta Silk-Cotton Bandha', 'Sambalpuri', 16999, 22499, '/images/saree_front_9.png', 'Traditional Odia Bapta weave uniting pure silk warp with breathable fine cotton weft, adorned with delicate Bandha tie-dye florets.', 'Silk Cotton Bapta', 'Bandha Weft Ikat', 'Magenta & Golden Zari', 4.8, 122, 'Artisan Guild', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO product_images (product_id, image_url) VALUES (14, '/images/saree_front_9.png');
INSERT INTO product_images (product_id, image_url) VALUES (14, '/images/saree_master_pallu.png');
INSERT INTO product_images (product_id, image_url) VALUES (14, '/images/saree_master_border.png');
INSERT INTO product_images (product_id, image_url) VALUES (14, '/images/saree_master_side.png');

-- 15. Padua Wild Forest Tussar Drape
INSERT INTO products (id, name, category, price, original_price, image, description, fabric, weave, color, rating, reviews, badge, created_date, modified_date)
VALUES (15, 'Padua Wild Forest Tussar Drape', 'Padua', 28499, 36999, '/images/saree_front_10.png', 'Hand-reeled wild forest Tussar silk nurtured in the tribal highlands of Padua, Koraput, with natural golden sheen and charcoal temple kumbha.', 'Pure Forest Tussar', 'Tribal Handloom', 'Natural Honey Gold & Charcoal', 4.9, 89, 'Limited Edition', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO product_images (product_id, image_url) VALUES (15, '/images/saree_front_10.png');
INSERT INTO product_images (product_id, image_url) VALUES (15, '/images/saree_master_pallu.png');
INSERT INTO product_images (product_id, image_url) VALUES (15, '/images/saree_master_border.png');
INSERT INTO product_images (product_id, image_url) VALUES (15, '/images/saree_master_side.png');

-- 16. Barpali Double Ikat Bandha Silk
INSERT INTO products (id, name, category, price, original_price, image, description, fabric, weave, color, rating, reviews, badge, created_date, modified_date)
VALUES (16, 'Barpali Double Ikat Bandha Silk', 'Sambalpuri', 38999, 48999, '/images/saree_front_11.png', 'Mathematical perfection in silk by national award-winning weavers of Barpali, featuring double-ikat warp and weft alignment with sacred conch shell motifs.', 'Pure Mulberry Silk', 'Double Ikat Bandha', 'Midnight Indigo & Crimson', 5.0, 68, 'Masterpiece', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO product_images (product_id, image_url) VALUES (16, '/images/saree_front_11.png');
INSERT INTO product_images (product_id, image_url) VALUES (16, '/images/saree_master_pallu.png');
INSERT INTO product_images (product_id, image_url) VALUES (16, '/images/saree_master_border.png');
INSERT INTO product_images (product_id, image_url) VALUES (16, '/images/saree_master_side.png');

-- 17. Gopalpur GI Tussar Handloom
INSERT INTO products (id, name, category, price, original_price, image, description, fabric, weave, color, rating, reviews, badge, created_date, modified_date)
VALUES (17, 'Gopalpur GI Tussar Handloom', 'Tussar Odia', 22999, 29999, '/images/saree_front_12.png', 'Celebrated GI-registered handloom from Gopalpur, Jajpur district, woven from wild Ghicha Tussar silk with rich natural slub texture and tribal motifs.', 'Ghicha Tussar Silk', 'Handloom Ribbed Weave', 'Champagne Gold & Cocoa', 4.8, 114, 'GI Certified', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO product_images (product_id, image_url) VALUES (17, '/images/saree_front_12.png');
INSERT INTO product_images (product_id, image_url) VALUES (17, '/images/saree_master_pallu.png');
INSERT INTO product_images (product_id, image_url) VALUES (17, '/images/saree_master_border.png');
INSERT INTO product_images (product_id, image_url) VALUES (17, '/images/saree_master_side.png');

-- 18. Nuapatna Khandua Malabati Bridal Pata
INSERT INTO products (id, name, category, price, original_price, image, description, fabric, weave, color, rating, reviews, badge, created_date, modified_date)
VALUES (18, 'Nuapatna Khandua Malabati Bridal Pata', 'Khandua', 41999, 52999, '/images/saree_blush_pink.png', 'Grand bridal Khandua Pata woven with the signature Malabati border and auspicious floral bandha motifs, consecrated for sacred wedding ceremonies.', 'Pure Mulberry Silk', 'Nuapatna Bridal Ikat', 'Blush Rose & Rich Gold', 5.0, 97, 'Bridal Heritage', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO product_images (product_id, image_url) VALUES (18, '/images/saree_blush_pink.png');
INSERT INTO product_images (product_id, image_url) VALUES (18, '/images/saree_master_pallu.png');
INSERT INTO product_images (product_id, image_url) VALUES (18, '/images/saree_master_border.png');
INSERT INTO product_images (product_id, image_url) VALUES (18, '/images/saree_master_side.png');
