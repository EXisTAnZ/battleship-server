import {
  Message,
  msgAddShips,
  msgAttack,
  msgConnect,
  msgPlayer,
  msgType,
} from '../types/message';

export const msgParser = function (message: string) {
  const msgParse = JSON.parse(message) as Message;
  const { type, id } = msgParse;
  const data = dataParser(type, msgParse.data);
  return { type, data, id };
};

export const dataParser = function (type: msgType, data: string) {
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
};
