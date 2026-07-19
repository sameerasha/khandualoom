const fs = require('fs');

const adminHash = '$2a$10$w0X3nFjSgYtJ8L/jE.rMDeu5G0zK1CqBkVrR0Z5hV6LgGvJ/mD8kS';

let sql = `
INSERT INTO app_config (config_key, config_value) VALUES ('OTP_VALIDITY_MINUTES', '2');
INSERT INTO app_config (config_key, config_value) VALUES ('OTP_MAX_ATTEMPTS', '5');

INSERT INTO users (first_name, last_name, email, password, phone, role, email_verified, phone_verified, provider, created_date, modified_date) 
VALUES ('Super', 'Admin', 'admin@vastraloom.com', '${adminHash}', '9999999999', 'ROLE_ADMIN', true, true, 'local', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
`;

const sideImagesPool = [
    "/images/saree_master_side.png",
    "/images/saree_master_back.png",
    "/images/saree_master_pallu.png",
    "/images/saree_master_border.png"
];

function shuffle(array) {
    let currentIndex = array.length,  randomIndex;
    while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
}

const products = [
    {
        name: "Royal Banarasi Silk", category: "Banarasi", price: 24999, originalPrice: 32999,
        image: "/images/saree_purple_gold.png", description: "Handwoven in Varanasi with pure gold zari work, this regal Banarasi silk saree features intricate mughal-inspired motifs.",
        fabric: "Pure Silk", weave: "Handloom", color: "Purple & Gold", rating: 4.9, reviews: 128, badge: "Bestseller"
    },
    {
        name: "Kanjeevaram Temple Border", category: "Kanjeevaram", price: 34999, originalPrice: 44999,
        image: "/images/saree_crimson_red.png", description: "A magnificent Kanjeevaram from the looms of Kanchipuram, featuring traditional temple border and rich contrast pallu.",
        fabric: "Mulberry Silk", weave: "Handloom", color: "Crimson Red", rating: 5.0, reviews: 89, badge: "Premium"
    },
    {
        name: "Chanderi Emerald Dream", category: "Chanderi", price: 12999, originalPrice: 17999,
        image: "/images/saree_emerald_green.png", description: "Lightweight Chanderi silk with delicate silver zari floral motifs, perfect for elegant occasions and festive celebrations.",
        fabric: "Chanderi Silk", weave: "Handloom", color: "Emerald Green", rating: 4.7, reviews: 156, badge: "New Arrival"
    },
    {
        name: "Tussar Royal Indigo", category: "Tussar", price: 18999, originalPrice: 24999,
        image: "/images/saree_navy_blue.png", description: "Luxurious Tussar silk with traditional paisley motifs handwoven by master artisans of Bhagalpur.",
        fabric: "Tussar Silk", weave: "Handloom", color: "Navy Blue", rating: 4.8, reviews: 94, badge: "Trending"
    },
    {
        name: "Patola Heritage Weave", category: "Patola", price: 89999, originalPrice: 119999,
        image: "/images/saree_saffron_orange.png", description: "An heirloom double-ikat Patola saree from Patan, Gujarat — each piece takes 6-8 months to weave with geometric precision.",
        fabric: "Pure Silk", weave: "Double Ikat", color: "Saffron Orange", rating: 5.0, reviews: 42, badge: "Heirloom"
    },
    {
        name: "Mysore Silk Rosé", category: "Mysore", price: 15999, originalPrice: 21999,
        image: "/images/saree_blush_pink.png", description: "Graceful Mysore crepe silk in blush pink with rose gold border, embodying South Indian elegance.",
        fabric: "Mysore Crepe Silk", weave: "Handloom", color: "Blush Pink", rating: 4.6, reviews: 203, badge: "Popular"
    },
    {
        name: "Paithani Peacock Motif", category: "Paithani", price: 45999, originalPrice: 55999,
        image: "/images/saree_front_1.png", description: "Authentic Paithani from Maharashtra with rich zari borders and traditional peacock motifs on the pallu.",
        fabric: "Pure Silk", weave: "Handloom", color: "Peacock Blue", rating: 4.9, reviews: 67, badge: "Exclusive"
    },
    {
        name: "Bandhani Silk Elegance", category: "Bandhani", price: 14999, originalPrice: 19999,
        image: "/images/saree_front_2.png", description: "Exquisite hand-tied Bandhani patterns on pure silk, crafted by artisans in Gujarat.",
        fabric: "Pure Silk", weave: "Tie & Dye", color: "Ruby Red", rating: 4.8, reviews: 112, badge: ""
    },
    {
        name: "Jamdani Floral Symphony", category: "Jamdani", price: 11999, originalPrice: 15999,
        image: "/images/saree_front_3.png", description: "Feather-light cotton Jamdani with intricate floral motifs woven directly into the fabric.",
        fabric: "Cotton Silk", weave: "Handloom", color: "Ivory & Silver", rating: 4.7, reviews: 88, badge: "Summer Pick"
    },
    {
        name: "Pochampally Ikat Charm", category: "Ikat", price: 17999, originalPrice: 22999,
        image: "/images/saree_front_4.png", description: "Vibrant Pochampally Ikat with mesmerizing geometric patterns, handwoven in Telangana.",
        fabric: "Mercerized Cotton", weave: "Ikat", color: "Mustard Yellow", rating: 4.6, reviews: 54, badge: ""
    },
    {
        name: "Baluchari Mythological Tales", category: "Baluchari", price: 22999, originalPrice: 28999,
        image: "/images/saree_front_5.png", description: "Classic Baluchari saree from Bengal featuring intricate woven scenes from Indian epics.",
        fabric: "Bishnupuri Silk", weave: "Handloom", color: "Deep Maroon", rating: 4.9, reviews: 41, badge: "Heritage"
    },
    {
        name: "Bomkai Golden Temple", category: "Bomkai", price: 19999, originalPrice: 25999,
        image: "/images/saree_front_6.png", description: "Traditional Bomkai silk from Odisha with exquisite thread work and temple borders.",
        fabric: "Pure Silk", weave: "Handloom", color: "Golden Yellow", rating: 4.8, reviews: 76, badge: ""
    },
    {
        name: "Kota Doria Pastel Breeze", category: "Kota Doria", price: 8999, originalPrice: 12999,
        image: "/images/saree_front_7.png", description: "Ultra-lightweight Kota Doria with delicate zari checks, perfect for warm weather grace.",
        fabric: "Cotton Silk Blend", weave: "Handloom", color: "Pastel Blue", rating: 4.5, reviews: 132, badge: "Lightweight"
    },
    {
        name: "Maheshwari Regal Border", category: "Maheshwari", price: 13999, originalPrice: 18999,
        image: "/images/saree_front_8.png", description: "Elegant Maheshwari saree featuring reversible borders and a distinctive striped pallu.",
        fabric: "Silk Cotton Blend", weave: "Handloom", color: "Forest Green", rating: 4.7, reviews: 95, badge: "Workwear"
    },
    {
        name: "Phulkari Floral Heritage", category: "Phulkari", price: 16999, originalPrice: 21999,
        image: "/images/saree_front_9.png", description: "Vibrant Phulkari embroidery on pure georgette, showcasing the rich textile heritage of Punjab.",
        fabric: "Georgette", weave: "Hand Embroidered", color: "Vibrant Magenta", rating: 4.8, reviews: 62, badge: "Festive"
    },
    {
        name: "Chikankari Pearl Drop", category: "Chikankari", price: 21999, originalPrice: 27999,
        image: "/images/saree_front_10.png", description: "Ethereal Chikankari embroidery from Lucknow with delicate pearl embellishments on soft chiffon.",
        fabric: "Chiffon", weave: "Hand Embroidered", color: "Pearl White", rating: 4.9, reviews: 118, badge: "Wedding"
    },
    {
        name: "Gadwal Contrast Grace", category: "Gadwal", price: 28999, originalPrice: 35999,
        image: "/images/saree_front_11.png", description: "Authentic Gadwal saree featuring a cotton body with pure silk borders attached via the Kuttu technique.",
        fabric: "Cotton with Silk Border", weave: "Handloom", color: "Charcoal & Pink", rating: 5.0, reviews: 45, badge: "Premium"
    },
    {
        name: "Kasavu Golden Elegance", category: "Kasavu", price: 9999, originalPrice: 13999,
        image: "/images/saree_front_12.png", description: "Traditional Kerala Kasavu saree in pure cotton with a wide pure gold zari border.",
        fabric: "Pure Cotton", weave: "Handloom", color: "Off-White & Gold", rating: 4.8, reviews: 185, badge: "Classic"
    }
];

