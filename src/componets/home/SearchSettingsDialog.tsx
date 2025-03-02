// components/SearchSettingsDialog.tsx
"use client";

import { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import useAppStore from "@/app/store";

interface SearchSettingsDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function SearchSettingsDialog({
  open,
  onClose,
}: SearchSettingsDialogProps) {
  const { searchSettings, setSearchSettings } = useAppStore();
  const [localSettings, setLocalSettings] = useState(searchSettings);

  const handleSave = () => {
    setSearchSettings(localSettings); // 保存到 Zustand
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>默认搜索设置</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label="默认搜索关键字"
          value={localSettings.defaultQuery}
          onChange={(e) =>
            setLocalSettings({ ...localSettings, defaultQuery: e.target.value })
          }
          variant="outlined"
          sx={{ mt: 2 }}
        />
        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel>上传日期</InputLabel>
          <Select
            value={localSettings.uploadDate}
            onChange={(e) =>
              setLocalSettings({ ...localSettings, uploadDate: e.target.value })
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
          <InputLabel>时长</InputLabel>
          <Select
            value={localSettings.duration}
            onChange={(e) =>
              setLocalSettings({ ...localSettings, duration: e.target.value })
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
            value={localSettings.order}
            onChange={(e) =>
              setLocalSettings({ ...localSettings, order: e.target.value })
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
        <Button onClick={onClose}>取消</Button>
        <Button onClick={handleSave} color="primary">
          保存
        </Button>
      </DialogActions>
    </Dialog>
  );
}
