const defaultPublicKey = "Leave empty if you don't want to use your own public key.";
const defaultPrivateKey = "Leave empty if you don't want to save your private key.";

exports.defaultPublicKey = defaultPublicKey;
exports.defaultPrivateKey = defaultPrivateKey;
exports.applicationCreate = [
  {
    type : 'input',
    name : 'name',
    message : 'Application Name: '
  },
  {
    type : 'checkbox',
    name : 'capabilities',
    message : 'Select Capabilities: ',
    choices: ["voice", "messages", "rtc", "vbc"]
  },
  {
    type : 'confirm',
    name : 'useDefaultHttpMethods',
    message : 'Use the default HTTP methods? ',
    when: (answers => answers.capabilities.includes('voice') || answers.capabilities.includes('rtc'))
  },
  {
    type : 'input',
    name : 'voiceAnswerUrl',
    message : "Voice Answer URL:",
    default : "https://example.com/",
    when: (answers => answers.capabilities.includes('voice'))
  },
  {
    type : 'list',
    choices: ["GET", "POST"],
    name : 'voiceAnswerMethod',
    message : "Voice Answer URL HTTP Method:",
    when: (answers => answers.capabilities.includes('voice') && !answers.useDefaultHttpMethods)
  },
  {
    type : 'input',
    name : 'voiceFallbackAnswerUrl',
    message : "Voice Fallback Answer URL:",
    default: "Optional",
    when: (answers => answers.capabilities.includes('voice'))
  },
  {
    type : 'list',
    choices: ["GET", "POST"],
    name : 'voiceFallbackAnswerMethod',
    message : "Voice Fallback Answer URL HTTP Method:",
    when: (answers => answers.capabilities.includes('voice') && !answers.useDefaultHttpMethods && answers.voiceFallbackAnswerUrl != "Optional")
  },
  {
    type : 'input',
    name : 'voiceEventUrl',
    message : "Voice Event URL:",
    default: "https://example.com/",
    when: (answers => answers.capabilities.includes('voice'))
  },
  {
    type : 'list',
    choices: ["GET", "POST"],
    name : 'voiceEventMethod',
    message : "Voice Event URL HTTP Method:",
    when: (answers => answers.capabilities.includes('voice') && !answers.useDefaultHttpMethods)
  },
  {
    type : 'input',
    name : 'messagesInboundUrl',
    message : "Messages Inbound URL:",
    default: "https://example.com/",
    when: (answers => answers.capabilities.includes('messages'))
  },
  {
    type : 'input',
    name : 'messagesStatusUrl',
    message : "Messages Status URL:",
    default: "https://example.com/",
    when: (answers => answers.capabilities.includes('messages'))
  },
  {
    type : 'input',
    name : 'rtcEventUrl',
    message : "RTC Event URL:",
    default: "https://example.com/",
    when: (answers => answers.capabilities.includes('rtc'))
  },
  {
    type : 'list',
    choices: ["GET", "POST"],
    name : 'rtcEventMethod',
    message : "RTC Event URL HTTP Method:",
    when: (answers => answers.capabilities.includes('rtc') && !answers.useDefaultHttpMethods)
  },
  {
    type : 'input',
    name : 'publicKeyfile',
    message : "Public Key path:",
    default: defaultPublicKey
  },
  {
    type : 'input',
    name : 'keyfile',
    message : "Private Key path:",
    default: defaultPrivateKey
  }
];

exports.applicationUpdate = function (application) {
  return [
    {
      type : 'input',
      name : 'name',
      default: application.name,
      message : 'Application Name: '
    },
    {
      type : 'checkbox',
      name : 'capabilities',
      message : 'Select Capabilities: ',
      choices: ["voice", "messages", "rtc", "vbc"]
    },
    {
      type : 'confirm',
      name : 'useDefaultHttpMethods',
      message : 'Do you want to use the default HTTP methods? ',
      when: (answers => answers.capabilities.includes('voice') || answers.capabilities.includes('rtc'))
    },
    {
      type : 'input',
      name : 'voiceAnswerUrl',
      message : "Voice Answer URL:",
      default: application.capabilities.voice ? application.capabilities.voice.webhooks.answer_url.address : "https://example.com",
      when: (answers => answers.capabilities.includes('voice'))
    },
    {
      type : 'list',
      choices: ["GET", "POST"],
      name : 'voiceAnswerMethod',
      message : "Voice Answer URL HTTP Method:",
      when: (answers => answers.capabilities.includes('voice') && !answers.useDefaultHttpMethods)
    },
    {
      type : 'input',
      name : 'voiceFallbackAnswerUrl',
      default: (application.capabilities.voice && application.capabilities.voice.webhooks.fallback_answer_url) ? application.capabilities.voice.webhooks.fallback_answer_url.address : "Optional",
      message : "Voice Fallback Answer URL:",
      when: (answers => answers.capabilities.includes('voice'))
    },
    {
      type : 'list',
      choices: ["GET", "POST"],
      name : 'voiceFallbackAnswerMethod',
      message : "Voice Fallback Answer URL HTTP Method:",
      when: (answers => answers.capabilities.includes('voice') && !answers.useDefaultHttpMethods && answers.voiceFallbackAnswerUrl != "Optional")
    },
    {
      type : 'input',
      name : 'voiceEventUrl',
      message : "Voice Event URL:",
      default: application.capabilities.voice ? application.capabilities.voice.webhooks.event_url.address : "https://example.com",
      when: (answers => answers.capabilities.includes('voice'))
    },
    {
      type : 'list',
      choices: ["GET", "POST"],
      name : 'voiceEventMethod',
      message : "Voice Event URL HTTP Method:",
      when: (answers => answers.capabilities.includes('voice') && !answers.useDefaultHttpMethods)
    },
    {
      type : 'input',
      name : 'messagesInboundUrl',
      message : "Messages Inbound URL:",
      default: application.capabilities.messages ? application.capabilities.messages.webhooks.inbound_url.address : "https://example.com",
      when: (answers => answers.capabilities.includes('messages'))
    },
    {
      type : 'input',
      name : 'messagesStatusUrl',
      message : "Messages Status URL:",
      default: application.capabilities.messages ? application.capabilities.messages.webhooks.status_url.address : "https://example.com",
      when: (answers => answers.capabilities.includes('messages'))
    },
    {
      type : 'input',
      name : 'rtcEventUrl',
      message : "RTC Event URL:",
      default: application.capabilities.rtc ? application.capabilities.rtc.webhooks.event_url.address : "https://example.com",
      when: (answers => answers.capabilities.includes('rtc'))
    },
    {
      type : 'list',
      choices: ["GET", "POST"],
      name : 'rtcEventMethod',
      message : "RTC Event URL HTTP Method:",
      when: (answers => answers.capabilities.includes('rtc') && !answers.useDefaultHttpMethods)
    },
    {
      type : 'input',
      name : 'publicKeyfile',
      message : "Public Key path:",
      default: defaultPublicKey
    }
  ];
};
