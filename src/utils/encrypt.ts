import NodeRSA from 'node-rsa';
import 'dotenv/config';

export const encryptData = (data: string) => {
  const publicKey = process.env.PUBLIC_KEY || 'PublicKEY';

  const key = new NodeRSA(publicKey, 'pkcs8-public');
  
  // Criptografar os dados e armazenar o resultado
  const encryptedData = key.encrypt(data, 'base64');

  // Retornar o dado criptografado
  return encryptedData;
};

export const decryptData = (data: string) => {
  const privateKey = process.env.PRIVATE_KEY || 'SecretKEY';
  const key = new NodeRSA(privateKey, 'pkcs8-private');
  
  // Descriptografar os dados
  const decryptedData = key.decrypt(data, 'utf8');

  // Log e retornar os dados descriptografados
  console.log("Dados descriptografados:", decryptedData);
  return decryptedData;
};
