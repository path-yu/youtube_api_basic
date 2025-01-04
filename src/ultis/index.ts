import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime"; // ES 2015
import "dayjs/locale/zh-cn"; // ES 2015
dayjs.extend(relativeTime);
dayjs.locale("zh-cn"); // 全局使用
export function formateNow(date: string | number) {
  return dayjs(date).fromNow();
}
export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
