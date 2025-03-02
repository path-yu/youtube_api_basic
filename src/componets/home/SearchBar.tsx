"use client";

import { LogOut, PlusIcon, Search, Settings } from "lucide-react";
import { FormEvent, useState } from "react";
import { SearchBarProps } from "../../app/types/search";
import obverser from "@/utils/obverser";
import AddComment from "./AddComment";
import CommentTemplatesDialog from "./CommentTemplatesDialog";
import IconButton from "@mui/material/IconButton";
import { useRouter } from "next/navigation";
import { logout } from "@/utils/fetchGoogleApi";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MenuIcon from "@mui/icons-material/Menu";
import Button from "@mui/material/Button";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

export default function SearchBar(props: SearchBarProps) {
  const { placeholder = "搜索" } = props;
  const [searchValue, setSearchValue] = useState("");
  const [btnLoading, setBtnLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isAddCommentOpen, setIsAddCommentOpen] = useState(false);
  const [isTemplatesOpen, setIsTemplatesOpen] = useState(false);
  const router = useRouter();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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
      handleMenuClose();
    }
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        px: 3,
        pt: "12px",
        position: "sticky",
        top: 0,
        zIndex: 99,
      }}
    >
      <TextField
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        placeholder={placeholder}
        variant="outlined"
        size="small"
        sx={{ mr: 2, maxWidth: "600px", flexGrow: 1 }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              {searchValue && (
                <IconButton
                  aria-label="清除搜索"
                  onClick={() => setSearchValue("")}
                  edge="end"
                  size="small"
                >
                  <ClearIcon />
                </IconButton>
              )}
              <IconButton
                aria-label="搜索"
                onClick={handleSubmit}
                edge="end"
                size="small"
              >
                <SearchIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      {isMobile ? (
        <>
          <IconButton onClick={handleMenuClick} aria-label="更多选项">
            <MenuIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={() => setIsAddCommentOpen(true)}>
              <PlusIcon style={{ marginRight: 8 }} />
              添加评论
            </MenuItem>
            <MenuItem onClick={() => setIsTemplatesOpen(true)}>
              <Settings style={{ marginRight: 8 }} />
              评论模板设置
            </MenuItem>
            <MenuItem onClick={handleLogOut} disabled={btnLoading}>
              {btnLoading ? (
                <CircularProgress size={20} sx={{ mr: 1 }} />
              ) : (
                <LogOut style={{ marginRight: 8 }} />
              )}
              退出登录
            </MenuItem>
          </Menu>
          <AddComment
            isOpen={isAddCommentOpen}
            onClose={() => setIsAddCommentOpen(false)}
          />
          <CommentTemplatesDialog
            open={isTemplatesOpen}
            onClose={() => setIsTemplatesOpen(false)}
          />
        </>
      ) : (
        <>
          <AddComment />
          <Button
            variant="outlined"
            color="primary"
            onClick={() => setIsTemplatesOpen(true)}
            sx={{ mx: 1 }}
          >
            模板设置
          </Button>
          <IconButton
            color="primary"
            onClick={handleLogOut}
            disabled={btnLoading}
          >
            {btnLoading ? <CircularProgress size={20} /> : <LogOut />}
          </IconButton>
          {/* 在桌面端显式渲染 Dialog */}
          <CommentTemplatesDialog
            open={isTemplatesOpen}
            onClose={() => setIsTemplatesOpen(false)}
          />
        </>
      )}
    </Box>
  );
}
