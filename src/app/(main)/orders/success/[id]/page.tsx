import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default function OrderSuccessPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-4 text-center">
      <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
        <CheckCircle className="w-12 h-12 text-green-600" />
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        Siparişiniz Alındı!
      </h1>
      <p className="text-gray-600 mb-8 max-w-md">
        Teşekkürler. Siparişiniz başarıyla oluşturuldu. Sipariş numaranız:{" "}
        <span className="font-mono font-bold text-black">
          #{params.id.slice(-6).toUpperCase()}
        </span>
      </p>

      <div className="flex gap-4">
        <Link
          href="/user/orders"
          className="bg-black text-white px-6 py-3 rounded-xl font-medium hover:bg-gray-800 transition"
        >
          Siparişlerime Git
        </Link>
        <Link
          href="/"
          className="bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-medium hover:bg-gray-200 transition"
        >
          Alışverişe Dön
        </Link>
      </div>
    </div>
  );
}
