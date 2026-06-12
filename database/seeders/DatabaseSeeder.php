<?php

namespace Database\Seeders;

use App\Config\Database;

class DatabaseSeeder
{
    private \PDO $db;

    public function __construct()
    {
        $this->db = Database::getInstance()->getConnection();
    }

    public function run(): void
    {
        $this->seedCategories();
        $this->seedBrands();
        $this->seedProducts();
        $this->seedBlogCategories();
        $this->seedBlogs();
        $this->seedCoupons();
        $this->seedSettings();
        echo "Database seeded successfully!\n";
    }

    private function seedCategories(): void
    {
        $categories = [
            ['name' => 'Qurans & Mushaf', 'slug' => 'qurans-mushaf', 'description' => 'Holy Qurans in various sizes, translations and bindings', 'icon' => 'fa-book-quran', 'meta_title' => 'Buy Holy Quran Online - Amir Islamic Collection', 'meta_description' => 'Shop premium quality Holy Quran with English translation, Arabic text, and beautiful bindings. Free shipping on orders over $50.'],
            ['name' => 'Islamic Books', 'slug' => 'islamic-books', 'description' => 'Books on Islamic teachings, history, and spirituality', 'icon' => 'fa-book-open', 'meta_title' => 'Islamic Books - Learn About Islam', 'meta_description' => 'Discover authentic Islamic books covering Quran, Hadith, Fiqh, Seerah, and more. Worldwide delivery available.'],
            ['name' => 'Prayer Essentials', 'slug' => 'prayer-essentials', 'description' => 'Prayer mats, tasbih, and other prayer accessories', 'icon' => 'fa-pray', 'meta_title' => 'Prayer Essentials - Prayer Mats & Accessories', 'meta_description' => 'High-quality prayer mats, digital tasbih, and prayer accessories for your daily worship.'],
            ['name' => 'Hijabs & Fashion', 'slug' => 'hijabs-fashion', 'description' => 'Modest Islamic fashion and hijabs', 'icon' => 'fa-tshirt', 'meta_title' => 'Hijabs & Islamic Fashion - Modest Clothing', 'meta_description' => 'Explore our collection of elegant hijabs, abayas, and modest Islamic fashion for women.'],
            ['name' => 'Attars & Perfumes', 'slug' => 'attars-perfumes', 'description' => 'Traditional oil-based perfumes and attars', 'icon' => 'fa-spray-can', 'meta_title' => 'Buy Attars & Islamic Perfumes Online', 'meta_description' => 'Premium alcohol-free attars and perfumes. Long-lasting traditional scents from around the world.'],
            ['name' => 'Home & Decor', 'slug' => 'home-decor', 'description' => 'Islamic home decor and wall art', 'icon' => 'fa-home', 'meta_title' => 'Islamic Home Decor - Wall Art & Gifts', 'meta_description' => 'Beautiful Islamic wall art, calligraphy, and home decor items to bless your home.'],
            ['name' => 'Gifts & Accessories', 'slug' => 'gifts-accessories', 'description' => 'Islamic gift items and accessories', 'icon' => 'fa-gift', 'meta_title' => 'Islamic Gifts & Accessories', 'meta_description' => 'Find the perfect Islamic gift. Unique accessories, jewelry, and gift sets for all occasions.'],
        ];

        $driver = \App\Config\Database::getInstance()->getDriver();
        $now = $driver === 'pgsql' ? 'CURRENT_TIMESTAMP' : 'NOW()';

        if ($driver === 'pgsql') {
            $stmt = $this->db->prepare(
                "INSERT INTO categories (name, slug, description, icon, meta_title, meta_description, parent_id, status, created_at) VALUES (?, ?, ?, ?, ?, ?, NULL, 'active', {$now}) ON CONFLICT (slug) DO NOTHING"
            );
        } else {
            $stmt = $this->db->prepare(
                "INSERT IGNORE INTO categories (name, slug, description, icon, meta_title, meta_description, parent_id, status, created_at) VALUES (?, ?, ?, ?, ?, ?, NULL, 'active', {$now})"
            );
        }

        foreach ($categories as $cat) {
            $stmt->execute([$cat['name'], $cat['slug'], $cat['description'], $cat['icon'], $cat['meta_title'], $cat['meta_description']]);
        }

        echo "Seeded " . count($categories) . " categories\n";
    }

