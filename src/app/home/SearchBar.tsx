"use client";

import { Delete, DeleteIcon, Search } from "lucide-react";
import { FormEvent, useState } from "react";
import { SearchBarProps } from "../types/search";
import obverser from "@/ultis/obverser";

export default function SearchBar(props: SearchBarProps) {
  const { placeholder = "搜索" } = props;
  const [searchValue, setSearchValue] = useState("");
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    obverser.emit("search", searchValue);
  };
  return (
    <div className="">
      <div className="flex justify-center px-3 pt-3 sticky top-0 z-99 ">
        <div className="search-container">
          <input
            onChange={(e) => setSearchValue(e.target.value)}
            type="search"
            placeholder={placeholder}
            value={searchValue}
            className="search-input"
          />
          <button className="search-button" aria-label="搜索">
            {searchValue ? (
              <Delete
                onClick={() => setSearchValue("")}
                className="delete-icon "
              ></Delete>
            ) : null}

            <Search onClick={handleSubmit} className="search-icon ml-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
