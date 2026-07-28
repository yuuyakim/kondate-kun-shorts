import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setCodec("h264");

// Instagram / TikTok は h264 + AAC を素直に受ける。凝ったコーデックにしない
Config.setCrf(18);
