"use client";

import { Delete, LogOut, Search } from "lucide-react";
import { FormEvent, useState } from "react";
import { SearchBarProps } from "../../app/types/search";
import obverser from "@/utils/obverser";
import AddComment from "./AddComment";
import { Button } from "@nextui-org/button";
import { useRouter } from "next/navigation";
import { logout } from "@/utils/fetchGoogleApi";

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
      await logout();
    } catch (error) {
    } finally {
      setBtnLoading(false);
      clearStorage();
      router.push("/");
    }
  };
  return (
    <div
      className="flex justify-center px-3 pt-6 sticky top-0 z-99 "
      style={{ paddingTop: "12px" }}
    >
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
        style={{ marginLeft: "6px" }}
        className="ml-4"
      >
        <LogOut></LogOut>
      </Button>
    </div>
  );
}
