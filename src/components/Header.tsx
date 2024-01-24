"use client";

import Image from "next/image";

const Header = () => {
  return (
    <div className="navbar !bg-[#FAF7F3]">
      <div className="navbar-start">
        <div className="flex items-center gap-1">
          <Image
            alt="aoscan"
            width={20}
            height={20}
            src="aoscan.svg"
            className="inline-block h-[20px]"
          />
          <Image
            alt="ao"
            width={20}
            height={20}
            src="ao.svg"
            className="inline-block h-[20px]"
          />
        </div>
        <ul className="menu menu-horizontal px-[24px] nav-bar-button flex gap-[32px]">
          <li>
            <a>Scan</a>
          </li>
          <li>
            <a>Spec</a>
          </li>
        </ul>
      </div>

      <div className="navbar-end">
        <a className="nav-bar-button btn-ghost btn">Try it now</a>
      </div>
    </div>
  );
};

export default Header;
