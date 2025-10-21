import { Category } from '@/types/index';

export const mockCategories: Category[] = [
  // =========================================================
  // İLK 10 KATEGORİ
  // =========================================================
  {
    id: 'elektronik',
    name: 'Elektronik',
    subCategories: [
      { id: 'telefon', name: 'Cep Telefonları' },
      { id: 'bilgisayar', name: 'Laptop & Masaüstü' },
      { id: 'tv_ses', name: 'Televizyon & Ses Sistemleri' },
      { id: 'kamera', name: 'Kamera & Fotoğraf' },
    ],
  },
  {
    id: 'giyim',
    name: 'Giyim & Moda',
    subCategories: [
      { id: 'kadin_giyim', name: 'Kadın Giyim' },
      { id: 'erkek_giyim', name: 'Erkek Giyim' },
      { id: 'ayakkabi', name: 'Ayakkabı & Çanta' },
      { id: 'saat_aksesuar', name: 'Saat & Aksesuar' },
    ],
  },
  {
    id: 'ev_yasam',
    name: 'Ev, Yaşam & Ofis',
    subCategories: [
      { id: 'ev_dekorasyon', name: 'Ev Dekorasyon' },
      { id: 'mutfak_gerecleri', name: 'Mutfak Gereçleri' },
      { id: 'ev_tekstili', name: 'Ev Tekstili' },
      { id: 'ofis_kirtasiye', name: 'Ofis & Kırtasiye' },
    ],
  },
  {
    id: 'anne_bebek',
    name: 'Anne, Bebek & Oyuncak',
    subCategories: [
      { id: 'bebek_giyim', name: 'Bebek Giyim' },
      { id: 'bebek_bakim', name: 'Bebek Bakım & Sağlık' },
      { id: 'bebek_beslenme', name: 'Bebek Beslenme Gereçleri' },
      { id: 'bebek_guvenlik', name: 'Bebek Güvenlik Ürünleri' },
    ],
  },
  {
    id: 'kozmetik',
    name: 'Kozmetik & Kişisel Bakım',
    subCategories: [
      { id: 'makyaj', name: 'Makyaj Malzemeleri' },
      { id: 'cilt_bakim', name: 'Cilt Bakımı' },
      { id: 'sac_bakim', name: 'Saç Bakımı' },
      { id: 'parfum_deodorant', name: 'Parfüm & Deodorant' },
    ],
  },

  {
    id: 'oto_yapi_market',
    name: 'Oto, Bahçe & Yapı Market',
    subCategories: [
      { id: 'oto_aksesuar', name: 'Oto Aksesuarları' },
      { id: 'bahce_cicek', name: 'Bahçe & Çiçek' },
      { id: 'el_aletleri', name: 'El Aletleri' },
      { id: 'yapi_market', name: 'Yapı Market & Hırdavat' },
    ],
  },
  {
    id: 'spor_outdoor',
    name: 'Spor & Outdoor',
    subCategories: [
      { id: 'fitness_kondisyon', name: 'Fitness & Kondisyon' },
      { id: 'outdoor_kamp', name: 'Outdoor & Kamp' },
      { id: 'spor_giyim', name: 'Spor Giyim & Ayakkabı' },
      { id: 'takim_sporlari', name: 'Takım Sporları' },
    ],
  },
  {
    id: 'petshop',
    name: 'Pet Shop',
    subCategories: [
      { id: 'kedi_urunleri', name: 'Kedi Maması & Malzemeleri' },
      { id: 'kopek_urunleri', name: 'Köpek Maması & Malzemeleri' },
      { id: 'kus_balik_diger', name: 'Kuş, Balık & Diğer Evciller' },
      { id: 'pet_oyuncaklari', name: 'Pet Oyuncakları & Aksesuarları' },
    ],
  },
  {
    id: 'kitap_film_hobi',
    name: 'Kitap, Film, Müzik, Hobi',
    subCategories: [
      { id: 'kitaplar', name: 'Kitaplar & Dergiler' },
      { id: 'muzik_albumleri', name: 'Müzik Albümleri & Plaklar' },
      { id: 'filmler', name: 'Filmler (DVD, Blu-ray)' },
      { id: 'sanat_malzemeleri', name: 'Sanat & Hobi Malzemeleri' },
    ],
  },

  // =========================================================
  // EKLENEN YENİ 5 KATEGORİ DAHA
  // =========================================================
  {
    id: 'mobilya',
    name: 'Mobilya',
    subCategories: [
      { id: 'oturma_odasi', name: 'Oturma Odası Mobilyaları' },
      { id: 'yatak_odasi', name: 'Yatak Odası Mobilyaları' },
      { id: 'ofis_mobilya', name: 'Ofis Mobilyaları' },
      { id: 'bahce_mobilya', name: 'Bahçe Mobilyaları' },
    ],
  },
  {
    id: 'mucevher_saat',
    name: 'Mücevher & Saat',
    subCategories: [
      { id: 'kadin_saat', name: 'Kadın Kol Saatleri' },
      { id: 'erkek_saat', name: 'Erkek Kol Saatleri' },
      { id: 'taki_mucevher', name: 'Takı & Mücevher' },
      { id: 'aksesuarlar', name: 'Güneş Gözlüğü & Aksesuar' },
    ],
  },
  {
    id: 'oyuncak_oyun',
    name: 'Oyuncak & Oyun',
    subCategories: [
      { id: 'bebek_oyuncak', name: 'Bebek & Okul Öncesi Oyuncaklar' },
      { id: 'kutu_oyunlari_puzzle', name: 'Kutu Oyunları & Puzzle' },
      { id: 'dis_mekan_oyuncak', name: 'Dış Mekan & Spor Oyuncakları' },
      { id: 'figur_oyuncak', name: 'Figür Oyuncaklar & Koleksiyon' },
    ],
  },
  {
    id: 'saglik_wellness',
    name: 'Sağlık & Wellness',
    subCategories: [
      { id: 'vitamin_takviye', name: 'Vitamin & Besin Takviyeleri' },
      { id: 'sporcu_besinleri', name: 'Sporcu Besinleri' },
      { id: 'medikal_urunler', name: 'Medikal Ürünler & Cihazlar' },
      { id: 'kisisel_bakim_cihazlari', name: 'Kişisel Bakım Cihazları' },
    ],
  },
  {
    id: 'seyahat',
    name: 'Valiz & Seyahat',
    subCategories: [
      { id: 'valiz_bavul', name: 'Valiz & Bavul Setleri' },
      { id: 'sirt_cantasi', name: 'Sırt Çantaları' },
      { id: 'seyahat_aksesuar', name: 'Seyahat Aksesuarları' },
      { id: 'cocuk_valiz', name: 'Çocuk Valiz ve Çantaları' },
    ],
  },
  {
    id: 'supermarket',
    name: 'Süpermarket',
    subCategories: [
      { id: 'temel_gida', name: 'Temel Gıda & Bakliyat' },
      { id: 'icecekler', name: 'İçecekler' },
      { id: 'ev_temizlik', name: 'Ev Temizlik Ürünleri' },
      { id: 'atistirmaliklar', name: 'Atıştırmalık & Şekerleme' },
    ],
  },
];
