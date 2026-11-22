import { createFileRoute } from "@tanstack/react-router";
import { getIndecIndicator, IndecServiceError } from "@/features/radar/server/indec";

const ALLOWED_ORIGINS = new Set(["https://datacraft-argentina.lovable.app"]);

function corsHeaders(request: Request): Headers {
  const headers = new Headers({
    "Vary": "Origin",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Authorization, Content-Type",
    "Access-Control-Max-Age": "86400",
  });
  const origin = request.headers.get("Origin");
  if (origin && ALLOWED_ORIGINS.has(origin)) {
    headers.set("Access-Control-Allow-Origin", origin);
  }
  return headers;
}

function jsonResponse(request: Request, body: unknown, status: number, cacheControl: string): Response {
  const headers = corsHeaders(request);
  headers.set("Cache-Control", cacheControl);
  headers.set("X-Content-Type-Options", "nosniff");
  return Response.json(body, { status, headers });
}

export const Route = createFileRoute("/api/radar/$indicator")({
  server: {
    handlers: {
      OPTIONS: async ({ request }) => new Response(null, {
        status: 204,
        headers: corsHeaders(request),
      }),
      GET: async ({ params, request }) => {
        try {
          const url = new URL(request.url);
          const result = await getIndecIndicator(params.indicator, {
            period: url.searchParams.get("period") ?? undefined,
            from: url.searchParams.get("from") ?? undefined,
            region: url.searchParams.get("region") ?? undefined,
            series: url.searchParams.get("series") ?? undefined,
            indicatorType: url.searchParams.get("indicatorType") ?? undefined,
            category: url.searchParams.get("category") ?? undefined,
            indicator: url.searchParams.get("indicator") ?? undefined,
            classification: url.searchParams.get("classification") ?? undefined,
            level: url.searchParams.get("level") ?? undefined,
            openingCode: url.searchParams.get("openingCode") ?? undefined,
            metric: url.searchParams.get("metric") ?? undefined,
            dimensions: url.searchParams.get("dimensions") ?? undefined,
            limit: url.searchParams.get("limit") ?? undefined,
            offset: url.searchParams.get("offset") ?? undefined,
          });

          return jsonResponse(request, result.result, result.status,
            "public, max-age=60, s-maxage=900, stale-while-revalidate=3600");
        } catch (error) {
          if (error instanceof IndecServiceError) {
            return jsonResponse(request, { error: error.message }, error.status, "no-store");
          }

          console.error("[Radar INDEC] Error inesperado al consultar el servicio.");
          return jsonResponse(request,
            { error: "No se pudo completar la consulta estadística." }, 500, "no-store");
        }
      },
    },
  },
});
