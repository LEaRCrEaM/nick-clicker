require('dns').setDefaultResultOrder('ipv4first');
require('dotenv').config();
const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder } = require('discord.js');
const express = require('express');
const path = require('path');
const fetch = require('node-fetch');
const WebSocket = require('ws');
const pako = require('pako');
const puppeteer = require('puppeteer');

const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

var page, username = '111';
(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH
  });
  const pages = await browser.pages();
  page = pages[0];
  if (!page) {
    page = await browser.newPage();
  };
  page.setDefaultNavigationTimeout(0);
  await page.goto('https://tankionline.com/play/', { waitUntil: 'domcontentloaded', timeout: 0 });
  await page.waitForSelector('.StartScreenComponentStyle-text');
  await page.click('.StartScreenComponentStyle-text');
  await page.waitForSelector('.RoundBigButtonComponentStyle-innerCircle');
  await page.click('.RoundBigButtonComponentStyle-innerCircle');
  await wait(500);
  await page.evaluate(async () => {
    let elm = null;
    while (!elm) {
      elm = document.querySelectorAll('.RoundBigButtonComponentStyle-innerCircle')[0];
      if (!elm) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
    elm.click();
  });
  await page.waitForSelector('#username');
  await page.waitForSelector('#password');
  await page.waitForSelector('#password1');
  await page.waitForSelector('.Common-flexCenterAlignCenter.ButtonComponentStyle-disabled');
  await page.type('#username', username);
  await page.type('#password', 'bitchassnigga111');
  await page.type('#password1', 'bitchassnigga111');
  const isButtonVisible = async () => {
    const el = await page.$('.EntranceComponentStyle-buttonActive');
    if (!el) return false;
    const box = await el.boundingBox();
    return !!box;
  };
  while (true) {
    const stable = await isButtonVisible();
    await wait(2000);
    if (stable) {
      const stillStable = await isButtonVisible();
      if (stillStable) break;
    };
    await page.evaluate(() => {
      const input = document.querySelector('#username');
      if (input) input.value = '';
    });
    await page.type('#username', username);
    await wait(100);
  };
  await page.click('.EntranceComponentStyle-buttonActive');
  console.log('clicked');
  while (true) {
    const found = await page.evaluate(() => {
      const elm = Array.from(document.querySelectorAll('span')).find(t => t.textContent.toLowerCase() === 'accept');
      if (elm) {
        elm.click();
        return true;
      }
      return false;
    });
    if (found) break;
    await new Promise(r => setTimeout(r, 500));
  };
})();

const app = express();
app.get('/', (req, res) => res.send('Bot is running!'));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🌐 Web server running on port ${PORT}`));