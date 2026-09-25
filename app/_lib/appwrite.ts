import { Client, Account, Databases, TablesDB, Storage, OAuthProvider, ID, Permission, Role, Query } from "appwrite";

const client = new Client()
  .setEndpoint("https://sgp.cloud.appwrite.io/v1")
  .setProject("aethos-wealth");

const account = new Account(client);
const databases = new Databases(client);
const tablesDB = new TablesDB(client);
const storage = new Storage(client);

export { client, account, databases, tablesDB, storage, OAuthProvider, ID, Permission, Role, Query };

// Run client.ping() once when the app starts so the user can confirm the setup
if (typeof window !== "undefined") {
  client
    .ping()
    .then((res) => {
      console.log("Appwrite connected successfully:", res);
    })
    .catch((err) => {
      console.log("Appwrite ping response:", err);
    });
}
