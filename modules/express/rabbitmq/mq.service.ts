import * as amqp from "amqplib";
import mqConfig from "./mq.config";

async function connect() {
  const connection = await amqp.connect(mqConfig.rabbitmq.url);
  return connection.createChannel();
}

export async function consume<T>(
  queueName: string,
  callback: (msg: T) => void
) {
  const channel = await connect();
  await channel.assertQueue(queueName);

  channel.consume(queueName, (message) => {
    const data = JSON.parse(message!.content.toString());
    callback(data);
    channel.ack(message!); // HINT: acknowledge that the message has been received which then will be removed from the queue
  });
}

export async function produce(queueName: string, msg: any) {
  const channel = await connect();

  await channel.assertQueue(queueName);

  channel.sendToQueue(queueName, Buffer.from(JSON.stringify(msg)));
}
