"use client";

import obverser from "@/utils/obverser";
import { useEffect, useState } from "react";
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

export interface VideoListProps {}

const VideoList = (props: VideoListProps) => {
  const list = useAppStore((state) => state.videoList);
  const setList = useAppStore((state) => state.setVideoList);
  const setSelectedVideoList = useAppStore(
    (state) => state.setSelectedVideoList
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    uploadDate: "",
    type: "video",
    duration: "",
    features: [],
    order: "relevance",
  });

  async function fetchVideos(query = "crypto wallet") {
    try {
      const params: any = {
        part: "snippet",
        q: query,
        maxResults: "100",
        type: filters.type,
        order: filters.order,
      };

      // 上传日期过滤
      if (filters.uploadDate) {
        const now = new Date();
        let publishedAfter: string | undefined;
        switch (filters.uploadDate) {
          case "lastHour":
            publishedAfter = new Date(
              now.getTime() - 60 * 60 * 1000
            ).toISOString();
            break;
          case "today":
            publishedAfter = new Date(now.setHours(0, 0, 0, 0)).toISOString();
            break;
          case "thisWeek":
            publishedAfter = new Date(
              now.getTime() - 7 * 24 * 60 * 60 * 1000
            ).toISOString();
            break;
          case "thisMonth":
            publishedAfter = new Date(
              now.getFullYear(),
              now.getMonth(),
              1
            ).toISOString();
            break;
          case "thisYear":
            publishedAfter = new Date(now.getFullYear(), 0, 1).toISOString();
            break;
        }
        if (publishedAfter) params.publishedAfter = publishedAfter;
      }

      // 时长过滤
      if (filters.duration) {
        params.videoDuration = filters.duration;
      }

      const data = await fetchGoogleApi({
        endpoint: "youtube/v3/search",
        params,
      });
      setList(data.items as YouTubeVideo[]);
    } catch (err) {
      setError((err as Error).message);
    }
  }

  useEffect(() => {
    fetchVideos();
    obverser.on("search", async (value: any) => {
      setLoading(true);
      await fetchVideos(value);
      setSelectedVideoList([]);
      setSelected([]);
      setLoading(false);
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
          height: "100vh",
        }}
      >
        <Typography color="error">{error}</Typography>
        <Link href="/" style={{ textDecoration: "none" }}>
          <Typography color="primary">返回首页</Typography>
        </Link>
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
      key={item.id.videoId}
      control={
        <Checkbox
          value={item.id.videoId}
          checked={selected.includes(item.id.videoId)}
          onChange={(e) =>
            handleCheckboxChange(item.id.videoId, e.target.checked)
          }
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
            const isChecked = selected.includes(item.id.videoId);
            handleCheckboxChange(item.id.videoId, !isChecked);
          }}
        >
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <img
                src={item.snippet.thumbnails.default.url}
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
                  {item.snippet.title}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {item.snippet.description}
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
                  {formateNow(item.snippet.publishTime)}
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
          width: { xs: "85vw", sm: 600 },
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
                  const result = list.map((item) => item.id.videoId);
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
        <Box sx={{ mt: 2, width: "100%" }}>{listJSX}</Box>
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
              <MenuItem value="">任意时间</MenuItem>
              <MenuItem value="lastHour">过去 1 小时</MenuItem>
              <MenuItem value="today">今天</MenuItem>
              <MenuItem value="thisWeek">本周</MenuItem>
              <MenuItem value="thisMonth">本月</MenuItem>
              <MenuItem value="thisYear">今年</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>类型</InputLabel>
            <Select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
            >
              <MenuItem value="video">视频</MenuItem>
              <MenuItem value="channel">频道</MenuItem>
              <MenuItem value="playlist">播放列表</MenuItem>
              <MenuItem value="movie">电影</MenuItem>
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
              <MenuItem value="">任意时长</MenuItem>
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
              <MenuItem value="date">上传日期</MenuItem>
              <MenuItem value="viewCount">观看次数</MenuItem>
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
