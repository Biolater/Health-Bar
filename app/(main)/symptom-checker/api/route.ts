// import { openai } from "../ai";

// const makeRequest = async () => {
//   try {
//     // Ensure model name is correct, e.g., "gpt-4" or "gpt-3.5-turbo"
//     const response = await openai.chat.completions.create({
//       model: "gpt-4o-mini", // Update to the correct model
//       messages: [{ role: "user", content: "Say this is a test" }],
//     });

//     // Extract the text from the response
//     const text = response.choices[0].message.content;
//     return text;
//   } catch (error) {
//     console.error("Error making OpenAI request:", error);
//     return "There was an error processing your request.";
//   }
// };

export async function GET(request: Request) {
  //   const text = await makeRequest();
  return new Response("Hello", {
    headers: { "Content-Type": "text/plain" },
    status: 200,
  });
}