    private function seedBrands(): void
    {
        $brands = [
            ['name' => 'Quranic Treasures', 'slug' => 'quranic-treasures', 'description' => 'Premium Quran publishers specializing in elegant mushaf with authentic calligraphy and translations.'],
            ['name' => 'Iqra Publishing', 'slug' => 'iqra-publishing', 'description' => 'Leading publisher of Islamic books covering Quranic studies, Hadith, Fiqh, and contemporary Islamic thought.'],
            ['name' => 'Al-Mustafa', 'slug' => 'al-mustafa', 'description' => 'Trusted brand for prayer essentials including premium prayer mats, Tasbih, and Qibla compasses.'],
            ['name' => 'Hijab Elegance', 'slug' => 'hijab-elegance', 'description' => 'Luxury hijabs and modest fashion for the modern Muslim woman. Premium fabrics and elegant designs.'],
            ['name' => 'Arabian Oud', 'slug' => 'arabian-oud', 'description' => 'Premium Arabian attars and perfume oils. Authentic Oud, Musk, and traditional fragrance blends.'],
            ['name' => 'Islamic Heritage', 'slug' => 'islamic-heritage', 'description' => 'Islamic home decor and calligraphy art. Beautiful wall hangings, canvas art, and decorative items.'],
        ];

        $driver = \App\Config\Database::getInstance()->getDriver();
        $now = $driver === 'pgsql' ? 'CURRENT_TIMESTAMP' : 'NOW()';

        if ($driver === 'pgsql') {
            $stmt = $this->db->prepare(
                "INSERT INTO brands (name, slug, description, status, created_at) VALUES (?, ?, ?, 'active', {$now}) ON CONFLICT (slug) DO NOTHING"
            );
        } else {
            $stmt = $this->db->prepare(
                "INSERT IGNORE INTO brands (name, slug, description, status, created_at) VALUES (?, ?, ?, 'active', {$now})"
            );
        }

        foreach ($brands as $brand) {
            $stmt->execute([$brand['name'], $brand['slug'], $brand['description']]);
        }

        echo "Seeded " . count($brands) . " brands\n";
    }

