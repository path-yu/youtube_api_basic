"use client";

import { Delete, LogOut, Search } from "lucide-react";
import { FormEvent, useState } from "react";
import { SearchBarProps } from "../types/search";
import obverser from "@/ultis/obverser";
import AddComment from "./AddComment";
import { Button } from "@nextui-org/button";
import { logOutAction } from "@/action";
import { useRouter } from "next/navigation";

export default function SearchBar(props: SearchBarProps) {
  const { placeholder = "搜索" } = props;
  const [searchValue, setSearchValue] = useState("");
  const [btnLoading, setBtnLoading] = useState(false);
  const router = useRouter();
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    obverser.emit("search", searchValue);
  };
  function clearStorage() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("expires_in");
    localStorage.removeItem("scope");
    localStorage.removeItem("token_type");
  }
  const handleLogOut = async () => {
    try {
      setBtnLoading(true);
      await logOutAction();
    } catch (error) {
    } finally {
      setBtnLoading(false);
      clearStorage();
      router.push("/");
    }
  };
  return (
    <div className="flex justify-center px-3 pt-3 sticky top-0 z-99 ">
      <div className="search-container mr-2">
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
      <AddComment></AddComment>
      <Button
        isLoading={btnLoading}
        color="primary"
        isIconOnly
        onPress={handleLogOut}
        className="ml-2"
      >
        <LogOut></LogOut>
      </Button>
    </div>
  );
}
