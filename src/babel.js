import _ from 'lodash';

async function start() {
  return await Promise.resolve('async is working');
}

start().then(console.log);

class Util {
  static id = Date.now();
}

console.log('Util id:', Util.id);

// const unusedVar = 1;

console.log('lodash -', _.random(0, 42));