    private function seedProducts(): void
    {
        $products = [
            [
                'name' => 'Deluxe Quran with English Translation',
                'slug' => 'deluxe-quran-english-translation',
                'description' => 'Beautiful hardcover Quran with Arabic text, English translation, and transliteration. Features gold-edge pages, ribbon bookmark, and durable leatherette cover.',
                'short_description' => 'Premium Quran with Arabic text and English translation. Gold-edge pages.',
                'category_id' => 1, 'brand_id' => 1,
                'price' => 49.99, 'sale_price' => 39.99, 'sku' => 'QRN-001',
                'weight' => 1.5, 'stock_quantity' => 50, 'is_featured' => 1, 'is_new' => 0,
                'meta_title' => 'Deluxe Quran with English Translation - Premium Quality',
                'meta_description' => 'Beautiful hardcover Quran with Arabic text, English translation, and transliteration. Gold-edge pages with ribbon bookmark.',
            ],
            [
                'name' => 'Tajweed Quran (7.5 x 10.5 inch)',
                'slug' => 'tajweed-quran-large',
                'description' => 'Large print Tajweed Quran with color-coded rules for proper pronunciation. Ideal for daily recitation and study.',
                'short_description' => 'Large print Tajweed Quran with color-coded pronunciation rules.',
                'category_id' => 1, 'brand_id' => 1,
                'price' => 34.99, 'sale_price' => 29.99, 'sku' => 'TAJ-001',
                'weight' => 1.2, 'stock_quantity' => 100, 'is_featured' => 1, 'is_new' => 0,
                'meta_title' => 'Tajweed Quran Large Print - Color Coded',
                'meta_description' => 'Large print Tajweed Quran with color-coded pronunciation rules. Perfect for daily recitation.',
            ],
            [
                'name' => 'Pocket-Size Quran (Leather Cover)',
                'slug' => 'pocket-quran-leather',
                'description' => 'Compact pocket-size Quran with genuine leather cover. Perfect for travel and daily carry. Includes protective case.',
                'short_description' => 'Compact pocket Quran with genuine leather cover and protective case.',
                'category_id' => 1, 'brand_id' => 1,
                'price' => 24.99, 'sale_price' => null, 'sku' => 'PKT-001',
                'weight' => 0.3, 'stock_quantity' => 200, 'is_featured' => 0, 'is_new' => 1,
                'meta_title' => 'Pocket Size Quran - Leather Cover - Travel Size',
                'meta_description' => 'Compact pocket-size Quran with genuine leather cover, perfect for travel and daily carry.',
            ],
            [
                'name' => 'Fortress of the Muslim (Hisnul Muslim)',
                'slug' => 'fortress-of-the-muslim',
                'description' => 'Compilation of authentic duas and remembrances from the Quran and Sunnah. Pocket-size with Arabic, translation, and transliteration.',
                'short_description' => 'Authentic duas and remembrances from Quran and Sunnah. Pocket-size.',
                'category_id' => 2, 'brand_id' => 2,
                'price' => 9.99, 'sale_price' => 7.99, 'sku' => 'BOK-001',
                'weight' => 0.15, 'stock_quantity' => 500, 'is_featured' => 1, 'is_new' => 0,
                'meta_title' => 'Fortress of the Muslim - Hisnul Muslim Duas Book',
                'meta_description' => 'Complete collection of authentic duas and remembrances. Arabic with English translation.',
            ],
            [
                'name' => 'The Sealed Nectar (Ar-Raheeq Al-Makhtum)',
                'slug' => 'sealed-nectar',
                'description' => 'Award-winning biography of Prophet Muhammad (PBUH). Comprehensive and authenticated biography with maps and illustrations.',
                'short_description' => 'Award-winning biography of Prophet Muhammad (PBUH). Comprehensive and authenticated.',
                'category_id' => 2, 'brand_id' => 2,
                'price' => 19.99, 'sale_price' => 15.99, 'sku' => 'BOK-002',
                'weight' => 0.6, 'stock_quantity' => 150, 'is_featured' => 1, 'is_new' => 0,
                'meta_title' => 'The Sealed Nectar - Biography of Prophet Muhammad',
                'meta_description' => 'Award-winning biography of Prophet Muhammad (PBUH) with maps and illustrations.',
            ],
            [
                'name' => 'Riyad-us-Saliheen (2 Volume Set)',
                'slug' => 'riyad-us-saliheen-2-vol',
                'description' => 'Complete 2-volume collection of authentic Hadith compiled by Imam An-Nawawi. Includes commentary and explanations.',
                'short_description' => 'Complete 2-volume Hadith collection with commentary by Imam An-Nawawi.',
                'category_id' => 2, 'brand_id' => 2,
                'price' => 45.00, 'sale_price' => 39.99, 'sku' => 'BOK-003',
                'weight' => 1.8, 'stock_quantity' => 75, 'is_featured' => 0, 'is_new' => 0,
                'meta_title' => 'Riyad-us-Saliheen - 2 Volume Hadith Collection',
                'meta_description' => 'Complete authentic Hadith collection with detailed commentary by Imam An-Nawawi.',
            ],
            [
                'name' => 'Premium Velvet Prayer Mat (Large)',
                'slug' => 'premium-velvet-prayer-mat',
                'description' => 'Luxurious velvet prayer mat with intricate Islamic geometric design. Non-slip backing, machine washable, and travel-friendly.',
                'short_description' => 'Luxurious velvet prayer mat with non-slip backing and geometric design.',
                'category_id' => 3, 'brand_id' => 3,
                'price' => 29.99, 'sale_price' => 24.99, 'sku' => 'PRY-001',
                'weight' => 0.5, 'stock_quantity' => 100, 'is_featured' => 1, 'is_new' => 0,
                'meta_title' => 'Premium Velvet Prayer Mat - Large Non-Slip',
                'meta_description' => 'Luxurious velvet prayer mat with non-slip backing. Intricate Islamic geometric design. Machine washable.',
            ],
            [
                'name' => 'Digital Tasbih Counter (LED Display)',
                'slug' => 'digital-tasbih-counter',
                'description' => 'Electronic tasbih counter with LED display. Lightweight, portable, and accurate. Perfect for Dhikr after prayers.',
                'short_description' => 'Electronic tasbih counter with LED display. Portable and accurate.',
                'category_id' => 3, 'brand_id' => 3,
                'price' => 12.99, 'sale_price' => 9.99, 'sku' => 'TSB-001',
                'weight' => 0.05, 'stock_quantity' => 300, 'is_featured' => 0, 'is_new' => 1,
                'meta_title' => 'Digital Tasbih Counter - LED Display Dhikr Counter',
                'meta_description' => 'Electronic tasbih counter with LED display for accurate Dhikr counting. Lightweight and portable.',
            ],
            [
                'name' => 'Premium Silk Chiffon Hijab (Multiple Colors)',
                'slug' => 'premium-silk-chiffon-hijab',
                'description' => 'Elegant silk chiffon hijab available in multiple colors. Soft, breathable fabric with premium finish. Perfect for daily wear and special occasions.',
                'short_description' => 'Elegant silk chiffon hijab in multiple colors. Soft and breathable.',
                'category_id' => 4, 'brand_id' => 4,
                'price' => 18.99, 'sale_price' => 14.99, 'sku' => 'HIJ-001',
                'weight' => 0.1, 'stock_quantity' => 200, 'is_featured' => 1, 'is_new' => 0,
                'meta_title' => 'Premium Silk Chiffon Hijab - Modest Fashion',
                'meta_description' => 'Elegant silk chiffon hijab available in multiple colors. Soft, breathable with premium finish.',
            ],
            [
                'name' => 'Instant Hijab (No Pins Needed)',
                'slug' => 'instant-hijab-no-pins',
                'description' => 'Revolutionary instant hijab that requires no pins or wrapping. Pull-on design with stretchy, breathable fabric. Perfect for beginners.',
                'short_description' => 'Pull-on instant hijab with no pins needed. Stretchy and breathable fabric.',
                'category_id' => 4, 'brand_id' => 4,
                'price' => 22.99, 'sale_price' => null, 'sku' => 'HIJ-002',
                'weight' => 0.08, 'stock_quantity' => 150, 'is_featured' => 0, 'is_new' => 1,
                'meta_title' => 'Instant Hijab No Pins - Easy Wear Hijab',
                'meta_description' => 'Revolutionary instant hijab with pull-on design. No pins or wrapping needed. Perfect for beginners.',
            ],
            [
                'name' => 'Arabian Oud Royal Perfume Oil (12ml)',
                'slug' => 'arabian-oud-royal-perfume-oil',
                'description' => 'Premium Arabian Oud perfume oil. Rich, woody, and long-lasting fragrance. Alcohol-free and concentrated. Comes in elegant glass bottle with gift box.',
                'short_description' => 'Premium Arabian Oud perfume oil. Rich, long-lasting, alcohol-free.',
                'category_id' => 5, 'brand_id' => 5,
                'price' => 39.99, 'sale_price' => 34.99, 'sku' => 'ATR-001',
                'weight' => 0.03, 'stock_quantity' => 100, 'is_featured' => 1, 'is_new' => 0,
                'meta_title' => 'Arabian Oud Royal Perfume Oil - Premium Attar',
                'meta_description' => 'Premium Arabian Oud perfume oil. Rich woody fragrance, alcohol-free, concentrated. Gift box included.',
            ],
            [
                'name' => 'Rose & Musk Attar Gift Set (3x6ml)',
                'slug' => 'rose-musk-attar-gift-set',
                'description' => 'Beautiful gift set of 3 traditional attars: Rose, Musk, and Amber. Each in 6ml roll-on bottles. Perfect gift for loved ones.',
                'short_description' => 'Gift set of 3 traditional attars: Rose, Musk, and Amber. Roll-on bottles.',
                'category_id' => 5, 'brand_id' => 5,
                'price' => 29.99, 'sale_price' => 24.99, 'sku' => 'ATR-002',
                'weight' => 0.05, 'stock_quantity' => 80, 'is_featured' => 0, 'is_new' => 1,
                'meta_title' => 'Rose Musk Amber Attar Gift Set - Traditional Scents',
                'meta_description' => 'Beautiful gift set of 3 traditional attars: Rose, Musk, and Amber. Roll-on bottles. Perfect gift.',
            ],
            [
                'name' => 'Islamic Calligraphy Wall Art - Ayat-ul-Kursi',
                'slug' => 'ayatul-kursi-calligraphy-art',
                'description' => 'Beautiful canvas print of Ayat-ul-Kursi with elegant Thuluth calligraphy. Framed, ready to hang. Available in multiple sizes.',
                'short_description' => 'Elegant Ayat-ul-Kursi calligraphy canvas print. Framed and ready to hang.',
                'category_id' => 6, 'brand_id' => 6,
                'price' => 44.99, 'sale_price' => 39.99, 'sku' => 'DEC-001',
                'weight' => 1.0, 'stock_quantity' => 40, 'is_featured' => 1, 'is_new' => 0,
                'meta_title' => 'Ayat-ul-Kursi Islamic Calligraphy Wall Art',
                'meta_description' => 'Beautiful canvas print of Ayat-ul-Kursi with elegant Thuluth calligraphy. Framed and ready to hang.',
            ],
            [
                'name' => 'Arabic Coffee Set (Dallah & Cups)',
                'slug' => 'arabic-coffee-set-dallah',
                'description' => 'Traditional Arabic coffee set including brass Dallah (pot) and 6 cups with saucers. Beautifully engraved with Islamic patterns.',
                'short_description' => 'Traditional Arabic coffee set with brass Dallah and 6 cups. Engraved design.',
                'category_id' => 7, 'brand_id' => 6,
                'price' => 79.99, 'sale_price' => 69.99, 'sku' => 'GFT-001',
                'weight' => 2.0, 'stock_quantity' => 30, 'is_featured' => 0, 'is_new' => 0,
                'meta_title' => 'Arabic Coffee Set - Traditional Dallah & Cups',
                'meta_description' => 'Traditional Arabic coffee set with brass Dallah and 6 cups. Beautifully engraved with Islamic patterns.',
            ],
        ];

        $driver = \App\Config\Database::getInstance()->getDriver();
        $now = $driver === 'pgsql' ? 'CURRENT_TIMESTAMP' : 'NOW()';

        if ($driver === 'pgsql') {
            $stmt = $this->db->prepare(
                "INSERT INTO products (name, slug, description, short_description, category_id, brand_id, price, sale_price, sku, weight, stock_quantity, is_featured, is_new, meta_title, meta_description, status, created_at)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active', {$now}) ON CONFLICT (slug) DO NOTHING"
            );
        } else {
            $stmt = $this->db->prepare(
                "INSERT IGNORE INTO products (name, slug, description, short_description, category_id, brand_id, price, sale_price, sku, weight, stock_quantity, is_featured, is_new, meta_title, meta_description, status, created_at)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active', {$now})"
            );
        }

        foreach ($products as $product) {
            $stmt->execute([
                $product['name'], $product['slug'], $product['description'], $product['short_description'],
                $product['category_id'], $product['brand_id'], $product['price'], $product['sale_price'],
                $product['sku'], $product['weight'], $product['stock_quantity'], $product['is_featured'],
                $product['is_new'], $product['meta_title'], $product['meta_description']
            ]);
        }

        echo "Seeded " . count($products) . " products\n";
    }

