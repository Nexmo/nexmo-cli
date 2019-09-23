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
    message : 'Do you want to use the default HTTP methods? ',
    when: (answers => answers.capabilities.includes('voice') || answers.capabilities.includes('rtc'))
  },
  {
    type : 'input',
    name : 'voiceAnswerUrl',
    message : "Voice Answer URL:",
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
    when: (answers => answers.capabilities.includes('voice'))
  },
  {
    type : 'list',
    choices: ["GET", "POST"],
    name : 'voiceFallbackAnswerMethod',
    message : "Voice Fallback Answer URL HTTP Method:",
    when: (answers => answers.capabilities.includes('voice') && !answers.useDefaultHttpMethods)
  },
  {
    type : 'input',
    name : 'voiceEventUrl',
    message : "Voice Event URL:",
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
    when: (answers => answers.capabilities.includes('messages'))
  },
  {
    type : 'input',
    name : 'messagesStatusUrl',
    message : "Messages Status URL:",
    when: (answers => answers.capabilities.includes('messages'))
  },
  {
    type : 'input',
    name : 'rtcEventUrl',
    message : "RTC Event URL:",
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
    type : 'confirm',
    name : 'generatePublicKey',
    message : 'Do you want Nexmo to generate a public/private key pair for authentication? ',
  },
  {
    type : 'input',
    name : 'publicKeyfile',
    message : "Public Key path:",
    when: (answers => !answers.generatePublicKey)
  },
  {
    type : 'confirm',
    name : 'savePrivateKey',
    message : "Do you want to save your private key to a file?",
    when: (answers => answers.generatePublicKey)
  },
  {
    type : 'input',
    name : 'keyfile',
    message : "Private Key path:",
    when: (answers => answers.savePrivateKey)
  }
];

exports.applicationUpdate = [
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
    message : 'Do you want to use the default HTTP methods? ',
    when: (answers => answers.capabilities.includes('voice') || answers.capabilities.includes('rtc'))
  },
  {
    type : 'input',
    name : 'voiceAnswerUrl',
    message : "Voice Answer URL:",
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
    when: (answers => answers.capabilities.includes('voice'))
  },
  {
    type : 'list',
    choices: ["GET", "POST"],
    name : 'voiceFallbackAnswerMethod',
    message : "Voice Fallback Answer URL HTTP Method:",
    when: (answers => answers.capabilities.includes('voice') && !answers.useDefaultHttpMethods)
  },
  {
    type : 'input',
    name : 'voiceEventUrl',
    message : "Voice Event URL:",
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
    when: (answers => answers.capabilities.includes('messages'))
  },
  {
    type : 'input',
    name : 'messagesStatusUrl',
    message : "Messages Status URL:",
    when: (answers => answers.capabilities.includes('messages'))
  },
  {
    type : 'input',
    name : 'rtcEventUrl',
    message : "RTC Event URL:",
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
    type : 'confirm',
    name : 'generatePublicKey',
    message : 'Do you want to update your public key used for authentication? ',
  },
  {
    type : 'input',
    name : 'publicKeyfile',
    message : "Public Key path:",
    when: (answers => answers.generatePublicKey)
  }
];
