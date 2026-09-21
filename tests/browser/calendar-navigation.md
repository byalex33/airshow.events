# Calendar navigation regression check

Run against a local production build with `npm run build` then `npm start`.
Use the browser's Back and Forward controls for history checks.

1. Open `/calendar/`. Confirm the search is empty and Cards is selected.
2. Search for `Spitfire`. Confirm the URL contains `q=Spitfire`, the field keeps the full text as you type, and every result matches the search.
3. Select List. Confirm the URL also contains `view=list` and results use the list layout.
4. Click the header's Calendar link. Confirm the URL becomes `/calendar/`, the search clears, Cards is selected, and the full result set returns without a reload.
5. Go Back. Confirm the search, filtered results and List view return together.
6. Go Forward. Confirm the empty search, full results and Cards view return together.
7. Go Back, then reload. Confirm `q=Spitfire&view=list` still produces the same search, results and List view.
8. Open `/calendar/?q=Spitfire&view=map`. Confirm the map and search match the URL. Click the header's Calendar link and confirm Cards returns.
9. Open `/calendar/?view=invalid`. Confirm Cards is selected. Select List, then Cards, and confirm the `view` parameter is removed.
10. Change a region or month, clear filters, then reload. Confirm the cleared filter state persists while the selected view is retained.

The URL must stay stable after each navigation or edit. Watch for repeated navigation, lost keystrokes or stale fields.
