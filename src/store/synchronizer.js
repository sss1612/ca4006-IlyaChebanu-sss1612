import { actions } from './initialLoadingState/initialLoadingState';

let subscribedStores = [];
const synchronizer = (store) => {
  const ws = new WebSocket('ws://localhost:9090');

  ws.onmessage = e => {
    const message = JSON.parse(e.data);
    const actionNamespace = message.data.type.split('/')[0];

    if (subscribedStores.includes(actionNamespace)) {
      store.dispatch(message.data);
    }
  };

  ws.onclose = e => {
    store.dispatch(actions.setLoading());
    setTimeout(() => {
      synchronizer(store);
    }, 100);
  };

  ws.onerror = e => {
    ws.close();
  };
};

synchronizer.subscribe = storeNamespace => subscribedStores.push(storeNamespace);
synchronizer.unsubscribe = storeNamespace => {
  subscribedStores = subscribedStores.filter(n => n !== storeNamespace);
};

export default synchronizer;
