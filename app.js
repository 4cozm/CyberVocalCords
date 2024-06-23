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
  console.log(`ready 이벤트 발생 ${client.user.tag}!`);
});

client.on("messageCreate", async (msg) => {
  if (msg.author.bot) return;
  console.log(`메세지${msg.content}`);


  if (msg.content === "/성대") {
    joinChannel(msg);
    return;
  }
  if (msg.content === "/나가") {
    outChannel(msg);
    return;
  }
  if (msg.content === "/gay") {
    gayEcho(msg);
    return;
  }

  if (msg.member.voice.channel.id === connection.joinConfig.channelId) {
    await tts(msg.content);
  } 

  if (msg.content === "/검증") {
    if (msg.member.voice.channel === "#" + connection.joinConfig.channelId); //봇의 현재 음성 서버 주소
    {
      console.log("같은 방 확인");
      await tts("나는 상후가 좋아요");
    }
  }
});

client.login(process.env.TOKEN);
/* 메세지 관련 처리 기능 구현 */

const joinChannel = (msg) => {
  if (!msg.member.voice.channel) {
    msg.reply("어느 채널에 있노! 안보인다!!");
    return;
  }
  connection = joinVoiceChannel({
    channelId: msg.member.voice.channel.id,
    guildId: msg.guild.id,
    adapterCreator: msg.guild.voiceAdapterCreator,
  });

  msg.reply("사이버 성대 장착!");
};

const outChannel = (msg) => {
  if (!msg.member.voice.channel) {
    msg.reply("마마 가까이 와서 이야기해도~ 채널밖에 있으면 안들린다~~");
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

const gayEcho = (msg) => {
  msg.reply("유 서쳐 게이");
  const resource = createAudioResource(
    createReadStream("./sound/gay-echo.mp3")
  );
  const player = createAudioPlayer();
  player.play(resource);
  connection.subscribe(player);
};

const tts = async (msg) => {
  const data = JSON.stringify({
    actor_id: "5c547544fcfee90007fed455",
    text: msg,
    lang: "auto",
    tempo: 1.2,
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
      Authorization: "Bearer __plt5EUNnkp3tL9PGxjwSpKh6rZfBVM44qituwRGxvqH",
    },
    data: data,
  };

  axios.request(config).then(async (response) => {
    const speakV2Url = response.data.result.speak_v2_url;

    const checkDownloadUrl = async () => {
      const downloadUrlResponse = await axios.get(speakV2Url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer __plt5EUNnkp3tL9PGxjwSpKh6rZfBVM44qituwRGxvqH",
        },
      });

      return downloadUrlResponse.data;
    };
    let downloadLink;
    const intervalId = setInterval(async () => {
      const data = await checkDownloadUrl();
      let breakTry = 0;
      if (breakTry > 10) {
        console.log("10번찍어서 안넘어가는 TTS가 있네");
        clearInterval(intervalId);
      }
      if (data.result.audio_download_url) {
        clearInterval(intervalId); // 폴링 중지
        const downloadUrl = data.result.audio_download_url;
        say(downloadUrl);

        // Discord로 음성 출력
        // ...
      } else {
        console.log("아직 준비되지 않음, 다시 시도...");
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

// const gayEcho = (msg) => {
//   msg.reply("유 서쳐 게이");
//   const resource = createAudioResource(
//     createReadStream("./sound/gay-echo.mp3")
//   );
//   const player = createAudioPlayer();
//   player.play(resource);
//   connection.subscribe(player);
// };
