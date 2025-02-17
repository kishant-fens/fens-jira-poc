import fs from "fs";
import path from "path";

export async function POST(req) {
  const {
    client_id,
    client_secret,
    code,
    redirect_uri = "http://localhost:3000/oauth-redirect",
  } = await req.json();

  try {
    const tokenResponse = await fetch(
      "https://auth.atlassian.com/oauth/token",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          grant_type: "authorization_code",
          client_id,
          client_secret,
          code,
          redirect_uri,
        }),
      }
    );

    const tokenData = await tokenResponse.json();
    const { access_token } = tokenData;

    const resourceResponse = await fetch(
      "https://api.atlassian.com/oauth/token/accessible-resources",
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
          Accept: "application/json",
        },
      }
    );

    const resourceData = await resourceResponse.json();
    const cloudid = resourceData[0].id;

    const filePath = path.join(process.cwd(), "jira-data.json");
    fs.writeFileSync(
      filePath,
      JSON.stringify({ access_token, cloudid }, null, 2)
    );

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500 }
    );
  }
}
