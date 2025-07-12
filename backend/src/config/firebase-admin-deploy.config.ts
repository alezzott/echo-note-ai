import admin from "firebase-admin";

if (!process.env.FIREBASE_CONFIG_BASE64) {
	throw new Error("FIREBASE_CONFIG_BASE64 environment variable is not defined");
}

const serviceAccount = JSON.parse(
	Buffer.from(process.env.FIREBASE_CONFIG_BASE64, "base64").toString("utf8"),
);

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});

export default admin;
