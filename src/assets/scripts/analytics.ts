if (import.meta.env.MODE !== 'development') {
  const GA_ID = 'G-PW30Q3ZHX1'
  const analytics = document.createElement('script')
  analytics.async = true
  analytics.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`

  const analyticsScript = document.createElement('script')
  analyticsScript.appendChild(
    document.createTextNode(`
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());

    gtag('config', '${GA_ID}');
    console.log('Analytics Ready')
  `)
  )

  document.head.appendChild(document.createComment('Google tag (gtag.js)'))
  document.head.appendChild(analytics)
  document.head.appendChild(analyticsScript)
}
