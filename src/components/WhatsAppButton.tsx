// TODO: replace with the owner's real WhatsApp number (country code, no + or spaces)
const WHATSAPP_NUMBER = "971XXXXXXXXX";
const MESSAGE = encodeURIComponent("Hi Sabar by Simran! I'd love some help with my order 🌸");

export default function WhatsAppButton() {
  return (
    <a
      href={`https://wa.me/${WHATSAPP_NUMBER}?text=${MESSAGE}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="group fixed bottom-6 right-6 z-50 flex items-center gap-3"
    >
      {/* Tooltip */}
      <span
        className="pointer-events-none hidden translate-x-3 whitespace-nowrap rounded-full border border-white/60 bg-white/40 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-darkText opacity-0 shadow-[0_8px_32px_rgba(0,0,0,0.08)] backdrop-blur-xl transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100 sm:block"
      >
        Chat with us
      </span>

      {/* Button */}
      <span className="relative flex h-14 w-14 animate-bounce items-center justify-center rounded-full border border-white/50 bg-[rgba(37,211,102,0.85)] text-white shadow-[0_10px_30px_rgba(37,211,102,0.45),inset_0_1px_1px_rgba(255,255,255,0.6)] backdrop-blur-md transition-all duration-300 [animation-duration:2.2s] group-hover:scale-110 group-hover:animate-none group-hover:bg-[#25D366] group-active:scale-95 group-focus-visible:ring-4 group-focus-visible:ring-white/70">
        {/* soft ping ring */}
        <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-[#25D366]/40 [animation-duration:2.5s] group-hover:hidden" aria-hidden="true" />
        <svg viewBox="0 0 32 32" className="h-7 w-7" fill="currentColor" aria-hidden="true">
          <path d="M16.004 3C8.82 3 3 8.82 3 16c0 2.29.6 4.53 1.74 6.5L3 29l6.68-1.7A12.95 12.95 0 0016.004 29C23.18 29 29 23.18 29 16S23.18 3 16.004 3zm0 23.6c-2.03 0-4.02-.55-5.75-1.58l-.41-.24-3.96 1.01 1.06-3.86-.27-.4A10.56 10.56 0 015.4 16c0-5.85 4.76-10.6 10.6-10.6S26.6 10.15 26.6 16 21.85 26.6 16.004 26.6zm5.81-7.94c-.32-.16-1.89-.93-2.18-1.04-.29-.11-.5-.16-.72.16-.21.32-.82 1.04-1.01 1.25-.19.21-.37.24-.69.08-.32-.16-1.35-.5-2.57-1.59-.95-.85-1.59-1.9-1.78-2.22-.19-.32-.02-.49.14-.65.14-.14.32-.37.48-.56.16-.19.21-.32.32-.53.11-.21.05-.4-.03-.56-.08-.16-.72-1.73-.98-2.37-.26-.62-.52-.54-.72-.55h-.61c-.21 0-.56.08-.85.4-.29.32-1.12 1.09-1.12 2.66s1.15 3.09 1.31 3.3c.16.21 2.26 3.45 5.47 4.84.76.33 1.36.53 1.83.68.77.24 1.47.21 2.02.13.62-.09 1.89-.77 2.16-1.52.27-.75.27-1.39.19-1.52-.08-.13-.29-.21-.61-.37z" />
        </svg>
      </span>
    </a>
  );
}
