// Copyright 2026 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

const setting = chrome.uiSettings.scrollEventChangesTab;
const toggle = document.getElementById('toggle');
const control = document.getElementById('control');

async function render() {
  const details = await setting.get({});
  toggle.checked = details.value;
  // "controlled_by_this_extension" also means we may change the value;
  // only the platform default (no extension authority) is read-only.
  toggle.disabled = details.levelOfControl === 'default';
  control.textContent = details.levelOfControl.replaceAll('_', ' ');
}

toggle.addEventListener('change', async () => {
  // Clearing instead of setting false hands the preference back to Chrome's
  // platform default, which is what an uninstall would do.
  if (toggle.checked) {
    await setting.set({value: true});
  } else {
    await setting.clear({});
  }
  await render();
});

render();
