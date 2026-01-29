// ==UserScript==
// @name         AjaxTracker
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Logs AJAX. Now waits until merchantos.account.id is ready.
// @match        *://*.merchantos.com/*
// @grant        none
// ==/UserScript==
(function () {
  if (window.top !== window.self) {return};



  const STORAGE_KEY_NAME = "ajax_visit_log";
  let lastKnownUrl = window.location.href
  // Stop double logs
  let lastLogged = {
    url: "",
    time: 0,
    how: ""
  }




  // Delay system
  let merchantosReady = false
  let pendingLogQueue = []




  // pull logs
  function getlogs() {
    let raw = localStorage.getItem(STORAGE_KEY_NAME)
    try {
      let parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) {
        return parsed
      } else {
        console.warn("not an array")
        return
      }
    } catch (error) {
      console.warn("Could not parse");
      (console.error || console.log).call(console, error.stack || error);
      return
    }
  }




  // save logs to local
  function savelog(logArray) {
    localStorage.setItem(STORAGE_KEY_NAME, JSON.stringify(logArray))
  }




  // Queues or logs based on if merchantos.account.id is available
  function logPageVisit(reasonWhy) {
    if (!merchantosReady) {
      pendingLogQueue.push(reasonWhy)
      return
    }
    let ctime = Date.now()
    let currentUrl = window.location.href
    // dupe dectection attempt
    let urlsame = currentUrl === lastLogged.url
    let LastLog = ctime - lastLogged.time
    let recent = LastLog < 100
    let whydiff = reasonWhy !== lastLogged.how
    if (urlsame && recent && whydiff) {
      return
    }
    lastLogged.url = currentUrl
    lastLogged.time = ctime
    lastLogged.how = reasonWhy
    let visitLog = getlogs() || []
    let timeiso = new Date().toISOString()
    let cleanPath = window.location.pathname;
    try {
        if (window.location.href.split("/")[3]) {
            cleanPath = window.location.href.split("/")[3]
        }
    } catch (error) {
        cleanPath = window.location.pathname
        console.warn("Proceeding with cleanPath assignment: " + cleanPath);
        (console.warn || console.log).call(console, error.stack || error);
    }
    let newLogEntry = {
      url: currentUrl,
      pathOnly: cleanPath,
      time: timeiso,
      how: reasonWhy,
      rad: (window.merchantos.account.id)
    }
    try {
      visitLog.push(newLogEntry)
    } catch {
      console.log("failed logging")
    }
    savelog(visitLog)
    console.log("Logged", reasonWhy, "->", newLogEntry.pathOnly)
      screamintothevoid(newLogEntry)
  }




  // wraps pushState and replaceState so we can log when they happen
  function wrapBrowserHistoryMethod(methodName) {
    let originalFunction = window.history[methodName]
    window.history[methodName] = function () {
      let result = originalFunction.apply(this, arguments)
      let newUrl = arguments[2]
      if (newUrl && newUrl !== lastKnownUrl) {
        lastKnownUrl = newUrl
        logPageVisit(methodName)
      }
      return result
    }
  }




  // DOM observer for ajaxy swaps
  const bodyWatcher = new MutationObserver(function () {
    if (window.location.href !== lastKnownUrl) {
      lastKnownUrl = window.location.href
      logPageVisit("mutationObserver")
    }
  })




  // Back/forward button clicks
  window.addEventListener("popstate", function () {
    if (window.location.href !== lastKnownUrl) {
      lastKnownUrl = window.location.href
      logPageVisit("popstate")
    }
  })




  // Wait until account ID is available. Thanks GPT
  let waited = 0
  let waitForMerchantOS = setInterval(() => {
    let hasAccountId = typeof window.merchantos.account.id !== "undefined"
    if (hasAccountId) {
      merchantosReady = true
      clearInterval(waitForMerchantOS)
      // log now and flush anything we tried to log before this
      logPageVisit("firstLoad")
      pendingLogQueue.forEach(reason => logPageVisit(reason))
      pendingLogQueue = []
    }
    waited += 100
    if (waited > 10000) {
      console.warn("never loaded — logging disabled")
      clearInterval(waitForMerchantOS)
    }
  }, 100)




  // Hook in all navigation tracking. wrapBrowserHistoryMethod
  wrapBrowserHistoryMethod("pushState")
  wrapBrowserHistoryMethod("replaceState")




  // nav fallback sometimes needed
  bodyWatcher.observe(document.body, {
    childList: true,
    subtree: true
  })




  // View log in console
    //window.getVisitLog(true) for easy table in logs
  window.getVisitLog = function (debug = false,download = false) {
    let log = getlogs()
    if (debug == true) {
      if (log.length) {
        console.table(log)
      } else {
        console.log("No visit entries found yet")
      }
    }
      
    if(download){
        dump(log)
    }
    return log
  }
  // Clear log
  window.clearVisitLog = function () {
    localStorage.removeItem(STORAGE_KEY_NAME)
    console.log("log cleared")
    return
  }
})()



//shamelessly stolen csv dumper
function dump(log){
// Build CSV
  if (log.length) {
    let csv = ""
    let headers = Object.keys(log[0])
    csv += headers.join(",") + "\n"
    for (let i = 0; i < log.length; i++) {
      let row = []
      for (let j = 0; j < headers.length; j++) {
        let val = log[i][headers[j]]
        if (typeof val === "string" && val.includes(",")) {
          val = '"' + val + '"'
        }
        row.push(val)
      }
      csv += row.join(",") + "\n"
    }
    // Create file and download
    let blob = new Blob([csv], { type: "text/csv" })
    let url = window.URL.createObjectURL(blob)
    let a = document.createElement("a")
    a.href = url
    a.download = "ajax_visit_log.csv"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }
}


function screamintothevoid(data){

  let event = new CustomEvent("LitanyOfActivation", { detail: data })
  window.dispatchEvent(event)
  console.warn("Incantation complete. Broadcasting on sacred frequency")

}
