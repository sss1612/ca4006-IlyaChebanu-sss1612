import WebSocket from 'ws';
import store from './store';


let subscribedStores = [];

const wss = new WebSocket.Server({ port: 7070 });

wss.on('connection', ws => {
  ws.messageId = 0;
  subscribedStores.forEach(storeName => {
    const subStore = require(`../../shared/store/${storeName}`);
    if (subStore.actions.setInitialState) {
      ws.send(JSON.stringify({
        messageId: ws.messageId,
        data: subStore.actions.setInitialState(store.getState()[storeName]),
      }));
      ws.messageId++;
    }
  });
});

const synchronizer = store => next => action => {
  const actionNamespace = action.type.split('/')[0];

  if (subscribedStores.includes(actionNamespace)) {
    wss.clients.forEach(ws => {
      ws.send(JSON.stringify({
        messageId: ws.messageId,
        data: action
      }));
      ws.messageId++;
    });
  }

  return next(action);
};

synchronizer.subscribe = storeNamespace => subscribedStores.push(storeNamespace);
synchronizer.unsubscribe = storeNamespace => {
  subscribedStores = subscribedStores.filter(n => n !== storeNamespace);
};

export default synchronizer;
