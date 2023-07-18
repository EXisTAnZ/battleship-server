import { Message, msgAddShips, msgAttack, msgConnect, msgPlayer, msgType } from '../types/message';

export function msgParser(message: string) {
  const msgParse = JSON.parse(message) as Message;
  const { type, id } = msgParse;
  const data = dataParser(type, msgParse.data);
  return { type, data, id };
}

export function dataParser(type: msgType, data: string) {
  let parsedData = {};
  switch (type) {
    case msgType.REGISTRATION:
      parsedData = JSON.parse(data) as msgPlayer;
      break;
    case msgType.CONNECT_TO_ROOM:
      parsedData = JSON.parse(data) as msgConnect;
      break;
    case msgType.ADD_SHIPS:
      parsedData = JSON.parse(data) as msgAddShips;
      break;
    case msgType.ATTACK:
      parsedData = JSON.parse(data) as msgAttack;
      break;
    case msgType.RND_ATTACK:
      parsedData = JSON.parse(data) as msgAttack;
      break;
    default:
      break;
  }
  return parsedData;
}

export function prepResponse(type: msgType, data: object) {
  return JSON.stringify({ type, data: JSON.stringify(data), id: 0 });
}
