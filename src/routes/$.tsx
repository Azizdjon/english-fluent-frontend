import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft, Search } from "lucide-react";

export const Route = createFileRoute("/$")({
  component: NotFoundPage,
});

function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* Big 404 */}
        <div className="relative mb-8">
          <div className="text-[10rem] font-black text-slate-800 leading-none select-none">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Search className="w-16 h-16 text-blue-500 opacity-80" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-white mb-3">
          Sahifa topilmadi
        </h1>
        <p className="text-slate-400 mb-8 leading-relaxed">
          Siz qidirgan sahifa mavjud emas yoki ko'chirilgan bo'lishi mumkin.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={() => navigate({ to: "/" })}
            className="bg-blue-600 hover:bg-blue-500 font-semibold gap-2"
          >
            <Home className="w-4 h-4" />
            Bosh sahifaga
          </Button>
          <Button
            onClick={() => window.history.back()}
            variant="outline"
            className="border-slate-600 text-slate-300 hover:bg-slate-700 gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Orqaga qaytish
          </Button>
        </div>
      </div>
    </div>
  );
}
