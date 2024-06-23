import discord from "discord.js";
import { GatewayIntentBits } from "discord.js";
import {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
} from "@discordjs/voice";
import dotenv from "dotenv";
import { createReadStream } from "fs";

dotenv.config();
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

client.on("messageCreate", (msg) => {
  console.log(`반환된 메세지${msg.content}`);
  console.log(`참여하고 있는 채널${msg.member.voice.channel}`);

  if (msg.content === "/성대") {
    joinChannel(msg);
  }
  if (msg.content === "/나가") {
    outChannel(msg);
  }
  if (msg.content === "/gay") {
    gayEcho(msg);
  }
});

client.login(process.env.TOKEN);
/* 메세지 관련 처리 기능 구현 */
const joinChannel = (msg) => {
  if (!msg.member.voice.channel) {
    msg.reply("어느 채널에 있노! 안보인다!!");
    return;
  }
  const connection = joinVoiceChannel({
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

  connection.destroy();
  msg.reply("사이버 성대 장착 해제!");
};

const gayEcho = (msg) => {
  msg.reply("유 서쳐 게이");
  const resource = createAudioResource(createReadStream("./sound/gay-echo.mp3"));
  const player = createAudioPlayer();
  player.play(resource);
  const connection = joinVoiceChannel({
    channelId: msg.member.voice.channel.id,
    guildId: msg.guild.id,
    adapterCreator: msg.guild.voiceAdapterCreator,
  });
  connection.subscribe(player);
};
