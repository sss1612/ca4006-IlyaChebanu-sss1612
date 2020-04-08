const connect = (store) => {
  const ws = new WebSocket('ws://localhost:7070');

  ws.onmessage = e => {
    const message = JSON.parse(e.data);
    store.dispatch(message.data);
  };

  ws.onclose = e => {
    setTimeout(() => {
      connect(store);
    }, 100);
  };

  ws.onerror = e => {
    ws.close();
  };
};


export default connect;
