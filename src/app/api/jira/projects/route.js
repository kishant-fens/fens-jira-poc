import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "jira-data.json");
    const { access_token, cloudid } = JSON.parse(
      fs.readFileSync(filePath, "utf8")
    );

    const projectResponse = await fetch(
      `https://api.atlassian.com/ex/jira/${cloudid}/rest/api/2/project`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
          Accept: "application/json",
        },
      }
    );

    const projects = await projectResponse.json();
    return new Response(JSON.stringify(projects), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
