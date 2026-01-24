// public/ga-init.js

;(function () {
  try {
    var GA_ID = window.__GA_ID__
    if (!GA_ID) return

    window.dataLayer = window.dataLayer || []
    function gtag() {
      window.dataLayer.push(arguments)
    }
    window.gtag = window.gtag || gtag

    gtag('js', new Date())
    gtag('config', GA_ID, {
      page_path: window.location.pathname,
    })
  } catch (e) {
    // GA 때문에 앱이 죽지 않도록 보호
    console.error('GA init failed', e)
  }
})()
