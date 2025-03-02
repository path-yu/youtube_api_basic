"use client";

import { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Box from "@mui/material/Box";
import useAppStore from "../../app/store";
import Typography from "@mui/material/Typography";

interface CommentTemplatesDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function CommentTemplatesDialog({
  open,
  onClose,
}: CommentTemplatesDialogProps) {
  const [templateContent, setTemplateContent] = useState("");
  const [editId, setEditId] = useState<string | null>(null);

  const {
    commentTemplates,
    addCommentTemplate,
    removeCommentTemplate,
    updateCommentTemplate,
  } = useAppStore();
  const handleAddOrUpdate = () => {
    if (templateContent.trim()) {
      if (editId) {
        updateCommentTemplate(editId, templateContent);
        setEditId(null);
      } else {
        addCommentTemplate(templateContent);
      }
      setTemplateContent("");
    }
  };

  const handleEdit = (id: string, content: string) => {
    setEditId(id);
    setTemplateContent(content);
  };

  const handleClear = () => {
    setTemplateContent("");
    setEditId(null);
  };

  const handleCancel = () => {
    setTemplateContent("");
    setEditId(null);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>评论模板设置</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            label={editId ? "编辑模板" : "新增模板"}
            value={templateContent}
            onChange={(e) => setTemplateContent(e.target.value)}
            variant="filled"
            multiline
            rows={3}
            size="small"
            onKeyPress={(e) =>
              e.key === "Enter" && !e.shiftKey && handleAddOrUpdate()
            }
          />
          <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
            <Button
              onClick={handleAddOrUpdate}
              variant="contained"
              color="primary"
            >
              {editId ? "更新" : "添加"}
            </Button>
            <Button onClick={handleClear} variant="outlined" color="secondary">
              清空
            </Button>
            {editId && (
              <Button onClick={handleCancel} variant="outlined" color="error">
                取消
              </Button>
            )}
          </Box>
        </Box>
        <List>
          {commentTemplates.map((template) => (
            <ListItem
              key={template.id}
              secondaryAction={
                <Box sx={{ display: "flex", gap: 1 }}>
                  <IconButton
                    edge="end"
                    onClick={() => handleEdit(template.id, template.content)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    edge="end"
                    onClick={() => removeCommentTemplate(template.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              }
              sx={{ pr: 12 }}
            >
              <Typography
                variant="body1"
                sx={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {template.content}
              </Typography>
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          关闭
        </Button>
      </DialogActions>
    </Dialog>
  );
}
