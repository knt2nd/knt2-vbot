/*

Here is the WebSocket server example.
You'd see ping/pong messages when chat/voice events fire.
That means you can do whatever you want on your local machine without the browser limitation.
For example, when someone says "OK Google, turn on the light" in your world in VRChat,
send keyboard emulation or OSC from this server, then a world gimmick activates to turn on the light.
Or,

- Take a screenshot and post to Twitter
- Extract a topic from what people talking and reply with the machine learning
- Browse any web site with Puppeteer

and such. You can **actually** do whatever you want!

 */

const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 18400 });

wss.on('connection', ws => {
  console.log('Connected');

  ws.on('message', message => {
    console.log('Received:', message);
    ws.send(`Pong: ${message}`);
  });
});