    private function seedBlogCategories(): void
    {
        $categories = [
            ['name' => 'Quran & Tafseer', 'slug' => 'quran-tafseer'],
            ['name' => 'Hadith Studies', 'slug' => 'hadith-studies'],
            ['name' => 'Islamic Lifestyle', 'slug' => 'islamic-lifestyle'],
            ['name' => 'Product Guides', 'slug' => 'product-guides'],
            ['name' => 'Community News', 'slug' => 'community-news'],
        ];

        $driver = \App\Config\Database::getInstance()->getDriver();
        $now = $driver === 'pgsql' ? 'CURRENT_TIMESTAMP' : 'NOW()';

        if ($driver === 'pgsql') {
            $stmt = $this->db->prepare(
                "INSERT INTO blog_categories (name, slug, created_at) VALUES (?, ?, {$now}) ON CONFLICT (slug) DO NOTHING"
            );
        } else {
            $stmt = $this->db->prepare(
                "INSERT IGNORE INTO blog_categories (name, slug, created_at) VALUES (?, ?, {$now})"
            );
        }

        foreach ($categories as $cat) {
            $stmt->execute([$cat['name'], $cat['slug']]);
        }

        echo "Seeded " . count($categories) . " blog categories\n";
    }

    private function seedBlogs(): void
    {
        $blogs = [
            [
                'title' => 'The Virtues of Reading Quran Daily',
                'slug' => 'virtues-reading-quran-daily',
                'content' => '<p>Reading the Quran daily is a source of immense blessing and guidance. The Prophet Muhammad (PBUH) said: "The best of you are those who learn the Quran and teach it."</p><p>Establish a daily routine, even if it is just a few verses. Consistency is key to building a strong connection with the words of Allah.</p><h3>Benefits of Daily Quran Reading</h3><ul><li>Each letter brings ten rewards</li><li>The Quran will intercede for its readers on Judgment Day</li><li>It brings peace and tranquility to the heart</li><li>It increases faith and knowledge</li></ul>',
                'excerpt' => 'Discover the immense blessings of reading Quran daily and how to build a consistent routine.',
                'category_id' => 1, 'status' => 'published', 'meta_title' => 'Benefits of Reading Quran Daily - Islamic Guide',
                'meta_description' => 'Learn about the spiritual benefits and rewards of reading Quran daily. Tips for building a consistent Quran reading routine.',
            ],
            [
                'title' => 'Complete Guide to Performing Wudu',
                'slug' => 'complete-guide-wudu',
                'content' => '<p>Wudu (ablution) is an essential act of purification before prayer. This guide covers the proper method of performing wudu according to the Sunnah.</p><p>Allah says: "O you who believe! When you rise for prayer, wash your faces and your hands up to the elbows..." (Quran 5:6)</p><h3>Steps of Wudu</h3><ol><li>Begin with Bismillah</li><li>Wash hands three times</li><li>Rinse mouth three times</li><li>Cleanse nostrils three times</li><li>Wash face three times</li><li>Wash arms to elbows three times</li><li>Wipe head once</li><li>Wash feet to ankles three times</li></ol>',
                'excerpt' => 'Step-by-step guide to performing wudu correctly according to the Sunnah of Prophet Muhammad (PBUH).',
                'category_id' => 3, 'status' => 'published', 'meta_title' => 'How to Perform Wudu - Complete Step by Step Guide',
                'meta_description' => 'Learn how to perform wudu (ablution) correctly with our step-by-step guide based on authentic Sunnah.',
            ],
            [
                'title' => 'Choosing the Right Prayer Mat: A Buyer\'s Guide',
                'slug' => 'choosing-right-prayer-mat-guide',
                'content' => '<p>Your prayer mat is an important companion for your daily prayers. Here\'s how to choose the perfect one for your needs.</p><h3>Factors to Consider</h3><ul><li><strong>Material:</strong> Velvet, plush, or silk — each has different comfort and durability</li><li><strong>Size:</strong> Standard (70x110cm) or Large (80x140cm) based on your space</li><li><strong>Design:</strong> Geometric patterns, mosque designs, or simple elegant styles</li><li><strong>Portability:</strong> Travel mats are lightweight and foldable</li><li><strong>Non-slip backing:</strong> Essential for safety, especially on smooth floors</li></ul><p>At Amir Islamic Collection, we offer premium prayer mats crafted from high-quality materials with beautiful Islamic designs.</p>',
                'excerpt' => 'Everything you need to know about choosing the perfect prayer mat for comfort, durability, and style.',
                'category_id' => 4, 'status' => 'published', 'meta_title' => 'How to Choose the Perfect Prayer Mat - Buying Guide',
                'meta_description' => 'Comprehensive guide to choosing the right prayer mat. Learn about materials, sizes, designs, and features.',
            ],
            [
                'title' => 'The History and Significance of Oud (Agarwood)',
                'slug' => 'history-significance-oud-agarwood',
                'content' => '<p>Oud, also known as Agarwood, is one of the most precious and sought-after fragrance ingredients in the world. Its use dates back thousands of years across various civilizations.</p><p>In Islamic tradition, the Prophet Muhammad (PBUH) is reported to have loved good fragrances, and Oud holds a special place in Islamic culture.</p><h3>Why Oud is Special</h3><ul><li>It is mentioned in authentic Hadith as a recommended fragrance</li><li>Oud wood is used for incense burning in homes and mosques</li><li>Oud oil is highly concentrated and long-lasting</li><li>It has natural therapeutic properties</li></ul>',
                'excerpt' => 'Explore the rich history and cultural significance of Oud (Agarwood) in Islamic tradition and beyond.',
                'category_id' => 3, 'status' => 'published', 'meta_title' => 'History of Oud (Agarwood) - Islamic Fragrance Guide',
                'meta_description' => 'Discover the rich history and significance of Oud in Islamic culture. Learn about its types, uses, and benefits.',
            ],
            [
                'title' => 'Tips for a Productive Islamic Morning Routine',
                'slug' => 'productive-islamic-morning-routine',
                'content' => '<p>Start your day with barakah by following the Sunnah morning routine of Prophet Muhammad (PBUH).</p><h3>Morning Routine</h3><ol><li>Wake up with gratitude — say "Alhamdulillah"</li><li>Perform wudu and pray Tahajjud if possible</li><li>Recite morning adhkar (remembrances)</li><li>Pray Fajr on time</li><li>Recite Quran after Fajr</li><li>Exercise for physical health</li><li>Plan your day with intention</li></ol><p>Following this routine helps you begin each day with spiritual connection and purpose.</p>',
                'excerpt' => 'Transform your mornings with this Sunnah-inspired Islamic morning routine for productivity and barakah.',
                'category_id' => 3, 'status' => 'published', 'meta_title' => 'Islamic Morning Routine - Start Your Day with Barakah',
                'meta_description' => 'Learn how to create a productive Islamic morning routine based on the Sunnah of Prophet Muhammad (PBUH).',
            ],
        ];

        $driver = \App\Config\Database::getInstance()->getDriver();
        $now = $driver === 'pgsql' ? 'CURRENT_TIMESTAMP' : 'NOW()';

        if ($driver === 'pgsql') {
            $stmt = $this->db->prepare(
                "INSERT INTO blogs (title, slug, content, excerpt, category_id, status, meta_title, meta_description, created_at)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, {$now}) ON CONFLICT (slug) DO NOTHING"
            );
        } else {
            $stmt = $this->db->prepare(
                "INSERT IGNORE INTO blogs (title, slug, content, excerpt, category_id, status, meta_title, meta_description, created_at)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, {$now})"
            );
        }

        foreach ($blogs as $blog) {
            $stmt->execute([
                $blog['title'], $blog['slug'], $blog['content'], $blog['excerpt'],
                $blog['category_id'], $blog['status'], $blog['meta_title'], $blog['meta_description']
            ]);
        }

        echo "Seeded " . count($blogs) . " blog posts\n";
    }

