import { InteractionResponseType } from 'discord-interactions';

export default async function handlePing(req, res) {
  return res.send({ type: InteractionResponseType.PONG });
}
