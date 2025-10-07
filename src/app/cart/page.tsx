"use client";
import { useCart } from "../../context/CartContext";
import Image from "next/image";
import Link from "next/link";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart, getCartTotal } =
    useCart();
  const { totalItems, totalPrice } = getCartTotal();

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex flex-col items-center justify-center p-8 text-center">
        <div className="text-8xl mb-6">🛒</div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-[#667EEA] to-[#764BA2] bg-clip-text text-transparent mb-4">
          Sepetiniz Boş
        </h1>
        <p className="text-gray-600 text-lg mb-8 max-w-md">
          Henüz sepetinize ürün eklemediniz. Hemen alışverişe başlayın ve harika
          ürünleri keşfedin!
        </p>
        <Link
          href="/"
          className="bg-gradient-to-r from-[#667EEA] to-[#764BA2] text-white px-8 py-4 rounded-xl hover:shadow-lg transition-all font-semibold text-lg"
        >
          Alışverişe Başla
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#667EEA] to-[#764BA2] bg-clip-text text-transparent mb-2">
            Alışveriş Sepeti
          </h1>
          <p className="text-gray-600 text-lg">
            {totalItems} ürün • Toplam:{" "}
            {totalPrice.toLocaleString("tr-TR", {
              style: "currency",
              currency: "TRY",
            })}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Ürün Listesi */}
          <div className="lg:col-span-2 space-y-6">
            {cart.map(({ product, quantity }) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 p-6 border border-gray-100"
              >
                <div className="flex flex-col sm:flex-row gap-6">
                  {/* Ürün Görseli */}
                  <div className="relative w-full sm:w-32 h-32 flex-shrink-0">
                    <Image
                      src={product.image_url}
                      alt={product.name}
                      fill
                      className="object-cover rounded-xl"
                    />
                  </div>

                  {/* Ürün Bilgisi */}
                  <div className="flex-1 min-w-0">
                    <h2 className="font-semibold text-lg text-gray-800 mb-2 line-clamp-2">
                      {product.name}
                    </h2>
                    <p className="text-xl font-bold bg-gradient-to-r from-[#667EEA] to-[#764BA2] bg-clip-text text-transparent mb-4">
                      {product.price.toLocaleString("tr-TR", {
                        style: "currency",
                        currency: "TRY",
                      })}
                    </p>

                    {/* Adet Butonları */}
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-3 py-2">
                        <button
                          onClick={() => {
                            if (quantity === 1) {
                              removeFromCart(product.id);
                            } else {
                              updateQuantity(product.id, quantity - 1);
                            }
                          }}
                          className="w-8 h-8 flex items-center justify-center bg-white rounded-lg hover:bg-gray-100 transition-colors shadow-sm text-gray-600 font-bold"
                        >
                          −
                        </button>
                        <span className="min-w-[2ch] text-center font-semibold text-gray-800">
                          {quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(product.id, quantity + 1)
                          }
                          className="w-8 h-8 flex items-center justify-center bg-white rounded-lg hover:bg-gray-100 transition-colors shadow-sm text-gray-600 font-bold"
                        >
                          +
                        </button>
                      </div>

                      {/* Ara Toplam */}
                      <div className="text-sm text-gray-600">
                        Ara toplam: <br />
                        <span className="font-semibold text-gray-800">
                          {(product.price * quantity).toLocaleString("tr-TR", {
                            style: "currency",
                            currency: "TRY",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Kaldır Butonu */}
                  <button
                    onClick={() => removeFromCart(product.id)}
                    className="text-red-500 hover:text-red-600 font-medium transition-colors flex items-center gap-2 self-start sm:self-center"
                  >
                    <span className="text-lg">🗑️</span>
                    Kaldır
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Sepet Özet Paneli */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 sticky top-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6 pb-4 border-b border-gray-200">
                Sipariş Özeti
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Toplam Ürün:</span>
                  <span className="font-semibold text-gray-800">
                    {totalItems} adet
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Kargo:</span>
                  <span className="font-semibold text-green-600">ÜCRETSİZ</span>
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between items-center text-lg">
                    <span className="font-semibold text-gray-800">
                      Genel Toplam:
                    </span>
                    <span className="text-xl font-bold bg-gradient-to-r from-[#667EEA] to-[#764BA2] bg-clip-text text-transparent">
                      {totalPrice.toLocaleString("tr-TR", {
                        style: "currency",
                        currency: "TRY",
                      })}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <button className="w-full bg-gradient-to-r from-[#667EEA] to-[#764BA2] text-white py-4 rounded-xl hover:shadow-lg transition-all font-semibold text-lg">
                  Güvenli Ödemeye Geç
                </button>
                <button
                  onClick={clearCart}
                  className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl hover:bg-gray-200 transition-all font-medium flex items-center justify-center gap-2"
                >
                  <span>🗑️</span>
                  Sepeti Temizle
                </button>
              </div>

              {/* Güven Sembolleri */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex justify-center gap-4 text-2xl">
                  <span title="Güvenli Ödeme">🔒</span>
                  <span title="SSL Sertifikası">🛡️</span>
                  <span title="Hızlı Teslimat">🚚</span>
                </div>
                <p className="text-center text-sm text-gray-500 mt-2">
                  %100 Güvenli Alışveriş
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
