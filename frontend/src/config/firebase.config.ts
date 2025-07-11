import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
	apiKey: "AIzaSyCF_tXZggPYztD0Ld2TTYjR7FuYICqieSk",
	authDomain: "echo-note-ai.firebaseapp.com",
	projectId: "echo-note-ai",
	appId: "1:58222853866:web:e8d1a4072fffb78a4aa193",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
