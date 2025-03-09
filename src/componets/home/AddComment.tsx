"use client";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import useAppStore from "../../app/store";
import CircularProgress from "@mui/material/CircularProgress";
import LinearProgress from "@mui/material/LinearProgress";
import { sleep } from "@/utils";
import { insertComment } from "@/utils/fetchGoogleApi";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Checkbox from "@mui/material/Checkbox";
import ListItemText from "@mui/material/ListItemText";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import { useSnackbarStore } from "@/app/store/snackbarStore";

interface AddCommentProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function AddComment({
  isOpen: externalIsOpen,
  onClose: externalOnClose,
}: AddCommentProps = {}) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [minDelay, setMinDelay] = useState(5);
  const [maxDelay, setMaxDelay] = useState(10);
  const [selectedTemplates, setSelectedTemplates] = useState<string[]>([]); // 存储所选模板 ID

  const selectedVideoList = useAppStore((state) => state.selectedVideoList);
  const commentTemplates = useAppStore((state) => state.commentTemplates);
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;

  const { setSnackbar } = useSnackbarStore();

  const handleSubmit = async () => {
    if (!selectedVideoList.length) {
      setSnackbar(true, "请选择视频", "error");
      return;
    }
    if (minDelay < 0 || maxDelay < 0 || minDelay > maxDelay) {
      setSnackbar(
        true,
        "请确保最小延迟和最大延迟为正数，且最小延迟不大于最大延迟",
        "error"
      );
      return;
    }

    setLoading(true);
    setProgress(0);
    await addCommentsWithRandomDelay(selectedVideoList);
    handleClose();
  };

  async function addCommentsWithRandomDelay(videoIds: string[]) {
    for (let i = 0; i < videoIds.length; i++) {
      const videoId = videoIds[i];
      const delayMs =
        i === 0
          ? 0
          : Math.floor(
              Math.random() * (maxDelay * 60000 - minDelay * 60000 + 1) +
                minDelay * 60000
            );

      // 如果选择了模板，随机挑选一个，否则使用输入框内容
      const commentToInsert =
        selectedTemplates.length > 0
          ? commentTemplates.find(
              (t) =>
                t.id ===
                selectedTemplates[
                  Math.floor(Math.random() * selectedTemplates.length)
                ]
            )?.content || ""
          : comment;

      if (!commentToInsert) continue; // 如果没有评论内容，跳过

      console.log(
        `Adding comment to ${videoId} after ${delayMs} milliseconds: ${commentToInsert}`
      );
      await sleep(delayMs);
      setProgress((prev) => prev + 100 / videoIds.length);
      await insertComment(videoId, commentToInsert);
    }
    setSnackbar(true, "评论发送成功", "success");
    await sleep(300);
    setLoading(false);
    setProgress(0);
  }

  const handleOpen = () => {
    setInternalIsOpen(true);
  };

  const handleClose = () => {
    setInternalIsOpen(false);
    // setLoading(false);
    // setProgress(0);
    // setComment("");
    // setSelectedTemplates([]); // 重置所选模板
    if (externalOnClose) {
      externalOnClose();
    }
  };

  const handleTemplateChange = (event: any) => {
    const value = event.target.value as string[];
    setSelectedTemplates(value);
  };

  return (
    <>
      {externalIsOpen === undefined && (
        <IconButton onClick={handleOpen}>
          <PlusIcon />
        </IconButton>
      )}
      <Dialog
        open={isOpen}
        onClose={handleClose}
        disableEscapeKeyDown={false}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>添加评论</DialogTitle>
        <DialogContent>
          {progress !== 0 && (
            <Box sx={{ maxWidth: "100%", mb: 2 }}>
              <LinearProgress
                variant="determinate"
                value={progress}
                color="success"
              />
              <Box sx={{ textAlign: "center", mt: 1 }}>
                {Math.round(progress)}%
              </Box>
            </Box>
          )}
          <TextField
            fullWidth
            multiline
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="输入你的评论（若选择模板则忽略此内容）"
            variant="filled"
            margin="normal"
            disabled={selectedTemplates.length > 0} // 若选择了模板，禁用输入框
          />
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>选择评论模板（多选）</InputLabel>
            <Select
              multiple
              value={selectedTemplates}
              onChange={handleTemplateChange}
              renderValue={(selected) =>
                selected
                  .map((id) => {
                    const content =
                      commentTemplates.find((t) => t.id === id)?.content || "";
                    return content.length > 30
                      ? `${content.slice(0, 30)}...`
                      : content; // 截断显示值
                  })
                  .join(", ")
              }
              variant="outlined"
              MenuProps={{
                PaperProps: {
                  sx: {
                    maxWidth: "400px", // 限制下拉菜单最大宽度
                  },
                },
              }}
            >
              {commentTemplates.map((template) => (
                <MenuItem
                  key={template.id}
                  value={template.id}
                  sx={{
                    maxWidth: "400px", // 限制 MenuItem 宽度
                    whiteSpace: "nowrap", // 单行显示
                    overflow: "hidden", // 超出隐藏
                    textOverflow: "ellipsis", // 显示省略号
                  }}
                >
                  <Checkbox checked={selectedTemplates.includes(template.id)} />
                  <ListItemText
                    primary={template.content}
                    primaryTypographyProps={{
                      sx: {
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      },
                    }}
                  />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
            <TextField
              type="number"
              label="最小延迟 (分钟)"
              value={minDelay}
              onChange={(e) => setMinDelay(Number(e.target.value))}
              variant="outlined"
              size="small"
              sx={{ flex: 1 }}
              inputProps={{ min: 0, step: 1 }}
            />
            <TextField
              type="number"
              label="最大延迟 (分钟)"
              value={maxDelay}
              onChange={(e) => setMaxDelay(Number(e.target.value))}
              variant="outlined"
              size="small"
              sx={{ flex: 1 }}
              inputProps={{ min: 0, step: 1 }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClose}
            color="error"
            variant="text"
            disabled={loading}
          >
            取消
          </Button>
          <Button
            onClick={handleSubmit}
            color="primary"
            variant="contained"
            disabled={loading || (!comment && selectedTemplates.length === 0)}
            startIcon={loading && <CircularProgress size={20} />}
          >
            提交
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
