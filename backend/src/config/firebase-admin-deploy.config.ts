import admin from "firebase-admin";
import fs from "fs";

const serviceAccount = JSON.parse(
	fs.readFileSync("/etc/secrets/firebase-service-account.json", "utf8"),
);

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});

export default admin;
