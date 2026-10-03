export const I18N = {
  ru: {
    brand: "A*New Shop",
    search: "Поиск товара...",
    noProducts: "Товаров пока нет",
    sold: "Продано",
    contactSeller: "Написать продавцу",
    allCategories: "Все",
    giftsBanner: "Подарки до 100 ТМТ",
    budgetBanner: "Товары до 50 манат",
    noVideos: "Видео пока нет",
    swipeHint: "← Смахните для видео",
    langLabel: "RU",
  },
  tm: {
    brand: "A*New Shop",
    search: "Haryt gözle...",
    noProducts: "Häzirlikçe haryt ýok",
    sold: "Satyldy",
    contactSeller: "Satyja ýaz",
    allCategories: "Hemmesi",
    giftsBanner: "100 TMT-den arzan sowgatlar",
    budgetBanner: "50 manatdan arzan harytlar",
    noVideos: "Wideo häzirlikçe ýok",
    swipeHint: "← Wideo üçin süýşüriň",
    langLabel: "TM",
  },
  tr: {
    brand: "A*New Shop",
    search: "Ürün ara...",
    noProducts: "Henüz ürün yok",
    sold: "Satıldı",
    contactSeller: "Satıcıya Yaz",
    allCategories: "Tümü",
    giftsBanner: "100 TMT'ye kadar hediyeler",
    budgetBanner: "50 manata kadar ürünler",
    noVideos: "Henüz video yok",
    swipeHint: "← Video için kaydırın",
    langLabel: "TR",
  },
  en: {
    brand: "A*New Shop",
    search: "Search products...",
    noProducts: "No products yet",
    sold: "Sold",
    contactSeller: "Contact Seller",
    allCategories: "All",
    giftsBanner: "Gifts up to 100 TMT",
    budgetBanner: "Items up to 50 manat",
    noVideos: "No videos yet",
    swipeHint: "← Swipe for videos",
    langLabel: "EN",
  },
};

export const SUPPORTED_LANGS = ["ru", "tm", "tr", "en"];
export const DEFAULT_LANG = "ru";

// Достаёт название/описание товара на нужном языке с откатом на русский
export function localizedField(product, baseField, lang) {
  return (
    product[`${baseField}_${lang}`] ||
    product[`${baseField}_${DEFAULT_LANG}`] ||
    product[baseField] ||
    ""
  );
}
