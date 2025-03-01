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
import useAppStore from "../../app/store";
import { Progress } from "@nextui-org/progress";
import { sleep } from "@/utils";
import { insertComment } from "@/utils/fetchGoogleApi";

export default function AddComment() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const list = useAppStore((state) => state.selectedVideoList);
  // 发送评论进度
  const [progress, setProgress] = useState(0);
  const handleSubmit = async (onClose: () => void) => {
    setLoading(true);
    setProgress(0);
    addCommentsWithRandomDelay(list, comment, onClose);
  };
  async function addCommentsWithRandomDelay(
    videoIds: string[],
    comment: string,
    onClose: () => void
  ) {
    for (const videoId of videoIds) {
      /// 生成5-10分钟的随机延迟（单位：毫秒）
      // const delay = Math.floor(Math.random() * (600000 - 300000 + 1)) + 300000;
      const delay = 2000;
      console.log(`Adding comment to ${videoId} after ${delay} milliseconds`);
      await sleep(delay);
      setProgress((prev) => prev + 100 / videoIds.length);
      await insertComment(videoId, comment);
    }
    setLoading(false);
    setProgress(0);
    onClose();
  }

  return (
    <div className="">
      <Button color="primary" onPress={onOpen} isIconOnly>
        <PlusIcon></PlusIcon>
      </Button>
      <Modal isDismissable={false} isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                添加评论
              </ModalHeader>
              <ModalBody>
                {progress != 0 && (
                  <Progress
                    aria-label="正在发送评论..."
                    className="max-w-md"
                    color="success"
                    showValueLabel={true}
                    size="md"
                    value={progress}
                  />
                )}
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
