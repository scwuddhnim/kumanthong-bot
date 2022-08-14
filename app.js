import 'dotenv/config';
import express from 'express';
import lodash from 'lodash';
import {
  InteractionType,
  InteractionResponseType,
} from 'discord-interactions';
import { VerifyDiscordRequest } from './utils.js';
import {
  HasGuildCommands,
  RANDOM_COMMAND
} from './commands.js';

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json({ verify: VerifyDiscordRequest(process.env.PUBLIC_KEY) }));

app.post('/interactions', async function (req, res) {
  const { type, id, data } = req.body;

  if (type === InteractionType.PING) {
    return res.send({ type: InteractionResponseType.PONG });
  }

  if (type === InteractionType.APPLICATION_COMMAND) {
    const { name } = data;

    if (name === 'random') {
      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          "content": "chọn 1 đứa xuống lấy cơm nào",
          "components": [
            {
              "type": 1,
              "components": [
                {
                  "type": 3,
                  "custom_id": "list_members",
                  "options": [
                    {
                      "label": "Tống Minh Đức",
                      "value": "827026836860567612"
                    },
                    {
                      "label": "Nguyễn Duy Trường",
                      "value": "743137088463175700"
                    },
                    {
                      "label": "Văn Trung Hiếu",
                      "value": "496343192753405963"
                    }
                  ],
                  "placeholder": "choose members",
                  "min_values": 1,
                  "max_values": 3
                }
              ]
            }
          ]
        }
      });
    }
  }

  if (type === InteractionType.MESSAGE_COMPONENT) {
    const componentId = data.custom_id;

    if (componentId === 'list_members') {
      const listMemberIds = lodash.get(data, 'values');
      const randomMemberId = lodash.sample(listMemberIds);
      res.send({
        type: 4,
        data: {
          content: `aiss chết tiệt hôm nay <@${randomMemberId}> phải xuống lấy cơm rồi`
        }
      });
    }
  }
});

app.listen(PORT, () => {
  console.log('Listening on port', PORT);

  HasGuildCommands(
    process.env.APP_ID,
    process.env.GUILD_ID,
    [
      RANDOM_COMMAND
    ]
  );
});
