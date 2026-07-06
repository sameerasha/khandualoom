package com.vastraloom.api.config;

import com.vastraloom.api.model.Product;
import com.vastraloom.api.model.User;
import com.vastraloom.api.repository.ProductRepository;
import com.vastraloom.api.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class DatabaseInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final PasswordEncoder passwordEncoder;

    public DatabaseInitializer(
            UserRepository userRepository,
            ProductRepository productRepository,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.productRepository = productRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        initializeAdminUser();
        initializeProducts();
    }

    private void initializeAdminUser() {
        if (userRepository.findByUsername("admin").isEmpty()) {
            User admin = User.builder()
                    .username("admin")
                    .email("admin@vastraloom.com")
                    .password(passwordEncoder.encode("admin123"))
                    .role("ROLE_ADMIN")
                    .build();
            userRepository.save(admin);
            System.out.println("Admin user initialized successfully with username: admin / password: admin123");
        }
    }

    private void initializeProducts() {
        if (productRepository.count() == 0) {
            List<Product> defaultProducts = new ArrayList<>();

            // 1. Royal Banarasi Silk
            Product p1 = new Product();
            p1.setName("Royal Banarasi Silk");
            p1.setCategory("Banarasi");
            p1.setPrice(24999);
            p1.setOriginalPrice(32999);
            p1.setImage("/images/saree_purple_gold.png");
            p1.setDescription("Handwoven in Varanasi with pure gold zari work, this regal Banarasi silk saree features intricate mughal-inspired motifs.");
            p1.setFabric("Pure Silk");
            p1.setWeave("Handloom");
            p1.setColor("Royal Purple & Gold");
            p1.setRating(4.9);
            p1.setReviews(128);
            p1.setBadge("Bestseller");
            defaultProducts.add(p1);

            // 2. Kanjeevaram Temple Border
            Product p2 = new Product();
            p2.setName("Kanjeevaram Temple Border");
            p2.setCategory("Kanjeevaram");
            p2.setPrice(34999);
            p2.setOriginalPrice(44999);
            p2.setImage("/images/saree_crimson_red.png");
            p2.setDescription("A magnificent Kanjeevaram from the looms of Kanchipuram, featuring traditional temple border and rich contrast pallu.");
            p2.setFabric("Pure Mulberry Silk");
            p2.setWeave("Handloom");
            p2.setColor("Crimson Red & Gold");
            p2.setRating(5.0);
            p2.setReviews(89);
            p2.setBadge("Premium");
            defaultProducts.add(p2);

            // 3. Chanderi Emerald Dream
            Product p3 = new Product();
            p3.setName("Chanderi Emerald Dream");
            p3.setCategory("Chanderi");
            p3.setPrice(12999);
            p3.setOriginalPrice(17999);
            p3.setImage("/images/saree_emerald_green.png");
            p3.setDescription("Lightweight Chanderi silk with delicate silver zari floral motifs, perfect for elegant occasions and festive celebrations.");
            p3.setFabric("Chanderi Silk");
            p3.setWeave("Handloom");
            p3.setColor("Emerald Green & Silver");
            p3.setRating(4.7);
            p3.setReviews(156);
            p3.setBadge("New Arrival");
            defaultProducts.add(p3);

            // 4. Tussar Royal Indigo
            Product p4 = new Product();
            p4.setName("Tussar Royal Indigo");
            p4.setCategory("Tussar");
            p4.setPrice(18999);
            p4.setOriginalPrice(24999);
            p4.setImage("/images/saree_navy_blue.png");
            p4.setDescription("Luxurious Tussar silk with traditional paisley motifs handwoven by master artisans of Bhagalpur.");
            p4.setFabric("Tussar Silk");
            p4.setWeave("Handloom");
            p4.setColor("Navy Blue & Gold");
            p4.setRating(4.8);
            p4.setReviews(94);
            p4.setBadge("Trending");
            defaultProducts.add(p4);

            // 5. Patola Heritage Weave
            Product p5 = new Product();
            p5.setName("Patola Heritage Weave");
            p5.setCategory("Patola");
            p5.setPrice(89999);
            p5.setOriginalPrice(119999);
            p5.setImage("/images/saree_saffron_orange.png");
            p5.setDescription("An heirloom double-ikat Patola saree from Patan, Gujarat — each piece takes 6-8 months to weave with geometric precision.");
            p5.setFabric("Pure Silk");
            p5.setWeave("Double Ikat Handloom");
            p5.setColor("Saffron Orange");
            p5.setRating(5.0);
            p5.setReviews(42);
            p5.setBadge("Heirloom");
            defaultProducts.add(p5);

            // 6. Mysore Silk Rosé
            Product p6 = new Product();
            p6.setName("Mysore Silk Rosé");
            p6.setCategory("Mysore");
            p6.setPrice(15999);
            p6.setOriginalPrice(21999);
            p6.setImage("/images/saree_blush_pink.png");
            p6.setDescription("Graceful Mysore crepe silk in blush pink with rose gold border, embodying South Indian elegance.");
            p6.setFabric("Mysore Crepe Silk");
            p6.setWeave("Handloom");
            p6.setColor("Blush Pink & Rose Gold");
            p6.setRating(4.6);
            p6.setReviews(203);
            p6.setBadge("Popular");
            defaultProducts.add(p6);

            productRepository.saveAll(defaultProducts);
            System.out.println("Default product catalog seeded successfully with " + defaultProducts.size() + " products.");
        }
    }
}
