const handler = (request: Request, opts?: { convexSiteUrl?: string }) => {
  const requestUrl = new URL(request.url);
  const convexSiteUrl =
    opts?.convexSiteUrl ?? process.env.NEXT_PUBLIC_CONVEX_SITE_URL;
  if (!convexSiteUrl) {
    throw new Error("NEXT_PUBLIC_CONVEX_SITE_URL is not set");
  }
  const convexSiteUrlObject = new URL(convexSiteUrl);
  const nextUrl = `${convexSiteUrlObject.origin}${requestUrl.pathname}${requestUrl.search}`;
  const newRequest = new Request(nextUrl, request);
  newRequest.headers.set("accept-encoding", "application/json");
  newRequest.headers.set("host", convexSiteUrlObject.host);
  return fetch(newRequest, { method: request.method, redirect: "manual" });
};

export const nextJsHandlerCustom = (opts?: { convexSiteUrl?: string }) => ({
  GET: (request: Request) => handler(request, opts),
  POST: (request: Request) => handler(request, opts),
});
