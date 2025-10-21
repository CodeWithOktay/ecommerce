// app/kargo-ve-iade/page.tsx
'use client';

import { returnPolicies, shippingMethods } from '@/lib/constants/shipping';
import {
  CheckCircle,
  Clock,
  FileText,
  Mail,
  Package,
  Phone,
  Shield,
  Truck,
  XCircle,
} from 'lucide-react';
import { useState } from 'react';

export default function KargoVeIadePage() {
  const [activeTab, setActiveTab] = useState<'kargo' | 'iade'>('kargo');
  const [showReturnForm, setShowReturnForm] = useState(false);
  const [formData, setFormData] = useState({
    orderNumber: '',
    email: '',
    reason: '',
    description: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Form submission logic here
    console.log('İade talebi:', formData);
    alert('İade talebiniz alınmıştır. En kısa sürede dönüş yapılacaktır.');
    setShowReturnForm(false);
    setFormData({ orderNumber: '', email: '', reason: '', description: '' });
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Kargo & İade Bilgileri
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Güvenli alışveriş, hızlı teslimat ve kolay iade garantisi
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg shadow-sm border p-1">
            <button
              onClick={() => setActiveTab('kargo')}
              className={`px-6 py-3 rounded-md font-medium transition-colors ${
                activeTab === 'kargo'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Kargo Seçenekleri
            </button>
            <button
              onClick={() => setActiveTab('iade')}
              className={`px-6 py-3 rounded-md font-medium transition-colors ${
                activeTab === 'iade'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              İade & Değişim
            </button>
          </div>
        </div>

        {/* Kargo Tab Content */}
        {activeTab === 'kargo' && (
          <div className="space-y-8">
            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
                <Truck className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">Ücretsiz Kargo</h3>
                <p className="text-gray-600">299 TL ve üzeri alışverişlerde</p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
                <Clock className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">Hızlı Teslimat</h3>
                <p className="text-gray-600">1-5 iş günü içinde kapınızda</p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
                <Shield className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">
                  Güvenli Paketleme
                </h3>
                <p className="text-gray-600">Özenle paketlenmiş ürünler</p>
              </div>
            </div>

            {/* Shipping Methods */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Kargo Seçenekleri
              </h2>
              {shippingMethods.map((method) => (
                <div
                  key={method.id}
                  className="bg-white rounded-lg shadow-md border p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Package className="w-6 h-6 text-blue-600" />
                        <h3 className="text-xl font-semibold text-gray-900">
                          {method.name}
                        </h3>
                        {method.price === 0 && (
                          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                            ÜCRETSİZ
                          </span>
                        )}
                      </div>

                      <p className="text-gray-600 mb-2">{method.description}</p>

                      <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          Teslimat: {method.deliveryTime}
                        </span>
                        {method.freeShippingThreshold && (
                          <span>
                            {method.freeShippingThreshold} TL ve üzeri ücretsiz
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 md:mt-0 md:text-right">
                      {method.price > 0 ? (
                        <div>
                          <span className="text-2xl font-bold text-gray-900">
                            {method.price.toFixed(2)} TL
                          </span>
                        </div>
                      ) : (
                        <div>
                          <span className="text-2xl font-bold text-green-600">
                            ÜCRETSİZ
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Additional Info */}
            <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">
                Önemli Bilgiler
              </h3>
              <ul className="text-blue-800 space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Siparişleriniz 24-48 saat içinde kargoya verilir
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Hafta içi 15:00&apos;dan önce verilen siparişler aynı gün
                  kargolanır
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Kargo takip numaranızı sipariş sonrası e-posta ile alacaksınız
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Teslimat sırasında ürünleri kontrol etmeyi unutmayın
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* İade Tab Content */}
        {activeTab === 'iade' && (
          <div className="space-y-8">
            {/* Return Process Steps */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold mb-6 text-gray-900">
                İade Süreci
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                  { step: 1, title: 'Başvuru', desc: 'İade talebi oluşturun' },
                  { step: 2, title: 'Onay', desc: 'İade onayı alın' },
                  { step: 3, title: 'Kargo', desc: 'Ürünü kargoya verin' },
                  { step: 4, title: 'İade', desc: 'İadeniz tamamlansın' },
                ].map((item) => (
                  <div key={item.step} className="text-center">
                    <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-3 font-semibold">
                      {item.step}
                    </div>
                    <h3 className="font-semibold mb-1 text-gray-900">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-600">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Return Policies */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-900">
                İade Politikaları
              </h2>
              {returnPolicies.map((policy) => (
                <div
                  key={policy.id}
                  className="bg-white rounded-lg shadow-md border p-6"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <FileText className="w-6 h-6 text-green-600" />
                    <h3 className="text-xl font-semibold text-gray-900">
                      {policy.title}
                    </h3>
                  </div>

                  <p className="text-gray-600 mb-4">{policy.description}</p>

                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Koşullar:
                    </h4>
                    <ul className="space-y-2">
                      {policy.conditions.map((condition, index) => (
                        <li
                          key={index}
                          className="flex items-start gap-2 text-gray-600"
                        >
                          <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                          {condition}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-yellow-800 text-sm flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <strong>Not:</strong> İade süresi {policy.duration} gün
                      ile sınırlıdır. Süre teslimat tarihinden itibaren başlar.
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Return Form Trigger */}
            <div className="text-center">
              <button
                onClick={() => setShowReturnForm(true)}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold text-lg"
              >
                İade Talebi Oluştur
              </button>
            </div>

            {/* Contact Info */}
            <div className="bg-gray-100 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-900">
                İade İletişim
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium">Telefon</p>
                    <p className="text-gray-600">0850 123 45 67</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium">E-posta</p>
                    <p className="text-gray-600">iade@sirketiniz.com</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Return Form Modal */}
        {showReturnForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">
                    İade Talebi
                  </h3>
                  <button
                    onClick={() => setShowReturnForm(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sipariş Numarası *
                    </label>
                    <input
                      type="text"
                      name="orderNumber"
                      value={formData.orderNumber}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="SPR-123456"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      E-posta *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="ornek@email.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      İade Nedeni *
                    </label>
                    <select
                      name="reason"
                      value={formData.reason}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Seçiniz</option>
                      <option value="size">Yanlış beden</option>
                      <option value="color">Renk beğenmedim</option>
                      <option value="defective">Defolu ürün</option>
                      <option value="other">Diğer</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Açıklama
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="İade nedeni hakkında detaylı açıklama..."
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowReturnForm(false)}
                      className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition-colors font-medium"
                    >
                      İptal
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      Gönder
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
