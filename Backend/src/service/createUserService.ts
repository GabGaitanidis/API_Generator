import { generateApiKey } from "../data_generation/apiKeyGenerator";
import { createUser } from "../repository/user.repo";

async function createUserService(
  name: string,
  email: string,
  password: string,
) {
  const key = generateApiKey();
  const user = await createUser(name, key, email, password);
  return user;
}

export default createUserService;
