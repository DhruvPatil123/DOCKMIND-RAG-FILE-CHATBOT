export default function BrandLogo({ className = "", ariaLabel = "DocMind" }) {
  return (
    <div className={`flex items-center justify-center rounded-3xl bg-gradient-to-br from-indigo-500 via-violet-500 to-cyan-400 shadow-[0_0_28px_rgba(99,102,241,0.24)] ${className}`} aria-label={ariaLabel}>
      <svg viewBox="0 0 28 28" className="h-6 w-6 text-white" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M7 4.5h9.5L22 9.5V22.5H7V4.5Z" fill="currentColor" fillOpacity="0.1" />
        <path d="M7 4.5h9.5L22 9.5V22.5H7V4.5Z" stroke="currentColor" strokeWidth="1.6" />
        <path d="M16.5 4.5V9.5H21.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M10.5 14.5L13.5 17.5L17.5 13.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}
