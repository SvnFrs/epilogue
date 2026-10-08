# AddEntry

The sheet behind Media's +: pick a kind, search its catalogue by title, pick a result, or add it by hand.

**Provide** `kind` + `onKind`, `query` + `onQuery`, `state` (`results`, `searching`, `empty`, `error`, `manual`), `results` (`{title, year, by, cover, ink, total, unit, inLibrary}`), `onPick(result)`, `onOpenExisting(result)`, `onRetry`, `error`, `starting` + `onStarting`, `manual` + `onManualChange` + `onManual` + `onBack` + `onAdd`, `onClose`, `contained`.

- Catalogues by kind (`KIND[kind].provider`): TMDB for films and series, AniList for anime and manga, IGDB for games, Open Library for books. Music, poems and stories have none and open on the by-hand form.
- Picking fills cover, ink (`nearestCloth` of the sampled cover) and total. A result already in the library says *In your library* and opens the entry instead.
- New entries land on Waiting; *Starting now* puts them on Open. The sheet always says which.
- By hand is one tap away under the results, and the lamp when there are no results or the catalogue fails; the typed title comes along. The by-hand form shows the plate it will wear and a cloth picker.
- Call the catalogues from Epilogue's server, never the page: IGDB's secret must stay server-side, and the server caches results and covers and samples the cover colour. Credit TMDB in About ("This product uses the TMDB API but is not endorsed or certified by TMDB.").
