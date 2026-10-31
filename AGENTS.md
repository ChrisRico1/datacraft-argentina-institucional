<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Observatorio
- Keep studies in a typed catalog and render their detail through `/observatorio/$slug`; adding catalog entries must not duplicate pages.
- Keep public verified records in local JSON and use the validated CSV/JSON adapter for future endpoints; no database or server-side imports are needed for this phase.
- Import Leaflet dynamically after hydration and keep map references separate from data records; SSR must not evaluate browser-only libraries.
- Preserve source dates, spatial scope, units and service classification in all records; missing values are null, never invented zeroes.
