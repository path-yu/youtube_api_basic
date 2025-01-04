"use client";
import { Button } from "@nextui-org/button";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/modal";
import { PlusIcon } from "lucide-react";
import { Textarea } from "@nextui-org/input";
import { useState } from "react";
import useAppStore from "../store";
import { insertComment } from "@/action";
export default function AddComment() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [comment, setComment] = useState("非常好的视频");
  const [loading, setLoading] = useState(false);
  const list = useAppStore((state) => state.videoList);
  const handleSubmit = async (onClose: () => void) => {
    // message.info("success");
    setLoading(true);
    // 每隔2s添加评论请求
    const res = await insertComment(
      list[0].id.videoId,
      comment || "非常好的视频"
    );
    console.log(res);

    if (!res) {
      // message.error("添加评论失败");
    }
    onClose();
    setLoading(false);
  };

  return (
    <div className="fixed top-[45vh] right-[20px]">
      <Button
        color="primary"
        onPress={onOpen}
        isIconOnly
        style={{
          borderRadius: "50%",
          height: "60px",
          width: "60px",
        }}
      >
        <PlusIcon></PlusIcon>
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                添加评论
              </ModalHeader>
              <ModalBody>
                <Textarea
                  value={comment}
                  onValueChange={setComment}
                  placeholder="输入你的评论"
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  取消
                </Button>
                <Button
                  isLoading={loading}
                  color="primary"
                  onPress={() => handleSubmit(onClose)}
                >
                  提交
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
