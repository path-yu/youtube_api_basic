"use client";

import obverser from "@/utils/obverser";
import { useEffect, useRef, useState } from "react";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import CircularProgress from "@mui/material/CircularProgress";
import useAppStore from "../../app/store";
import Link from "next/link";
import { formateNow } from "@/utils";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { YouTubeVideo } from "../../app/types/api";
import { fetchGoogleApi } from "@/utils/fetchGoogleApi";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FilterListIcon from "@mui/icons-material/FilterList";
import { getPublishedAfter } from "@/utils/dateUtils";

export interface VideoListProps {}

const VideoList = (props: VideoListProps) => {
  const list = useAppStore((state) => state.videoList);
  const setList = useAppStore((state) => state.setVideoList);
  const setSelectedVideoList = useAppStore(
    (state) => state.setSelectedVideoList
  );
  const defaultSettings = useAppStore((state) => state.searchSettings);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    uploadDate: "",
    type: "video",
    duration: "",
    order: "relevance",
  });
  const filtersRef = useRef(filters);

  // 每次 filters 变化都更新 ref.current
  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);
  async function fetchVideos(query = "crypto wallet", init = false) {
    try {
      setLoading(true); //
      const currentFilters = filtersRef.current;

      const urlParams = new URLSearchParams();
      urlParams.append("query", query);
      urlParams.append("type", currentFilters.type);
      urlParams.append("duration", currentFilters.duration);
      urlParams.append("upload_date", currentFilters.uploadDate);
      urlParams.append("sort_by", currentFilters.order);
      if (!query) {
        return;
      }
      const data = await fetch(`/api/search?${urlParams.toString()}`, {
        method: "GET",
      });
      const list = await data.json();
      if (list.error) {
        throw new Error(list.error);
      }
      setList(list as any);
    } catch (err: any) {
      const errorMessage =
        err.message ||
        (err.error && err.error.message) ||
        "Unknown error occurred";
      const detailedMessage =
        err.details && err.details.length > 0
          ? `${errorMessage} - ${err.details.join(", ")}`
          : errorMessage;
      setError(detailedMessage);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchVideos(defaultSettings.defaultQuery, true);
    obverser.on("search", async (value: any) => {
      setList([]);
      setError(null);
      setSelectedVideoList([]);
      setSelected([]);
      await fetchVideos(value);
      setIsAllSelected(false);
    });
  }, []);

  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "70vh",
          padding: "0 5px",
        }}
      >
        <Typography color="error" textAlign="center">
          {error}
        </Typography>
        {/* <Link href="/" style={{ textDecoration: "none" }}>
          <Typography color="primary">返回首页</Typography>
        </Link> */}
      </Box>
    );
  }

  const handleCheckboxChange = (value: string, checked: boolean) => {
    const newSelected = checked
      ? [...selected, value]
      : selected.filter((id) => id !== value);
    setSelected(newSelected);
    setSelectedVideoList(newSelected);
    setIsAllSelected(newSelected.length === list.length);
  };

  const handleFilterOpen = () => setFilterOpen(true);
  const handleFilterClose = () => setFilterOpen(false);

  const handleFilterApply = () => {
    fetchVideos(); // 应用过滤参数重新获取数据
    handleFilterClose();
  };

  const listJSX = list.map((item) => (
    <FormControlLabel
      key={item.id}
      control={
        <Checkbox
          value={item.id}
          checked={selected.includes(item.id)}
          onChange={(e) => handleCheckboxChange(item.id, e.target.checked)}
          onClick={(e) => e.stopPropagation()}
        />
      }
      label={
        <Card
          sx={{
            mt: 2,
            width: { xs: "85vw", sm: 600 },
            cursor: "pointer",
          }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            const isChecked = selected.includes(item.id);
            handleCheckboxChange(item.id, !isChecked);
          }}
        >
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <img
                src={item.cover}
                alt="Channel Logo"
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  marginRight: 16,
                }}
              />
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: "bold",
                    color: "#fff",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {item.title}
                </Typography>

                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {item.published_at}
                </Typography>
                {/* view count */}
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ paddingLeft: "5px" }}
                >
                  {item.viewCount}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      }
      sx={{ mb: 0, width: "100%" }}
    />
  ));

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        px: { xs: 1, sm: 0 },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: { xs: "100vw", sm: 600 },
          mb: 2,
        }}
      >
        <FormControlLabel
          control={
            <Checkbox
              checked={isAllSelected}
              onChange={(e) => {
                const value = e.target.checked;
                setIsAllSelected(value);
                if (value) {
                  const result = list.map((item) => item.id);
                  setSelected(result);
                  setSelectedVideoList(result);
                } else {
                  setSelected([]);
                  setSelectedVideoList([]);
                }
              }}
            />
          }
          label={isAllSelected ? "取消全选" : "全选"}
        />
        <Typography variant="body1" color="text.secondary" sx={{ pl: 1 }}>
          点击选择视频进行评论
        </Typography>
        <Button
          startIcon={<FilterListIcon />}
          onClick={handleFilterOpen}
          sx={{ ml: 2 }}
        >
          过滤
        </Button>
      </Box>
      {loading ? (
        <Box sx={{ display: "flex", alignItems: "center", height: "40vh" }}>
          <CircularProgress />
          <Typography sx={{ ml: 2 }}>Loading...</Typography>
        </Box>
      ) : (
        <Box sx={{ mt: 2, width: { xs: "100%", sm: "600px" } }}>{listJSX}</Box>
      )}

      {/* 过滤弹窗 */}
      <Dialog
        open={filterOpen}
        onClose={handleFilterClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>搜索过滤器</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>上传日期</InputLabel>
            <Select
              value={filters.uploadDate}
              onChange={(e) =>
                setFilters({ ...filters, uploadDate: e.target.value })
              }
            >
              {/* <MenuItem value="">任意时间</MenuItem>
              <MenuItem value="lastHour">过去 1 小时</MenuItem>
              <MenuItem value="today">今天</MenuItem>
              <MenuItem value="thisWeek">本周</MenuItem>
              <MenuItem value="thisMonth">本月</MenuItem>
              <MenuItem value="thisYear">今年</MenuItem> */}
              {/* youtube.js api */}
              <MenuItem value="all">任意时间</MenuItem>
              <MenuItem value="hour">过去 1 小时</MenuItem>
              <MenuItem value="today">今天</MenuItem>
              <MenuItem value="week">本周</MenuItem>
              <MenuItem value="month">本月</MenuItem>
              <MenuItem value="year">今年</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>时长</InputLabel>
            <Select
              value={filters.duration}
              onChange={(e) =>
                setFilters({ ...filters, duration: e.target.value })
              }
            >
              <MenuItem value="all">任意时长</MenuItem>
              <MenuItem value="short">4 分钟以下</MenuItem>
              <MenuItem value="medium">4 - 20 分钟</MenuItem>
              <MenuItem value="long">20 分钟以上</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>排序依据</InputLabel>
            <Select
              value={filters.order}
              onChange={(e) =>
                setFilters({ ...filters, order: e.target.value })
              }
            >
              <MenuItem value="relevance">相关程度</MenuItem>
              <MenuItem value="upload_date">上传日期</MenuItem>
              <MenuItem value="view_count">观看次数</MenuItem>
              <MenuItem value="rating">评分</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleFilterClose}>取消</Button>
          <Button onClick={handleFilterApply} color="primary">
            应用
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default VideoList;
