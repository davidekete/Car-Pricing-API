/* eslint-disable prettier/prettier */
import { rm } from 'fs/promises';
import { join } from 'path';
// import { getConnection } from 'typeorm';

global.beforeEach(async () => {
  try {
    await rm(join(__dirname, '..', 'test.sqlite'));
  } catch (error) {}
});

// global.afterEach(async ()=>{
//   const connect = await getConnection()
//   await connect.destroy()
// })