const backend = "http://localhost:8000";
const frontend = "http://localhost:3000";

export default async function UseBackend(type, endpoint, body) {
  if (!type || !endpoint) {
    return null;
  }
  const res = await fetch(backend + "/" + endpoint, {
    method: type,
    credentials: "include",
    headers:
      body instanceof FormData
        ? {
            "Access-Control-Allow-Credentials": true,
            "Access-Control-Allow-Origin": frontend,
          }
        : {
            "Content-Type": "application/json",
            "Access-Control-Allow-Credentials": true,
            "Access-Control-Allow-Origin": frontend,
          },
    body:
      type === "POST"
        ? body instanceof FormData
          ? body
          : JSON.stringify(body)
        : undefined,
  });
  if (!res.ok) {
    const errorText = await res.json();
    console.log(errorText);
    return null;
  }
  const json = await res.json();
  return json;
}
