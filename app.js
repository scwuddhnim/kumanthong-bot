import 'dotenv/config';
import express from 'express';
import lodash from 'lodash';

import {
  InteractionType,
  InteractionResponseType,
} from 'discord-interactions';
import { VerifyDiscordRequest } from './utils.js';
import { HasGuildCommands } from './commands.js';
import handleCommands from './services/application-command-service.js';

const app = express();
const PORT = process.env.PORT || 3006;
app.use(express.json({ verify: VerifyDiscordRequest(process.env.PUBLIC_KEY) }));

app.post('/interactions', async function (req, res) {
  const { type, data } = req.body;

  if (type === InteractionType.PING) {
    return res.send({ type: InteractionResponseType.PONG });
  }

  if (type === InteractionType.APPLICATION_COMMAND) {
    return handleCommands(req, res);
  }
});

app.listen(PORT, () => {
  console.log('Listening on port', PORT);
  HasGuildCommands(
    process.env.APP_ID,
    process.env.GUILD_ID,
    [
      {
        name: 'list',
        description: 'list command'
      },
      {
        name: 'register',
        description: 'register command'
      },
      {
        name: 'clear',
        description: 'clear command'
      },
      {
        name: 'remove',
        description: 'remove command'
      },
      {
        name: 'random',
        description: 'random command',
        options: [
          {
            type: 4,
            name: 'num',
            description: 'number of random members',
            required: true,
            min_value: 1
          }
        ]
      }
    ]
  );
});
