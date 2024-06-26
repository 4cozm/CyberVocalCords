## 디스코드 사이버 성대 봇

### 뭘 만든거에요?



https://github.com/4cozm/CyberVocalCords/assets/49065386/9ebb0562-7a95-4c86-b2fe-af19e6afb690

### 프로젝트 기획 이유:

스파르타 코딩클럽에는 다양한 소규모 스터디 그룹이 존재하며, 이들 대부분이 Discord를 통해 서로 소통하고 있습니다. 그러나 Discord와 Zep 모두 접속해 있는 상황에서 마이크를 껐다 켰다 하는 불편함이 있습니다. 
따라서 Discord 음성 채팅에 접속되어 있을 때도 누군가를 호출하거나 도움을 요청할 때 마이크를 켜지 않고 메시지를 남기면 자동으로 TTS(Text-to-Speech)로 메시지를 읽어주어 Zep과 같은 도구와 함께 사용할 수 있으면 좋겠다는 생각에서 이 프로젝트를 기획하게 되었습니다.

기술 스택:

- Node.js

사용한 라이브러리:

```jsx
"dependencies": {
  "@discordjs/opus": "^0.9.0",
  "@discordjs/voice": "^0.17.0",
  "axios": "^1.7.2",
  "discord.js": "^14.15.3",
  "dotenv": "^16.4.5",
  "ffmpeg-static": "^5.2.0",
  "libsodium-wrappers": "^0.7.13"
}

```

> ~~기초적인 임플란트다 - 아담 스매셔~~




### Discord 에는 기본 TTS 기능도 존재하는데요?
> 

디스코드에는 기본적으로 /TTS “메세지” 를 통해서 음성 채널에 있는 사람들에게 메세지를 들려줄 수 있습니다. 하지만 두가지 단점이 존재하는데요

- 매 입력마다 `/TTS` 를 입력해야한다
- 특정 조건 없이 음성채널에 있는 모두에게 TTS가 출력된다

**이번 프로젝트는 이 부분을 해결하기 위해 여러 기능을 추가했습니다**

- 봇과 같은 음성채널에 있는 사람들이 입력한 메세지만 출력됨
- 봇이 직접 음성을 출력함으로, 다른 음성 채널에는 TTS가 들리지 않음

**추가적으로 이런 부분들도 구현했습니다**

- API 기반으로 설계되어 API를 지원하는 다양한 TTS모델을 사용할 수 있습니다.

**앞으로는 이런 기능들을 구현할 예정입니다**

- TIL 빠따 기능 - 채널에 참가한 사용자가 TIL을 작성하지 않을시 빠따 포인트가 적용되어 스터디 모임 규칙에 따라 특정 포인트 이상 올라갈시 벌칙을 수행하는 기능
- 봇 음성의 피치,음량,기분 등을 조절할 수 있는 기능 (지원하는 API의 경우)
- 사용자가 채널에 없을시, 자동으로 봇이 퇴장하는 기능
- 생일인 유저가 접속할 시 생일축하 노래 재생

**아직 부족한 부분은 이렇습니다**

- 메세지를 빠르게 입력하면 먼저 입력한 메세지의 음성출력이 밀리는 문제
- 봇이 여러 서버에 동시 접속했을 때, 전역변수를 사용함으로써 발생하는 문제가 있음
- AWS 서버비용 - 추후 Lamda를 공부해 적용해 볼 예정
