'use client';

import { Image } from "antd";
import Link from "next/link";

const Navbar = () => {
  return (
    <div className="flex w-full h-16 text-white bg-blue-950 items-center justify-start pl-10 shadow-[0_4px_6px_rgba(0,0,0,0.1)]">
  <div className=" flex items-center h-full"> {/* Añade h-full aquí */}
    <Link href={'/'} className="h-full flex items-center"> {/* Añade clases al Link */}
      <Image
        src="/assets/logo.jpg"
        width={70}
        height={70}
        className="object-contain h-full w-auto rounded-full" // Modifica estas clases
        preview={false}
      />
    </Link>
  </div>
</div>
  )
}

export default Navbar;