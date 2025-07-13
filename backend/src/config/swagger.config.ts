const swaggerOptions = {
	definition: {
		openapi: "3.0.0",
		info: {
			title: "EchoNoteAI API",
			version: "1.0.0",
			description: "Documentação da API EchoNoteAI",
		},
	},
	apis: ["./src/docs/docs-api.yml"],
};

export default swaggerOptions;