let productId = 1;
for (const p of products) {
    sql += `
INSERT INTO products (id, name, category, price, original_price, image, description, fabric, weave, color, rating, reviews, badge, created_date, modified_date)
VALUES (${productId}, '${p.name}', '${p.category}', ${p.price}, ${p.originalPrice}, '${p.image}', '${p.description.replace(/'/g, "''")}', '${p.fabric}', '${p.weave}', '${p.color}', ${p.rating}, ${p.reviews}, '${p.badge}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
`;
    // Insert primary image
    sql += `INSERT INTO product_images (product_id, image_url) VALUES (${productId}, '${p.image}');\n`;
    
    // Shuffle and insert side images
    const shuffledSides = shuffle([...sideImagesPool]);
    for (const img of shuffledSides) {
        sql += `INSERT INTO product_images (product_id, image_url) VALUES (${productId}, '${img}');\n`;
    }
    
    productId++;
}

// Ensure the sequence is correctly updated in PostgreSQL
sql += `
-- Reset sequence for PostgreSQL if needed (ignores errors on H2)
-- ALTER SEQUENCE products_id_seq RESTART WITH 19;
`;

fs.writeFileSync('src/main/resources/db/migration/V2__init_data.sql', sql.trim());
console.log('Generated V2__init_data.sql with 18 unique products and shuffled side images!');
