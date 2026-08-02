import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import serviceBanner from "@assets/service_banner.jpg";

export default function ServicePage() {
  const [, navigate] = useLocation();
  const { data: settings } = useQuery<Record<string, string>>({ queryKey: ["/api/settings"] });

  const channels = [
    {
      id: "group",
      label: "WhatsApp Group",
      icon: (
        <span className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "#25D366" }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
        </span>
      ),
      url: settings?.groupLink || "https://t.me/allaninvest",
    },
    {
      id: "support",
      label: "WhatsApp Service",
      icon: (
        <span className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "#25D366" }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
        </span>
      ),
      url: settings?.supportLink || "https://wa.me/allaninvest",
    },
    {
      id: "telegram",
      label: "Telegram Channel",
      icon: (
        <span className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "#0088CC" }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
            <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
          </svg>
        </span>
      ),
      url: settings?.channelLink || "https://t.me/allaninvest",
    },
  ];

  return (
    <div
      className="flex flex-col min-h-screen pb-28"
      style={{ background: "linear-gradient(160deg,#7B2FBE 0%,#5B1A9B 60%,#9B59B6 100%)" }}
    >
      {/* Header */}
      <div className="flex items-center px-4 py-4">
        <button onClick={() => navigate("/account")} className="mr-4 text-white text-2xl font-bold">‹</button>
        <h1 className="flex-1 text-center text-white text-lg font-bold pr-8">Client</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-4 space-y-4">
        {/* Banner */}
        <div className="rounded-2xl overflow-hidden relative" style={{ background: "#2D0070", minHeight: 130 }}>
          <img src={serviceBanner} alt="service" className="w-full h-36 object-cover" />
          <div
            className="absolute inset-0 flex flex-col justify-center px-4 py-3"
            style={{ background: "linear-gradient(90deg,rgba(30,0,80,0.85) 60%,transparent)" }}
          >
            <p className="text-white font-bold text-sm leading-tight uppercase">
              CONTACT CUSTOMER<br />SERVICE FOR MORE
            </p>
            <p className="font-black text-lg uppercase mt-0.5" style={{ color: "#F59E0B" }}>
              FREE CASH CODE
            </p>
            <p className="text-white font-bold text-sm uppercase">EVERYDAY</p>
          </div>
        </div>

        {/* Channel rows */}
        <div className="space-y-3">
          {channels.map(ch => (
            <div
              key={ch.id}
              className="flex items-center gap-3 px-4 py-3.5 rounded-2xl"
              style={{
                background: "rgba(255,255,255,0.95)",
                boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
              }}
            >
              {ch.icon}
              <span className="flex-1 font-semibold text-gray-800 text-sm">{ch.label}</span>
              <a
                href={ch.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <button
                  className="px-5 py-1.5 rounded-full font-bold text-sm active:scale-95 transition-transform"
                  style={{
                    background: "linear-gradient(135deg,#F5C518,#F59E0B,#D97706)",
                    color: "#3D1A00",
                    boxShadow: "0 2px 8px rgba(245,158,11,0.4)",
                  }}
                >
                  Début
                </button>
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
