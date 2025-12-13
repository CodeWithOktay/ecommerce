import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <h1 className="text-4xl font-bold text-red-600 mb-4">403 - Yetkisiz Giriş</h1>
      <p className="text-gray-600 mb-8">Bu sayfayı görüntüleme yetkiniz bulunmuyor.</p>
      <Link href="/" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
        Ana Sayfaya Dön
      </Link>
    </div>
  );
}