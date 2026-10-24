TRUNCATE TABLE product_images, recent_views CASCADE;
TRUNCATE TABLE products RESTART IDENTITY CASCADE;

INSERT INTO products (id, name, category, price, original_price, image, description, fabric, weave, color, rating, reviews, badge, created_date, modified_date)
VALUES (1, 'Royal Banarasi Silk', 'Banarasi', 24999, 32999, '/images/saree_purple_gold.png', 'Handwoven in Varanasi with pure gold zari work, this regal Banarasi silk saree features intricate mughal-inspired motifs.', 'Pure Silk', 'Handloom', 'Purple & Gold', 4.9, 128, 'Bestseller', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO product_images (product_id, image_url) VALUES (1, '/images/saree_purple_gold.png');
INSERT INTO product_images (product_id, image_url) VALUES (1, '/images/saree_master_border.png');
INSERT INTO product_images (product_id, image_url) VALUES (1, '/images/saree_master_pallu.png');
INSERT INTO product_images (product_id, image_url) VALUES (1, '/images/saree_master_side.png');
INSERT INTO product_images (product_id, image_url) VALUES (1, '/images/saree_master_back.png');

INSERT INTO products (id, name, category, price, original_price, image, description, fabric, weave, color, rating, reviews, badge, created_date, modified_date)
VALUES (2, 'Kanjeevaram Temple Border', 'Kanjeevaram', 34999, 44999, '/images/saree_crimson_red.png', 'A magnificent Kanjeevaram from the looms of Kanchipuram, featuring traditional temple border and rich contrast pallu.', 'Mulberry Silk', 'Handloom', 'Crimson Red', 5, 89, 'Premium', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO product_images (product_id, image_url) VALUES (2, '/images/saree_crimson_red.png');
INSERT INTO product_images (product_id, image_url) VALUES (2, '/images/saree_master_side.png');
INSERT INTO product_images (product_id, image_url) VALUES (2, '/images/saree_master_border.png');
INSERT INTO product_images (product_id, image_url) VALUES (2, '/images/saree_master_back.png');
INSERT INTO product_images (product_id, image_url) VALUES (2, '/images/saree_master_pallu.png');

INSERT INTO products (id, name, category, price, original_price, image, description, fabric, weave, color, rating, reviews, badge, created_date, modified_date)
VALUES (3, 'Chanderi Emerald Dream', 'Chanderi', 12999, 17999, '/images/saree_emerald_green.png', 'Lightweight Chanderi silk with delicate silver zari floral motifs, perfect for elegant occasions and festive celebrations.', 'Chanderi Silk', 'Handloom', 'Emerald Green', 4.7, 156, 'New Arrival', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO product_images (product_id, image_url) VALUES (3, '/images/saree_emerald_green.png');
INSERT INTO product_images (product_id, image_url) VALUES (3, '/images/saree_master_pallu.png');
INSERT INTO product_images (product_id, image_url) VALUES (3, '/images/saree_master_back.png');
INSERT INTO product_images (product_id, image_url) VALUES (3, '/images/saree_master_side.png');
INSERT INTO product_images (product_id, image_url) VALUES (3, '/images/saree_master_border.png');

INSERT INTO products (id, name, category, price, original_price, image, description, fabric, weave, color, rating, reviews, badge, created_date, modified_date)
VALUES (4, 'Tussar Royal Indigo', 'Tussar', 18999, 24999, '/images/saree_navy_blue.png', 'Luxurious Tussar silk with traditional paisley motifs handwoven by master artisans of Bhagalpur.', 'Tussar Silk', 'Handloom', 'Navy Blue', 4.8, 94, 'Trending', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO product_images (product_id, image_url) VALUES (4, '/images/saree_navy_blue.png');
INSERT INTO product_images (product_id, image_url) VALUES (4, '/images/saree_master_border.png');
INSERT INTO product_images (product_id, image_url) VALUES (4, '/images/saree_master_side.png');
INSERT INTO product_images (product_id, image_url) VALUES (4, '/images/saree_master_pallu.png');
INSERT INTO product_images (product_id, image_url) VALUES (4, '/images/saree_master_back.png');

INSERT INTO products (id, name, category, price, original_price, image, description, fabric, weave, color, rating, reviews, badge, created_date, modified_date)
VALUES (5, 'Patola Heritage Weave', 'Patola', 89999, 119999, '/images/saree_saffron_orange.png', 'An heirloom double-ikat Patola saree from Patan, Gujarat — each piece takes 6-8 months to weave with geometric precision.', 'Pure Silk', 'Double Ikat', 'Saffron Orange', 5, 42, 'Heirloom', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO product_images (product_id, image_url) VALUES (5, '/images/saree_saffron_orange.png');
INSERT INTO product_images (product_id, image_url) VALUES (5, '/images/saree_master_border.png');
INSERT INTO product_images (product_id, image_url) VALUES (5, '/images/saree_master_back.png');
INSERT INTO product_images (product_id, image_url) VALUES (5, '/images/saree_master_side.png');
INSERT INTO product_images (product_id, image_url) VALUES (5, '/images/saree_master_pallu.png');

INSERT INTO products (id, name, category, price, original_price, image, description, fabric, weave, color, rating, reviews, badge, created_date, modified_date)
VALUES (6, 'Mysore Silk Rosé', 'Mysore', 15999, 21999, '/images/saree_blush_pink.png', 'Graceful Mysore crepe silk in blush pink with rose gold border, embodying South Indian elegance.', 'Mysore Crepe Silk', 'Handloom', 'Blush Pink', 4.6, 203, 'Popular', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO product_images (product_id, image_url) VALUES (6, '/images/saree_blush_pink.png');
INSERT INTO product_images (product_id, image_url) VALUES (6, '/images/saree_master_side.png');
INSERT INTO product_images (product_id, image_url) VALUES (6, '/images/saree_master_border.png');
INSERT INTO product_images (product_id, image_url) VALUES (6, '/images/saree_master_back.png');
INSERT INTO product_images (product_id, image_url) VALUES (6, '/images/saree_master_pallu.png');

INSERT INTO products (id, name, category, price, original_price, image, description, fabric, weave, color, rating, reviews, badge, created_date, modified_date)
VALUES (7, 'Paithani Peacock Motif', 'Paithani', 45999, 55999, '/images/saree_front_1.png', 'Authentic Paithani from Maharashtra with rich zari borders and traditional peacock motifs on the pallu.', 'Pure Silk', 'Handloom', 'Peacock Blue', 4.9, 67, 'Exclusive', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO product_images (product_id, image_url) VALUES (7, '/images/saree_front_1.png');
INSERT INTO product_images (product_id, image_url) VALUES (7, '/images/saree_master_border.png');
INSERT INTO product_images (product_id, image_url) VALUES (7, '/images/saree_master_pallu.png');
INSERT INTO product_images (product_id, image_url) VALUES (7, '/images/saree_master_back.png');
INSERT INTO product_images (product_id, image_url) VALUES (7, '/images/saree_master_side.png');

INSERT INTO products (id, name, category, price, original_price, image, description, fabric, weave, color, rating, reviews, badge, created_date, modified_date)
VALUES (8, 'Bandhani Silk Elegance', 'Bandhani', 14999, 19999, '/images/saree_front_2.png', 'Exquisite hand-tied Bandhani patterns on pure silk, crafted by artisans in Gujarat.', 'Pure Silk', 'Tie & Dye', 'Ruby Red', 4.8, 112, '', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO product_images (product_id, image_url) VALUES (8, '/images/saree_front_2.png');
INSERT INTO product_images (product_id, image_url) VALUES (8, '/images/saree_master_side.png');
INSERT INTO product_images (product_id, image_url) VALUES (8, '/images/saree_master_pallu.png');
INSERT INTO product_images (product_id, image_url) VALUES (8, '/images/saree_master_border.png');
INSERT INTO product_images (product_id, image_url) VALUES (8, '/images/saree_master_back.png');

INSERT INTO products (id, name, category, price, original_price, image, description, fabric, weave, color, rating, reviews, badge, created_date, modified_date)
VALUES (9, 'Jamdani Floral Symphony', 'Jamdani', 11999, 15999, '/images/saree_front_3.png', 'Feather-light cotton Jamdani with intricate floral motifs woven directly into the fabric.', 'Cotton Silk', 'Handloom', 'Ivory & Silver', 4.7, 88, 'Summer Pick', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO product_images (product_id, image_url) VALUES (9, '/images/saree_front_3.png');
INSERT INTO product_images (product_id, image_url) VALUES (9, '/images/saree_master_back.png');
INSERT INTO product_images (product_id, image_url) VALUES (9, '/images/saree_master_side.png');
INSERT INTO product_images (product_id, image_url) VALUES (9, '/images/saree_master_pallu.png');
INSERT INTO product_images (product_id, image_url) VALUES (9, '/images/saree_master_border.png');

INSERT INTO products (id, name, category, price, original_price, image, description, fabric, weave, color, rating, reviews, badge, created_date, modified_date)
VALUES (10, 'Pochampally Ikat Charm', 'Ikat', 17999, 22999, '/images/saree_front_4.png', 'Vibrant Pochampally Ikat with mesmerizing geometric patterns, handwoven in Telangana.', 'Mercerized Cotton', 'Ikat', 'Mustard Yellow', 4.6, 54, '', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO product_images (product_id, image_url) VALUES (10, '/images/saree_front_4.png');
INSERT INTO product_images (product_id, image_url) VALUES (10, '/images/saree_master_border.png');
INSERT INTO product_images (product_id, image_url) VALUES (10, '/images/saree_master_back.png');
INSERT INTO product_images (product_id, image_url) VALUES (10, '/images/saree_master_side.png');
INSERT INTO product_images (product_id, image_url) VALUES (10, '/images/saree_master_pallu.png');

INSERT INTO products (id, name, category, price, original_price, image, description, fabric, weave, color, rating, reviews, badge, created_date, modified_date)
VALUES (11, 'Baluchari Mythological Tales', 'Baluchari', 22999, 28999, '/images/saree_front_5.png', 'Classic Baluchari saree from Bengal featuring intricate woven scenes from Indian epics.', 'Bishnupuri Silk', 'Handloom', 'Deep Maroon', 4.9, 41, 'Heritage', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO product_images (product_id, image_url) VALUES (11, '/images/saree_front_5.png');
INSERT INTO product_images (product_id, image_url) VALUES (11, '/images/saree_master_side.png');
INSERT INTO product_images (product_id, image_url) VALUES (11, '/images/saree_master_pallu.png');
INSERT INTO product_images (product_id, image_url) VALUES (11, '/images/saree_master_border.png');
INSERT INTO product_images (product_id, image_url) VALUES (11, '/images/saree_master_back.png');

INSERT INTO products (id, name, category, price, original_price, image, description, fabric, weave, color, rating, reviews, badge, created_date, modified_date)
VALUES (12, 'Bomkai Golden Temple', 'Bomkai', 19999, 25999, '/images/saree_front_6.png', 'Traditional Bomkai silk from Odisha with exquisite thread work and temple borders.', 'Pure Silk', 'Handloom', 'Golden Yellow', 4.8, 76, '', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO product_images (product_id, image_url) VALUES (12, '/images/saree_front_6.png');
INSERT INTO product_images (product_id, image_url) VALUES (12, '/images/saree_master_pallu.png');
INSERT INTO product_images (product_id, image_url) VALUES (12, '/images/saree_master_border.png');
INSERT INTO product_images (product_id, image_url) VALUES (12, '/images/saree_master_back.png');
INSERT INTO product_images (product_id, image_url) VALUES (12, '/images/saree_master_side.png');

INSERT INTO products (id, name, category, price, original_price, image, description, fabric, weave, color, rating, reviews, badge, created_date, modified_date)
VALUES (13, 'Kota Doria Pastel Breeze', 'Kota Doria', 8999, 12999, '/images/saree_front_7.png', 'Ultra-lightweight Kota Doria with delicate zari checks, perfect for warm weather grace.', 'Cotton Silk Blend', 'Handloom', 'Pastel Blue', 4.5, 132, 'Lightweight', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO product_images (product_id, image_url) VALUES (13, '/images/saree_front_7.png');
INSERT INTO product_images (product_id, image_url) VALUES (13, '/images/saree_master_border.png');
INSERT INTO product_images (product_id, image_url) VALUES (13, '/images/saree_master_side.png');
INSERT INTO product_images (product_id, image_url) VALUES (13, '/images/saree_master_back.png');
INSERT INTO product_images (product_id, image_url) VALUES (13, '/images/saree_master_pallu.png');

INSERT INTO products (id, name, category, price, original_price, image, description, fabric, weave, color, rating, reviews, badge, created_date, modified_date)
VALUES (14, 'Maheshwari Regal Border', 'Maheshwari', 13999, 18999, '/images/saree_front_8.png', 'Elegant Maheshwari saree featuring reversible borders and a distinctive striped pallu.', 'Silk Cotton Blend', 'Handloom', 'Forest Green', 4.7, 95, 'Workwear', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO product_images (product_id, image_url) VALUES (14, '/images/saree_front_8.png');
INSERT INTO product_images (product_id, image_url) VALUES (14, '/images/saree_master_back.png');
INSERT INTO product_images (product_id, image_url) VALUES (14, '/images/saree_master_pallu.png');
INSERT INTO product_images (product_id, image_url) VALUES (14, '/images/saree_master_side.png');
INSERT INTO product_images (product_id, image_url) VALUES (14, '/images/saree_master_border.png');

INSERT INTO products (id, name, category, price, original_price, image, description, fabric, weave, color, rating, reviews, badge, created_date, modified_date)
VALUES (15, 'Phulkari Floral Heritage', 'Phulkari', 16999, 21999, '/images/saree_front_9.png', 'Vibrant Phulkari embroidery on pure georgette, showcasing the rich textile heritage of Punjab.', 'Georgette', 'Hand Embroidered', 'Vibrant Magenta', 4.8, 62, 'Festive', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO product_images (product_id, image_url) VALUES (15, '/images/saree_front_9.png');
INSERT INTO product_images (product_id, image_url) VALUES (15, '/images/saree_master_border.png');
INSERT INTO product_images (product_id, image_url) VALUES (15, '/images/saree_master_pallu.png');
INSERT INTO product_images (product_id, image_url) VALUES (15, '/images/saree_master_back.png');
INSERT INTO product_images (product_id, image_url) VALUES (15, '/images/saree_master_side.png');

INSERT INTO products (id, name, category, price, original_price, image, description, fabric, weave, color, rating, reviews, badge, created_date, modified_date)
VALUES (16, 'Chikankari Pearl Drop', 'Chikankari', 21999, 27999, '/images/saree_front_10.png', 'Ethereal Chikankari embroidery from Lucknow with delicate pearl embellishments on soft chiffon.', 'Chiffon', 'Hand Embroidered', 'Pearl White', 4.9, 118, 'Wedding', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO product_images (product_id, image_url) VALUES (16, '/images/saree_front_10.png');
INSERT INTO product_images (product_id, image_url) VALUES (16, '/images/saree_master_border.png');
INSERT INTO product_images (product_id, image_url) VALUES (16, '/images/saree_master_pallu.png');
INSERT INTO product_images (product_id, image_url) VALUES (16, '/images/saree_master_back.png');
INSERT INTO product_images (product_id, image_url) VALUES (16, '/images/saree_master_side.png');

INSERT INTO products (id, name, category, price, original_price, image, description, fabric, weave, color, rating, reviews, badge, created_date, modified_date)
VALUES (17, 'Gadwal Contrast Grace', 'Gadwal', 28999, 35999, '/images/saree_front_11.png', 'Authentic Gadwal saree featuring a cotton body with pure silk borders attached via the Kuttu technique.', 'Cotton with Silk Border', 'Handloom', 'Charcoal & Pink', 5, 45, 'Premium', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO product_images (product_id, image_url) VALUES (17, '/images/saree_front_11.png');
INSERT INTO product_images (product_id, image_url) VALUES (17, '/images/saree_master_side.png');
INSERT INTO product_images (product_id, image_url) VALUES (17, '/images/saree_master_back.png');
INSERT INTO product_images (product_id, image_url) VALUES (17, '/images/saree_master_pallu.png');
INSERT INTO product_images (product_id, image_url) VALUES (17, '/images/saree_master_border.png');

INSERT INTO products (id, name, category, price, original_price, image, description, fabric, weave, color, rating, reviews, badge, created_date, modified_date)
VALUES (18, 'Kasavu Golden Elegance', 'Kasavu', 9999, 13999, '/images/saree_front_12.png', 'Traditional Kerala Kasavu saree in pure cotton with a wide pure gold zari border.', 'Pure Cotton', 'Handloom', 'Off-White & Gold', 4.8, 185, 'Classic', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO product_images (product_id, image_url) VALUES (18, '/images/saree_front_12.png');
INSERT INTO product_images (product_id, image_url) VALUES (18, '/images/saree_master_border.png');
INSERT INTO product_images (product_id, image_url) VALUES (18, '/images/saree_master_pallu.png');
INSERT INTO product_images (product_id, image_url) VALUES (18, '/images/saree_master_back.png');
INSERT INTO product_images (product_id, image_url) VALUES (18, '/images/saree_master_side.png');

-- Reset sequence for PostgreSQL if needed (ignores errors on H2)
-- ALTER SEQUENCE products_id_seq RESTART WITH 19;


