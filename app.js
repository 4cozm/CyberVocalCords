import discord from "discord.js";
import { GatewayIntentBits, VoiceStateManager } from "discord.js";
import {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
} from "@discordjs/voice";
import dotenv from "dotenv";
import { createReadStream, link } from "fs";
import axios from "axios";
import https from "https";
// import tts from "./tts.js";

dotenv.config();
let connection; //음성 채널 객체
const client = new discord.Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

client.on("ready", () => {
  console.log(`서버 준비됨 ${client.user.tag}!`);
});

client.on("messageCreate", async (msg) => {
  try {
    if (msg.author.bot) return;
    console.log(`메세지: ${msg.content}`);
    if (msg.content === "/설정") {
      setting(msg);
      return;
    }

    if (msg.content === "/성대") {
      joinChannel(msg);
      return;
    }
    if (msg.content === "/나가") {
      outChannel(msg);
      return;
    }

    if (msg.member.voice.channel.id === connection.joinConfig.channelId) {
      await tts(msg.content);
    }

    if (msg.content === "/검증") {
      if (msg.member.voice.channel === "#" + connection.joinConfig.channelId); //봇의 현재 음성 서버 주소
      {
        console.log("같은 방 확인");
        await tts("테스트로직");
      }
    }
  } catch (error) {
    console.log({ 에러: error.message });
  }
});

client.login(process.env.TOKEN);
/* 메세지 관련 처리 기능 구현 */

const setting = (msg) => {
  //TTS의 설정값을 바꿀 수 있는 기능
};

const joinChannel = (msg) => {
  if (!msg.member.voice.channel) {
    msg.reply("사용자가 접속한 채널이 보이지 않습니다");
    return;
  }
  connection = joinVoiceChannel({
    channelId: msg.member.voice.channel.id,
    guildId: msg.guild.id,
    adapterCreator: msg.guild.voiceAdapterCreator,
  });

  msg.reply(
    `사이버 성대 장착! 현재 메세지를 빠르게 입력하면 처음것이 짤리는 문제가 있으니 도배ㄴ , 분당 30쿼리 , 시간당 300쿼리`
  );
};

const outChannel = (msg) => {
  if (!msg.member.voice.channel) {
    msg.reply("채널 밖에서는 컨트롤 할 수 없습니다");
    return;
  }
  connection = joinVoiceChannel({
    channelId: msg.member.voice.channel.id,
    guildId: msg.guild.id,
    adapterCreator: msg.guild.voiceAdapterCreator,
  });

  connection.destroy();
  msg.reply("사이버 성대 장착 해제!");
};

const tts = async (msg) => {
  const data = JSON.stringify({
    actor_id: "632293f759d649937b97f323",
    text: msg,
    lang: "auto",
    tempo: 1,
    volume: 100,
    pitch: 0,
    xapi_hd: true,
    max_seconds: 60,
    model_version: "latest",
    xapi_audio_format: "mp3",
    emotion_tone_preset: "normal-2",
  });

  const config = {
    method: "post",
    url: "https://typecast.ai/api/speak",
    headers: {
      "Content-Type": "application/json",
      Authorization: process.env.TTS_TOKEN,
    },
    data: data,
  };

  axios.request(config).then(async (response) => {
    const speakV2Url = response.data.result.speak_v2_url;

    const checkDownloadUrl = async () => {
      const downloadUrlResponse = await axios.get(speakV2Url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: process.env.TTS_TOKEN,
        },
      });

      return downloadUrlResponse.data;
    };
    const intervalId = setInterval(async () => {
      const data = await checkDownloadUrl();
      let breakTry = 0;
      if (breakTry > 10) {
        console.log("TTS가 뻗은거 같아요");
        clearInterval(intervalId);
      }
      if (data.result.audio_download_url) {
        clearInterval(intervalId); // 폴링 중지
        const downloadUrl = data.result.audio_download_url;
        say(downloadUrl);
      } else {
        console.log("아직 준비되지 않음 다시 시도...");
      }
    }, 1000);
  });
};

const say = async (url) => {
  const player = createAudioPlayer();
  const resource = createAudioResource(url, {
    inlineVolume: true,
  });
  player.play(resource);
  connection.subscribe(player);
};
