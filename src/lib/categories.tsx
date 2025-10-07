import { Category } from "../types";

export const mockCategories: Category[] = [
  {
    id: "elektronik",
    name: "Elektronik",
    subCategories: [
      { id: "telefon", name: "Cep Telefonları" },
      { id: "bilgisayar", name: "Laptop & Masaüstü" },
      { id: "tv_ses", name: "Televizyon & Ses Sistemleri" },
      { id: "kamera", name: "Kamera & Fotoğraf" },
    ],
  },
  {
    id: "giyim",
    name: "Giyim & Moda",
    subCategories: [
      { id: "kadin_giyim", name: "Kadın Giyim" },
      { id: "erkek_giyim", name: "Erkek Giyim" },
      { id: "ayakkabi", name: "Ayakkabı & Çanta" },
      { id: "saat", name: "Saat & Aksesuar" },
    ],
  },
  {
    id: "ev_yasam",
    name: "Ev, Yaşam & Ofis",
    subCategories: [
      { id: "mobilya", name: "Mobilya" },
      { id: "dekorasyon", name: "Ev Dekorasyon" },
      { id: "mutfak", name: "Mutfak Gereçleri" },
      { id: "kirtasiye", name: "Ofis & Kırtasiye" },
    ],
  },
  {
    id: "hobi",
    name: "Spor & Hobi",
    subCategories: [
      { id: "oyun", name: "Oyun Konsolları & PC Oyunları" },
      { id: "kitap", name: "Kitap & Müzik" },
      { id: "spor_malzemeleri", name: "Spor Malzemeleri" },
      { id: "oyuncak", name: "Oyuncak & Çocuk Gereçleri" },
    ],
  },
  {
    id: "anne_bebek",
    name: "Anne, Bebek & Oyuncak",
    subCategories: [
      { id: "bebek_giyim", name: "Bebek Giyim" },
      { id: "bebek_gerec", name: "Bebek Bakım & Gereçleri" },
      { id: "oyuncaklar", name: "Oyuncaklar" },
      { id: "kitap_hobi", name: "Kitap & Film" },
    ],
  },
];
