import { Product } from '../types';

export const mockProducts: Product[] = [
  // =========================================================
  // 1. ELEKTRONİK
  // =========================================================

  // --- Cep Telefonları ---
  {
    id: 'e_t_001',
    name: 'Xiaomi Redmi Note 12 Pro',
    category_id: 'elektronik',
    subcategory_id: 'telefon',
    subcategory_name: 'Cep Telefonları',
    price: 9800.00,
    image_url: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    description: 'Bütçe dostu, yüksek pil kapasiteli akıllı telefon.',
    is_featured: true,
  },
  {
    id: 'e_t_002',
    name: 'Apple iPhone 14 Pro Max',
    category_id: 'elektronik',
    subcategory_id: 'telefon',
    subcategory_name: 'Cep Telefonları',
    price: 45999.00,
    old_price: 48000.00,
    image_url: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    description: 'A16 Bionic çip ile üstün performans ve dinamik ada özelliği.',
    is_featured: true,
  },

  // --- Laptop & Masaüstü ---
  {
    id: 'e_l_001',
    name: 'HP Victus Gaming Laptop',
    category_id: 'elektronik',
    subcategory_id: 'bilgisayar',
    subcategory_name: 'Laptop & Masaüstü',
    price: 21500.00,
    image_url: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    description: 'Oyun ve yüksek performans gerektiren işler için ideal.',
    is_featured: true,
  },
  {
    id: 'e_l_002',
    name: 'Samsung Galaxy Tab S8 Tablet',
    category_id: 'elektronik',
    subcategory_id: 'bilgisayar',
    subcategory_name: 'Laptop & Masaüstü',
    price: 8999.00,
    old_price: 9500.00,
    image_url: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    description: 'S Pen desteği ve AMOLED ekran ile yaratıcılığınızı serbest bırakın.',
    is_featured: false,
  },

  // --- Televizyon & Ses Sistemleri ---
  {
    id: 'e_tv_001',
    name: 'LG OLED G3 55 İnç 4K Smart TV',
    category_id: 'elektronik',
    subcategory_id: 'tv_ses',
    subcategory_name: 'Televizyon & Ses Sistemleri',
    price: 32000.00,
    image_url: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    description: 'Mükemmel siyahlar ve sonsuz kontrast ile sinema deneyimi.',
    is_featured: true,
  },
  {
    id: 'e_tv_002',
    name: 'JBL 5.1 Soundbar Sistemi',
    category_id: 'elektronik',
    subcategory_id: 'tv_ses',
    subcategory_name: 'Televizyon & Ses Sistemleri',
    price: 6500.00,
    image_url: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    description: 'Kablosuz subwoofer ve güçlü surround ses.',
    is_featured: false,
  },

  // =========================================================
  // 2. GİYİM & MODA
  // =========================================================

  // --- Kadın Giyim ---
  {
    id: 'g_k_001',
    name: 'Yazlık Viskon Çiçekli Elbise',
    category_id: 'giyim',
    subcategory_id: 'kadin_giyim',
    subcategory_name: 'Kadın Giyim',
    price: 549.90,
    image_url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    description: 'Hafif ve nefes alan kumaş, plaj ve günlük kullanım için ideal.',
    is_featured: true,
  },
  {
    id: 'g_k_002',
    name: 'Yüksek Bel Slim Fit Jean',
    category_id: 'giyim',
    subcategory_id: 'kadin_giyim',
    subcategory_name: 'Kadın Giyim',
    price: 499.00,
    image_url: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    description: 'Gün boyu rahatlık sunan esnek denim.',
    is_featured: false,
  },

  // --- Erkek Giyim ---
  {
    id: 'g_e_001',
    name: 'Slim Fit Polo Yaka Tişört',
    category_id: 'giyim',
    subcategory_id: 'erkek_giyim',
    subcategory_name: 'Erkek Giyim',
    price: 299.00,
    image_url: 'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    description: 'Yüzde yüz pamuk, yaz ayları için klasik seçim.',
    is_featured: false,
  },
  {
    id: 'g_e_002',
    name: 'Outdoor Su Geçirmez Mont',
    category_id: 'giyim',
    subcategory_id: 'erkek_giyim',
    subcategory_name: 'Erkek Giyim',
    price: 1299.00,
    old_price: 1500.00,
    image_url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    description: 'Rüzgar ve suya dayanıklı, nefes alabilen kumaş.',
    is_featured: true,
  },

  // =========================================================
  // 3. EV, YAŞAM & OFİS
  // =========================================================

  {
    id: 'ey_m_001',
    name: 'Ahşap Çalışma Masası',
    category_id: 'ev_yasam',
    subcategory_id: 'mobilya',
    subcategory_name: 'Mobilya',
    price: 3800.00,
    image_url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    description: 'Geniş çekmeceli, doğal meşe kaplama ofis masası.',
    is_featured: true,
  },

  {
    id: 'ey_m_002',
    name: 'Yemek Odası 6 Kişilik Sandalye Takımı',
    category_id: 'ev_yasam',
    subcategory_id: 'mobilya',
    subcategory_name: 'Mobilya',
    price: 7990.00,
    old_price: 9000.00,
    image_url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    description: 'Modern tasarım, kolay temizlenebilir kumaş.',
    is_featured: false,
  },

  // =========================================================
  // 4. ANNE, BEBEK & OYUNCAK
  // =========================================================

  {
    id: 'ab_o_001',
    name: 'Eğitici Ahşap Yapboz Seti',
    category_id: 'anne_bebek',
    subcategory_id: 'oyuncaklar',
    subcategory_name: 'Oyuncaklar',
    price: 250.00,
    image_url: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    description: 'El-göz koordinasyonunu geliştiren doğal ahşap oyuncak.',
    is_featured: false,
  },
  {
    id: 'ab_o_002',
    name: 'Uzaktan Kumandalı Yarış Arabası',
    category_id: 'anne_bebek',
    subcategory_id: 'oyuncaklar',
    subcategory_name: 'Oyuncaklar',
    price: 670.00,
    image_url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    description: 'Yüksek hızlı, dayanıklı malzemeden yapılmış şarj edilebilir araba.',
    is_featured: true,
  },
];
