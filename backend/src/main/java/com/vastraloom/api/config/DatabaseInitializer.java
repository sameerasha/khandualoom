package com.vastraloom.api.config;

import com.vastraloom.api.model.AppConfig;
import com.vastraloom.api.model.Product;
import com.vastraloom.api.model.User;
import com.vastraloom.api.repository.AppConfigRepository;
import com.vastraloom.api.repository.ProductRepository;
import com.vastraloom.api.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
@Slf4j
@SuppressWarnings("null")
public class DatabaseInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final AppConfigRepository appConfigRepository;
    private final PasswordEncoder passwordEncoder;
    private final JdbcTemplate jdbcTemplate;

    public DatabaseInitializer(
            UserRepository userRepository,
            ProductRepository productRepository,
            AppConfigRepository appConfigRepository,
            PasswordEncoder passwordEncoder,
            JdbcTemplate jdbcTemplate) {
        this.userRepository = userRepository;
        this.productRepository = productRepository;
        this.appConfigRepository = appConfigRepository;
        this.passwordEncoder = passwordEncoder;
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public void run(String... args) throws Exception {
        try {
            jdbcTemplate.execute("ALTER TABLE recent_views DROP COLUMN IF EXISTS session_id");
            log.info("Dropped session_id column from recent_views if it existed.");
        } catch (Exception e) {
            log.warn("Could not drop session_id column: {}", e.getMessage());
        }
        
        initializeConfigs();
        initializeAdminUser();
        initializeProducts();
    }

    private void initializeConfigs() {
        if (!appConfigRepository.existsById("OTP_VALIDITY_MINUTES")) {
            appConfigRepository.save(new AppConfig("OTP_VALIDITY_MINUTES", "2"));
        }
        if (!appConfigRepository.existsById("OTP_MAX_ATTEMPTS")) {
            appConfigRepository.save(new AppConfig("OTP_MAX_ATTEMPTS", "5"));
        }
    }

    private void initializeAdminUser() {
        if (userRepository.findByEmail("admin@vastraloom.com").isEmpty()) {
            User admin = User.builder()
                    .firstName("Super")
                    .lastName("Admin")
                    .email("admin@vastraloom.com")
                    .password(passwordEncoder.encode("admin123"))
                    .phone("9999999999")
                    .role("ROLE_ADMIN")
                    .emailVerified(true)
                    .phoneVerified(true)
                    .build();
            userRepository.save(admin);
            log.info("Admin user initialized successfully with email: admin@vastraloom.com / password: admin123");
        }
    }

    private void initializeProducts() {
        if (productRepository.count() < 15) {
            List<Product> defaultProducts = new ArrayList<>();

            // Base 6 products
            Product p1 = new Product();
            p1.setName("Royal Banarasi Silk"); p1.setCategory("Banarasi"); p1.setPrice(24999); p1.setOriginalPrice(32999);
            p1.setImage("/images/saree_purple_gold.png"); p1.setDescription("Handwoven in Varanasi with pure gold zari work, this regal Banarasi silk saree features intricate mughal-inspired motifs.");
            p1.setFabric("Pure Silk"); p1.setWeave("Handloom"); p1.setColor("Royal Purple & Gold"); p1.setRating(4.9); p1.setReviews(128); p1.setBadge("Bestseller");
            p1.setImages(List.of("/images/saree_purple_gold.png", "/images/saree_navy_blue.png", "/images/saree_blush_pink.png"));

            Product p2 = new Product();
            p2.setName("Kanjeevaram Temple Border"); p2.setCategory("Kanjeevaram"); p2.setPrice(34999); p2.setOriginalPrice(44999);
            p2.setImage("/images/saree_crimson_red.png"); p2.setDescription("A magnificent Kanjeevaram from the looms of Kanchipuram, featuring traditional temple border and rich contrast pallu.");
            p2.setFabric("Pure Mulberry Silk"); p2.setWeave("Handloom"); p2.setColor("Crimson Red & Gold"); p2.setRating(5.0); p2.setReviews(89); p2.setBadge("Premium");
            p2.setImages(List.of("/images/saree_crimson_red.png", "/images/saree_saffron_orange.png", "/images/saree_purple_gold.png"));

            Product p3 = new Product();
            p3.setName("Chanderi Emerald Dream"); p3.setCategory("Chanderi"); p3.setPrice(12999); p3.setOriginalPrice(17999);
            p3.setImage("/images/saree_emerald_green.png"); p3.setDescription("Lightweight Chanderi silk with delicate silver zari floral motifs, perfect for elegant occasions and festive celebrations.");
            p3.setFabric("Chanderi Silk"); p3.setWeave("Handloom"); p3.setColor("Emerald Green & Silver"); p3.setRating(4.7); p3.setReviews(156); p3.setBadge("New Arrival");
            p3.setImages(List.of("/images/saree_emerald_green.png", "/images/saree_navy_blue.png", "/images/saree_blush_pink.png"));

            Product p4 = new Product();
            p4.setName("Tussar Royal Indigo"); p4.setCategory("Tussar"); p4.setPrice(18999); p4.setOriginalPrice(24999);
            p4.setImage("/images/saree_navy_blue.png"); p4.setDescription("Luxurious Tussar silk with traditional paisley motifs handwoven by master artisans of Bhagalpur.");
            p4.setFabric("Tussar Silk"); p4.setWeave("Handloom"); p4.setColor("Navy Blue & Gold"); p4.setRating(4.8); p4.setReviews(94); p4.setBadge("Trending");
            p4.setImages(List.of("/images/saree_navy_blue.png", "/images/saree_purple_gold.png", "/images/saree_emerald_green.png"));

            Product p5 = new Product();
            p5.setName("Patola Heritage Weave"); p5.setCategory("Patola"); p5.setPrice(89999); p5.setOriginalPrice(119999);
            p5.setImage("/images/saree_saffron_orange.png"); p5.setDescription("An heirloom double-ikat Patola saree from Patan, Gujarat — each piece takes 6-8 months to weave with geometric precision.");
            p5.setFabric("Pure Silk"); p5.setWeave("Double Ikat Handloom"); p5.setColor("Saffron Orange"); p5.setRating(5.0); p5.setReviews(42); p5.setBadge("Heirloom");
            p5.setImages(List.of("/images/saree_saffron_orange.png", "/images/saree_crimson_red.png", "/images/saree_blush_pink.png"));

            Product p6 = new Product();
            p6.setName("Mysore Silk Rosé"); p6.setCategory("Mysore"); p6.setPrice(15999); p6.setOriginalPrice(21999);
            p6.setImage("/images/saree_blush_pink.png"); p6.setDescription("Graceful Mysore crepe silk in blush pink with rose gold border, embodying South Indian elegance.");
            p6.setFabric("Mysore Crepe Silk"); p6.setWeave("Handloom"); p6.setColor("Blush Pink & Rose Gold"); p6.setRating(4.6); p6.setReviews(203); p6.setBadge("Popular");
            p6.setImages(List.of("/images/saree_blush_pink.png", "/images/saree_purple_gold.png", "/images/saree_emerald_green.png"));

            List<Product> templates = List.of(p1, p2, p3, p4, p5, p6);

            for (int i = 0; i < 3; i++) {
                for (Product template : templates) {
                    Product p = new Product();
                    p.setName(template.getName() + (i == 0 ? "" : " (Edition " + (i + 1) + ")"));
                    p.setCategory(template.getCategory());
                    p.setPrice(template.getPrice());
                    p.setOriginalPrice(template.getOriginalPrice());
                    p.setImage(template.getImage());
                    p.setDescription(template.getDescription());
                    p.setFabric(template.getFabric());
                    p.setWeave(template.getWeave());
                    p.setColor(template.getColor());
                    p.setRating(template.getRating());
                    p.setReviews(template.getReviews());
                    p.setBadge(template.getBadge());
                    p.setImages(new ArrayList<>(template.getImages()));
                    defaultProducts.add(p);
                }
            }

            productRepository.saveAll(defaultProducts);
            log.info("Default product catalog seeded successfully with {} products.", defaultProducts.size());
        }
    }
}
