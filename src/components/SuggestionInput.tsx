"use client"

import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import React, { type ChangeEvent, SyntheticEvent, useState } from "react"

import { truncateId } from "@/utils/data-utils"

const SuggestionInput = ({ eventsIds }: { eventsIds: string[] }) => {
  const [isInputFocused, setIsInputFocused] = useState(false)
  const [inputValue, setInputValue] = useState("")
  const { push } = useRouter()

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value)
  }

  const handleSelectChange = (newValue: string) => {
    setInputValue(newValue)
  }

  const handleInputFocus = () => {
    setIsInputFocused(true)
  }

  const handleInputBlur = () => {
    setTimeout(() => {
      setIsInputFocused(false)
    }, 0)
  }

  const handleKeyDown = (e: any) => {
    if (e.code === "Enter") {
      push(`/${inputValue}`)
    }
  }
  return (
    <div>
      <div className="dropdown relative w-full">
        <input
          role="button"
          placeholder="Search...."
          className="bg-background border border-[#222326] w-full py-[28px] px-[32px] outline-none focus:border-transparent z-50 relative"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          onKeyDown={handleKeyDown}
        />
        <Image
          width={28}
          height={28}
          alt="search"
          className="absolute right-[32px] top-1/2 -translate-y-1/2 text-[18px] z-[51]"
          src="/search.svg"
        />
        <div tabIndex={0} className="dropdown-content z-50 w-full">
          <ul className="mt-[10px] z-50 relative max-h-[200px] overflow-y-scroll">
            {eventsIds
              .filter((item) => item.includes(inputValue))
              .map((suggestion) => (
                <li
                  key={suggestion}
                  // onClick={() => {
                  //   handleSelectChange(suggestion);
                  // }}
                  className="cursor-pointer p-[8px] bg-background flex justify-between"
                >
                  <Link href={`/message/${suggestion}`} className="w-full">
                    <div className="flex justify-between w-full">
                      <p>{truncateId(suggestion)}</p>
                      <p>{Math.random().toFixed(5)}</p>
                    </div>
                  </Link>
                </li>
              ))}
          </ul>
        </div>
      </div>
      {isInputFocused && (
        <div
          className={`fixed top-0 left-0 w-full h-full bg-[#0000004d] z-[1]`}
        ></div>
      )}
    </div>
  )
}

export default SuggestionInput
