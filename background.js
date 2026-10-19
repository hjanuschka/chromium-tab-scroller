// Copyright 2026 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

const setting = chrome.uiSettings.scrollEventChangesTab;

chrome.runtime.onInstalled.addListener(async () => {
  await setting.set({value: true});
  const {value, levelOfControl} = await setting.get({});
  console.log(`scrollEventChangesTab: ${value} (${levelOfControl})`);
});