    private function seedCoupons(): void
    {
        $coupons = [
            ['WELCOME10', 'percentage', 10, 50, 100, 1, 'Welcome discount for new customers', '2026-12-31 23:59:59'],
            ['RAMADAN25', 'percentage', 25, 200, 200, 2, 'Special Ramadan discount', '2026-06-30 23:59:59'],
            ['FREESHIP', 'fixed', 10, 100, 50, 1, 'Free shipping discount', '2026-12-31 23:59:59'],
            ['SAVE20', 'percentage', 20, 150, 150, 1, 'Save big on your purchase', '2026-09-30 23:59:59'],
            ['FLAT5', 'fixed', 5, 0, 500, 1, 'Flat discount on all orders', '2026-12-31 23:59:59'],
        ];

        $driver = \App\Config\Database::getInstance()->getDriver();
        $now = $driver === 'pgsql' ? 'CURRENT_TIMESTAMP' : 'NOW()';

        if ($driver === 'pgsql') {
            $stmt = $this->db->prepare(
                "INSERT INTO coupons (code, type, value, min_order_amount, usage_limit, per_user_limit, expires_at, is_active, created_at)
                 VALUES (?, ?, ?, ?, ?, ?, ?, 1, {$now}) ON CONFLICT (code) DO NOTHING"
            );
        } else {
            $stmt = $this->db->prepare(
                "INSERT IGNORE INTO coupons (code, type, value, min_order_amount, usage_limit, per_user_limit, expires_at, is_active, created_at)
                 VALUES (?, ?, ?, ?, ?, ?, ?, 1, {$now})"
            );
        }

        foreach ($coupons as $coupon) {
            $stmt->execute([
                $coupon[0], $coupon[1], $coupon[2], $coupon[3],
                $coupon[4], $coupon[5], $coupon[6]
            ]);
        }

        echo "Seeded " . count($coupons) . " coupons\n";
    }

