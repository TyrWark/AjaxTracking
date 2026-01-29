// ==UserScript==
// @name         EchoesintotheGloam
// @namespace    http://tampermonkey.net/
// @version      2025-08-01
// @description  try to take over the world!
// @author       You
// @match        *://*.merchantos.com/*
// @grant        none
// ==/UserScript==
  window.addEventListener("LitanyOfActivation", function (message) {
    let data = message.detail
    console.warn("Receiving the Machine God's truth...")
    console.log(data)
    //Method to fetch data. MUST BE ON SAME DOMAIN
    let log = JSON.parse(localStorage.getItem("ajax_visit_log"))
    console.log(log)
  })
