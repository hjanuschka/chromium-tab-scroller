# chromium-tab-scroller

Chrome extension that switches tabs when you scroll the mouse wheel over the
tab strip, using the proposed `chrome.uiSettings` extension API.

Chrome enables scroll-to-switch-tabs by default on Linux only, a leftover from
the pre-Aura GTK2 days -- GTK itself never had the behavior. The plan is to
drop the Linux default so all desktop platforms behave the same, and to let
people who want the behavior turn it back on from an extension, on any
platform. This extension is that opt-in.

- Tracking bug: https://crbug.com/41294683
- Chromium CL adding the API: https://crrev.com/c/8613408

## What it does

On install it enables the behavior:

```js
chrome.uiSettings.scrollEventChangesTab.set({value: true});
```

The toolbar popup toggles it. Unchecking calls `clear()` rather than
`set({value: false})`, which hands the preference back to Chrome's default --
the same thing that happens if you uninstall the extension.

## Requirements

The `chrome.uiSettings` API is not in any released Chrome yet. You need a build
that contains the CL above, started with the feature flag:

```sh
chrome --enable-features=ApiUiSettings \
       --load-extension=/path/to/chromium-tab-scroller
```

The `uiSettings` permission is unavailable without `ApiUiSettings`, so the
extension will fail to load on a stock Chrome.

## Verified

```
$ chrome --user-data-dir=/tmp/udd --enable-features=ApiUiSettings \
         --load-extension=./chromium-tab-scroller about:blank
INFO:CONSOLE: "scrollEventChangesTab: true (controlled_by_this_extension)",
  source: chrome-extension://kkpalflifkjhenoaokgfjihibhhjgmca/background.js

$ jq '.extensions.settings[].preferences | select(. != null)' /tmp/udd/Default/Preferences
{
  "tabs.scroll_event_changes_tab": true
}
```

## Files

| File | Purpose |
| --- | --- |
| `manifest.json` | MV3 manifest, declares the `uiSettings` permission |
| `background.js` | Enables the setting on install |
| `popup.html` / `popup.js` | Toggle plus the current `levelOfControl` |
