import { createFileRoute } from "@tanstack/react-router";
import { getIndecIndicator, IndecServiceError } from "@/features/radar/server/indec";

export const Route = createFileRoute("/api/radar/$indicator")({
  server: {
    handlers: {
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
            limit: url.searchParams.get("limit") ?? undefined,
            offset: url.searchParams.get("offset") ?? undefined,
          });

          return Response.json(result.result, {
            status: result.status,
            headers: {
              "Cache-Control": "public, max-age=60, s-maxage=900, stale-while-revalidate=3600",
              "X-Content-Type-Options": "nosniff",
            },
          });
        } catch (error) {
          if (error instanceof IndecServiceError) {
            return Response.json(
              { error: error.message },
              {
                status: error.status,
                headers: {
                  "Cache-Control": "no-store",
                  "X-Content-Type-Options": "nosniff",
                },
              },
            );
          }

          console.error("[Radar INDEC] Error inesperado al consultar el servicio.");
          return Response.json(
            { error: "No se pudo completar la consulta estadística." },
            {
              status: 500,
              headers: {
                "Cache-Control": "no-store",
                "X-Content-Type-Options": "nosniff",
              },
            },
          );
        }
      },
    },
  },
});