    private function seedSettings(): void
    {
        $settings = [
            ['site_name', 'Amir Islamic Collection', 'general'],
            ['site_tagline', 'Your Trusted Islamic Marketplace', 'general'],
            ['site_email', 'info@amirislaminiccollection.com', 'general'],
            ['site_phone', '+254700000000', 'general'],
            ['site_address', '123 Islamic Street, Nairobi, Kenya', 'general'],
            ['site_maintenance', '0', 'general'],
            ['currency', 'KES', 'general'],
            ['currency_symbol', 'KSh', 'general'],
            ['tax_rate', '16', 'general'],
            ['shipping_free_min', '5000', 'shipping'],
            ['meta_description', 'Your trusted source for premium Islamic products - Qurans, books, prayer essentials, hijabs, attars & more. Shop online with confidence at Amir Islamic Collection.', 'seo'],
            ['meta_keywords', 'islamic store, quran online, islamic books, prayer mats, hijabs, attars, islamic gifts', 'seo'],
            ['social_whatsapp', '+254700000000', 'social'],
            ['social_facebook', 'https://facebook.com/amirislaminiccollection', 'social'],
            ['social_instagram', 'https://instagram.com/amirislaminiccollection', 'social'],
            ['social_twitter', 'https://twitter.com/amirislaminic', 'social'],
            ['social_youtube', 'https://youtube.com/@amirislaminiccollection', 'social'],
        ];

        $driver = \App\Config\Database::getInstance()->getDriver();

        if ($driver === 'pgsql') {
            $stmt = $this->db->prepare(
                "INSERT INTO settings (setting_key, setting_value, setting_group) VALUES (?, ?, ?) ON CONFLICT (setting_key) DO NOTHING"
            );
        } else {
            $stmt = $this->db->prepare(
                "INSERT IGNORE INTO settings (setting_key, setting_value, setting_group) VALUES (?, ?, ?)"
            );
        }

        foreach ($settings as $setting) {
            $stmt->execute($setting);
        }

        echo "Seeded " . count($settings) . " settings\n";
    }
}
