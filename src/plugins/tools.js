import Vue from 'vue'

Vue.prototype.$setTdk = function (t, d, k) {
  return {
    title: t,
    meta: [
      { hid: 'description', name: 'description', content: d },
      { hid: 'keywords', name: 'keywords', content: k }
    ]
  }
}
