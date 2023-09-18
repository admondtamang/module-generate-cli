import * as mq from "./mq.service";

type CreateUserSchema = {
  name: string;
  email: string;
  password: string;
};

export async function createUserService(body: CreateUserSchema) {
  await mq.produce("user", body);

  return "user will be created soon";
}

mq.consume<CreateUserSchema>("user", async (data) => {
  saveToDB(data);
});

async function saveToDB(data: CreateUserSchema) {
  console.log(data);
}
