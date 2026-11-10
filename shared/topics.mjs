const nav=document.querySelector('[data-topic-site]');
function markTopic(){if(!nav)return;const site=nav.dataset.topicSite,hash=location.hash.slice(1);let active=site;if(site==='ganzhi'){if(/^(body(?:-entry|-region)?(?:\/|$)|article\/body-|sources\/body-)/.test(hash))active='body';else if(/^(plants?$|plant\/|article\/plant-|sources\/plant-)/.test(hash))active='plants';}for(const a of nav.querySelectorAll('[data-topic]')){if(a.dataset.topic===active)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');}}
markTopic();addEventListener('hashchange',markTopic);
