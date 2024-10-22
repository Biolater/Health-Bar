import OpenAI from "openai";

export const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_KEY || "",
  organization: "org-CqHdu342srYvs8luVbINAtEe",
  project: "proj_NGeGxCE8tPlgL6sGl3EsVhKu",
  dangerouslyAllowBrowser: true,
});
