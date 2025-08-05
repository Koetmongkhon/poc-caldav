class BusConnector {
  constructor(config, name, receiverModule) {
    this.config = config;
    this.rmq = global.rmq;
    this.receiverModule = receiverModule;
  }

  sendRequest(session, func, parameter) {
    parameter = parameter || {};
    parameter.session = session;

    const data = JSON.stringify(parameter);
    console.log(session, `send request to ${this.receiverModule} [${func}]`);
    console.log(session, `parameter: ${data}`);
    return this.rmq.send(this.receiverModule, func, data)
      .catch((err) => {
        console.log(session, `send request to ${this.receiverModule} error`);
        console.log(session, `${err.message}\n${err.stack}`);
        throw err
      })
      .then((reply) => {
        console.log(session, `receive response from ${this.receiverModule} [${func}]`);
        console.log(session, `data: ${reply.data}`);
        let recv_data = JSON.parse(reply.data);
        if (!recv_data.success) {
          console.log(session, `response from ${this.receiverModule} error`);
          throw recv_data.body;
        }
        return recv_data.body;
      });
  }

}

module.exports = BusConnector;
