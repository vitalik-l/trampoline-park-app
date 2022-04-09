export const formatTime = (time?: number) => {
  if (!time) return '00:00:00';
  let hour = (time / 3600) ^ 0,
    min = ((time - hour * 3600) / 60) ^ 0,
    sec = time - hour * 3600 - min * 60,
    resHour = hour < 10 ? '0' + hour : hour,
    resMin = min < 10 ? '0' + min : min,
    resSec = sec < 10 ? '0' + sec : sec,
    res = '';
  res += resHour + ':';
  res += resMin + ':' + resSec;
  return res;
};
