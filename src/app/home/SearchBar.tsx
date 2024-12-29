"use client";

import { Search } from "lucide-react";
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
    <div className="flex justify-center px-3 pt-3 sticky top-0">
      <div className="search-container">
        <input
          onChange={(e) => setSearchValue(e.target.value)}
          type="search"
          placeholder={placeholder}
          value={searchValue}
          className="search-input"
        />
        <button
          onClick={handleSubmit}
          className="search-button"
          aria-label="搜索"
        >
          <Search className="search-icon" />
        </button>
        <style jsx>{`
          .search-container {
            position: relative;
            width: 100%;
            max-width: 600px;
          }

          .search-input {
            width: 100%;
            height: 40px;
            padding: 8px 40px 8px 16px;
            background-color: rgba(32, 32, 32, 0.9);
            border: none;
            border-radius: 20px;
            color: #fff;
            font-size: 14px;
            outline: none;
            transition: background-color 0.2s ease;
          }

          .search-input::placeholder {
            color: #888;
          }

          .search-input:focus {
            background-color: rgba(40, 40, 40, 0.95);
          }

          .search-button {
            position: absolute;
            right: 8px;
            top: 50%;
            transform: translateY(-50%);
            background: none;
            border: none;
            padding: 8px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .search-icon {
            width: 20px;
            height: 20px;
            color: #888;
            transition: color 0.2s ease;
          }

          .search-button:hover .search-icon {
            color: #fff;
          }

          /* Remove default search input styles */
          .search-input::-webkit-search-decoration,
          .search-input::-webkit-search-cancel-button,
          .search-input::-webkit-search-results-button,
          .search-input::-webkit-search-results-decoration {
            display: none;
          }
        `}</style>
      </div>
    </div>
  );
}
