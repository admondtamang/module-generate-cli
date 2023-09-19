# RabbitMQ Module

## Required env variables

```sh
RABBITMQ_URL="amqp://"
```

## Usae

### Packages Required

```sh
yarn add amqplib zod
yarn add -D @types/amqplib
```

## Implementation

### Send to the Queue
```ts
import * as mq from "./mq.service";

type CreateUserSchema = {
  name: string;
  email: string;
  password: string;
};

// send the data to the Queue
export async function createUserService(body: CreateUserSchema) {
  await mq.produce("user", body); // here "user" is name of the queue

  return "user will be created soon";
}
```

### Consume data from the queue

```ts
// NOTE: pass the type as the generic for typesafe data consumption
mq.consume<CreateUserSchema>("user", async (data) => {  // here "user" is name of the queue
  saveToDB(data);
});

async function saveToDB(data: CreateUserSchema) {
  console.log(data);
  // put your db query to insert data here
}
```
