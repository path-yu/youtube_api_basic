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
import { Textarea, Input } from "@nextui-org/input"; // 引入 Input 组件
import { useState } from "react";
import useAppStore from "../../app/store";
import { Progress } from "@nextui-org/progress";
import { sleep } from "@/utils";
import { insertComment } from "@/utils/fetchGoogleApi";

export default function AddComment() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  // 添加时间范围状态
  const [minDelay, setMinDelay] = useState<number>(5); // 默认最小延迟 5 分钟
  const [maxDelay, setMaxDelay] = useState<number>(10); // 默认最大延迟 10 分钟

  const list = useAppStore((state) => state.selectedVideoList);

  const handleSubmit = async (onClose: () => void) => {
    // 校验时间范围
    if (minDelay < 0 || maxDelay < 0 || minDelay > maxDelay) {
      alert("请确保最小延迟和最大延迟为正数，且最小延迟不大于最大延迟");
      return;
    }

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
      // 使用用户设置的最小和最大延迟（转换为毫秒）
      const delayMs = Math.floor(
        Math.random() * (maxDelay * 60000 - minDelay * 60000 + 1) +
          minDelay * 60000
      );
      console.log(`Adding comment to ${videoId} after ${delayMs} milliseconds`);
      await sleep(delayMs);
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
        <PlusIcon />
      </Button>
      <Modal isDismissable={false} isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                添加评论
              </ModalHeader>
              <ModalBody>
                {progress !== 0 && (
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
                {/* 时间范围设置 */}
                <div className="flex gap-4 mt-2">
                  <Input
                    type="number"
                    label="最小延迟 (分钟)"
                    value={minDelay.toString()}
                    onChange={(e) => setMinDelay(Number(e.target.value))}
                    min={0}
                    step={1}
                    className="w-1/2"
                  />
                  <Input
                    type="number"
                    label="最大延迟 (分钟)"
                    value={maxDelay.toString()}
                    onChange={(e) => setMaxDelay(Number(e.target.value))}
                    min={0}
                    step={1}
                    className="w-1/2"
                  />
                </div>
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
