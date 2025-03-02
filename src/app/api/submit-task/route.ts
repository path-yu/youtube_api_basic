import { NextResponse } from "next/server";

async function runBackgroundTask() {
  // 模拟长时间任务
  await new Promise((resolve) => setTimeout(resolve, 10000));
  console.log("Background task completed");
}

export async function POST(request: Request) {
  runBackgroundTask(); // 不等待，直接执行
  return NextResponse.json({ message: "Task started" }, { status: 200 });
}
