export default function TopBar() {
  return (
    <div className="w-full h-10 md:h-11 bg-[#0E5D47] text-white flex items-center z-[60] relative">
      <div className="container-wide w-full flex items-center text-xs md:text-sm font-medium tracking-wide relative">
        
        {/* Mobile text (truncates if too long) */}
        <div className="flex md:hidden items-center gap-2 pr-4 min-w-0 flex-1">
          <span className="truncate">PREMIUM DIGITAL SERVICES. START YOUR PROJECT TODAY.</span>
        </div>

        {/* Desktop absolutely centered text */}
        <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-2 whitespace-nowrap pointer-events-none">
          <span>PREMIUM DIGITAL SERVICES. START YOUR PROJECT TODAY.</span>
        </div>

        {/* Right side contact info */}
        <div className="flex items-center gap-4 sm:gap-6 text-sm font-medium tracking-wide ml-auto">
          <a href="mailto:info@prepoc.in" aria-label="Email Support" className="flex items-center gap-2 hover:text-[#D4AF37] transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-px after:bg-[#D4AF37] hover:after:w-full after:transition-all">
            <svg aria-hidden="true" className="w-4 h-4" viewBox="0 0 512 512" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M144 208c-17.7 0-32 14.3-32 32s14.3 32 32 32 32-14.3 32-32-14.3-32-32-32zm112 0c-17.7 0-32 14.3-32 32s14.3 32 32 32 32-14.3 32-32-14.3-32-32-32zm112 0c-17.7 0-32 14.3-32 32s14.3 32 32 32 32-14.3 32-32-14.3-32-32-32zM256 32C114.6 32 0 125.1 0 240c0 47.6 19.9 91.2 52.9 126.3C38 405.7 7 439.1 6.5 439.5c-6.6 7-8.4 17.2-4.6 26S14.4 480 24 480c61.5 0 110-25.7 139.1-46.3C192 442.8 223.2 448 256 448c141.4 0 256-93.1 256-208S397.4 32 256 32zm0 368c-26.7 0-53.1-4.1-78.4-12.1l-22.7-7.2-19.5 13.8c-14.3 10.1-33.9 21.4-57.5 29 7.3-12.1 14.4-25.7 19.9-40.2l10.6-28.1-20.6-21.8C69.7 314.1 48 282.2 48 240c0-88.2 93.3-160 208-160s208 71.8 208 160-93.3 160-208 160z"></path></svg>
            <span className="hidden md:inline">Support</span>
          </a>
          <a href="tel:+919072595415" aria-label="Call Support" className="flex items-center gap-2 hover:text-[#D4AF37] transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-px after:bg-[#D4AF37] hover:after:w-full after:transition-all">
            <svg aria-hidden="true" className="w-4 h-4" viewBox="0 0 512 512" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M493.4 24.6l-104-24c-11.3-2.6-22.9 3.3-27.5 13.9l-48 112c-4.2 9.8-1.4 21.3 6.9 28l60.6 49.6c-36 76.7-98.9 140.5-177.2 177.2l-49.6-60.6c-6.8-8.3-18.2-11.1-28-6.9l-112 48C3.9 366.5-2 378.1.6 389.4l24 104C27.1 504.2 36.7 512 48 512c256.1 0 464-207.5 464-464 0-11.2-7.7-20.9-18.6-23.4z"></path></svg>
            <span className="hidden sm:inline">+91 9072595415</span>
          </a>
        </div>
      </div>
    </div>
  )
}
