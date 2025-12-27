"use client";

import { useState, useRef } from "react";
import { User } from "@prisma/client";
import {
  createAdmin,
  deleteAdmin,
  toggleAdminStatus,
  updateAdmin,
} from "@/lib/actions/admin";
import toast from "react-hot-toast";
import {
  Trash2,
  ShieldCheck,
  ShieldAlert,
  Plus,
  X,
  Pencil,
  Loader2,
  Lock,
} from "lucide-react";

// ==========================================
//  1. MODAL: Yönetici Düzenleme (Şifre Destekli)
// ==========================================
function EditAdminModal({
  user,
  isOpen,
  onClose,
}: {
  user: User;
  isOpen: boolean;
  onClose: () => void;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  if (!isOpen) return null;

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    // updateAdmin action'ını çağırırken userId'yi de gönderiyoruz
    const res = await updateAdmin(user.id, formData);

    if (res.success) {
      toast.success(res.message);
      onClose();
    } else {
      toast.error(res.message);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative zoom-in-95 transition-all">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
        >
          <X size={24} />
        </button>

        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Pencil size={20} className="text-blue-600" />
          Yöneticiyi Düzenle
        </h2>

        <form ref={formRef} action={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ad
              </label>
              <input
                name="firstName"
                defaultValue={user.firstName ?? ""}
                required
                className="border border-gray-300 p-3 rounded-xl w-full focus:ring-2 ring-blue-500 outline-none transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Soyad
              </label>
              <input
                name="lastName"
                defaultValue={user.lastName || ""}
                required
                className="border border-gray-300 p-3 rounded-xl w-full focus:ring-2 ring-blue-500 outline-none transition"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1">
              E-posta
            </label>
            <input
              type="email"
              name="email"
              defaultValue={user.email || ""}
              required
              className="border border-gray-300 p-3 rounded-xl w-full focus:ring-2 ring-blue-500 outline-none transition"
            />
          </div>

          {/* 🟡 Şifre Alanı (İsteğe Bağlı) */}
          <div className="pt-2 border-t border-gray-100 mt-2">
            <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
              <Lock size={14} className="text-gray-400" /> Yeni Şifre (İsteğe
              Bağlı)
            </label>
            <input
              type="password"
              name="password"
              autoComplete="new-password"
              placeholder="Değiştirmek istemiyorsanız boş bırakın"
              className="border border-gray-300 p-3 rounded-xl w-full focus:ring-2 ring-blue-500 outline-none transition placeholder:text-gray-400 text-sm"
            />
            <p className="text-xs text-gray-500 mt-1">
              Kullanıcının şifresini değiştirmek istemiyorsanız bu alanı boş
              bırakın.
            </p>
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {isSubmitting ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                "Güncelle"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ==========================================
//  2. BİLEŞEN: Tablo Satır Aksiyonları (Düzenle, Sil, Durum)
// ==========================================
export function AdminRowActions({ user }: { user: User }) {
  const [loading, setLoading] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const handleDelete = async () => {
    if (
      !confirm(
        "Bu yöneticiyi silmek istediğine emin misin? Bu işlem geri alınamaz."
      )
    )
      return;
    setLoading(true);
    await deleteAdmin(user.id);
    toast.success("Yönetici silindi.");
    setLoading(false);
  };

  const handleToggle = async () => {
    setLoading(true);
    await toggleAdminStatus(user.id, user.isActive);
    toast.success(
      user.isActive ? "Yönetici pasife alındı." : "Yönetici aktifleştirildi."
    );
    setLoading(false);
  };

  return (
    <>
      <div className="flex items-center justify-end gap-2">
        {/* Düzenle Butonu */}
        <button
          onClick={() => setIsEditOpen(true)}
          disabled={loading}
          title="Düzenle"
          className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
        >
          <Pencil size={18} />
        </button>

        {/* Aktif/Pasif Butonu */}
        <button
          onClick={handleToggle}
          disabled={loading}
          title={user.isActive ? "Pasife Al" : "Aktifleştir"}
          className={`p-2 rounded-lg transition ${
            user.isActive
              ? "bg-green-100 text-green-600 hover:bg-green-200"
              : "bg-gray-100 text-gray-500 hover:bg-gray-200"
          }`}
        >
          {user.isActive ? (
            <ShieldCheck size={18} />
          ) : (
            <ShieldAlert size={18} />
          )}
        </button>

        {/* Sil Butonu */}
        <button
          onClick={handleDelete}
          disabled={loading}
          title="Sil"
          className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition"
        >
          <Trash2 size={18} />
        </button>
      </div>

      {/* Edit Modalı - State true ise render olur */}
      <EditAdminModal
        user={user}
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
      />
    </>
  );
}

// ==========================================
//  3. BİLEŞEN: Yeni Yönetici Ekle Butonu & Modalı
// ==========================================
export function CreateAdminButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    const res = await createAdmin(formData);
    if (res.success) {
      toast.success(res.message);
      setIsOpen(false);
      formRef.current?.reset();
    } else {
      toast.error(res.message);
    }
    setIsSubmitting(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2.5 rounded-xl hover:bg-purple-700 transition shadow-sm font-semibold"
      >
        <Plus size={20} /> Yeni Yönetici Ekle
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative zoom-in-95 transition-all">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
            >
              <X size={24} />
            </button>
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Plus size={20} className="text-purple-600" /> Yeni Yönetici
              Oluştur
            </h2>
            <form ref={formRef} action={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input
                  name="firstName"
                  placeholder="Ad"
                  required
                  className="border border-gray-300 p-3 rounded-xl w-full focus:ring-2 ring-purple-500 focus:border-transparent outline-none transition"
                />
                <input
                  name="lastName"
                  placeholder="Soyad"
                  required
                  className="border border-gray-300 p-3 rounded-xl w-full focus:ring-2 ring-purple-500 focus:border-transparent outline-none transition"
                />
              </div>
              <input
                type="email"
                name="email"
                placeholder="E-posta"
                required
                className="border border-gray-300 p-3 rounded-xl w-full focus:ring-2 ring-purple-500 focus:border-transparent outline-none transition"
              />

              <div className="relative">
                <input
                  type="password"
                  name="password"
                  placeholder="Şifre"
                  required
                  className="border border-gray-300 p-3 rounded-xl w-full focus:ring-2 ring-purple-500 focus:border-transparent outline-none transition"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-purple-600 text-white py-3 rounded-xl font-bold hover:bg-purple-700 transition flex justify-center items-center disabled:opacity-70"
              >
                {isSubmitting ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  "Oluştur"
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
