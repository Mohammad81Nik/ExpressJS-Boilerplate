export const redisUtis = {
  redisKey(prefix: string, jti: string) {
    return `${prefix}:${jti}`;
  },
};
