(function () {
  var root = document.documentElement;
  var STORAGE_KEY = 'bvsp-lang';
  var state = {
    languages: [],
    defaultCode: 'pt',
    current: 'pt',
    dict: {},
    fallback: {},
    cache: {}
  };

  function storageGet() {
    try {
      return window.localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      return null;
    }
  }

  function storageSet(value) {
    try {
      window.localStorage.setItem(STORAGE_KEY, value);
    } catch (e) {}
  }

  function lookup(obj, key) {
    return key.split('.').reduce(function (o, k) {
      return o && Object.prototype.hasOwnProperty.call(o, k) ? o[k] : undefined;
    }, obj);
  }

  function t(key) {
    var value = lookup(state.dict, key);
    if (typeof value === 'string') return value;
    value = lookup(state.fallback, key);
    return typeof value === 'string' ? value : null;
  }

  function loadJSON(url) {
    return fetch(url).then(function (res) {
      if (!res.ok) throw new Error(url);
      return res.json();
    });
  }

  function loadDict(code) {
    if (!state.cache[code]) {
      state.cache[code] = loadJSON('i18n/' + code + '.json').catch(function (error) {
        delete state.cache[code];
        throw error;
      });
    }
    return state.cache[code];
  }

  function findLang(code) {
    for (var i = 0; i < state.languages.length; i++) {
      if (state.languages[i].code === code) return state.languages[i];
    }
    return null;
  }

  function isAvailable(code) {
    var lang = findLang(code);
    return !!lang && lang.status === 'available';
  }

  function el(tag, attrs, text) {
    var node = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (name) {
      node.setAttribute(name, attrs[name]);
    });
    if (text) node.textContent = text;
    return node;
  }

  function applyTexts() {
    document.querySelectorAll('[data-i18n]').forEach(function (node) {
      var value = t(node.getAttribute('data-i18n'));
      if (value !== null) node.textContent = value;
    });
    document.querySelectorAll('[data-i18n-html]').forEach(function (node) {
      var value = t(node.getAttribute('data-i18n-html'));
      if (value !== null) node.innerHTML = value;
    });
    document.querySelectorAll('[data-i18n-attr]').forEach(function (node) {
      node.getAttribute('data-i18n-attr').split(';').forEach(function (pair) {
        var parts = pair.split(':');
        if (parts.length !== 2) return;
        var value = t(parts[1].trim());
        if (value !== null) node.setAttribute(parts[0].trim(), value);
      });
    });
  }

  function renderSelects() {
    document.querySelectorAll('select[data-lang-select]').forEach(function (select) {
      select.innerHTML = '';
      state.languages.forEach(function (lang) {
        var soon = lang.status !== 'available';
        var option = el('option', { value: lang.code, lang: lang.code, dir: lang.dir }, soon ? lang.name + ' · ' + lang.soonLabel : lang.name);
        if (soon) option.disabled = true;
        if (lang.code === state.current) option.selected = true;
        select.appendChild(option);
      });
    });
  }

  function setLanguage(code, save) {
    if (!isAvailable(code)) code = state.defaultCode;
    return loadDict(code).then(function (data) {
      var lang = findLang(code);
      state.dict = data;
      state.current = code;
      root.setAttribute('lang', code);
      root.setAttribute('dir', lang.dir === 'rtl' ? 'rtl' : 'ltr');
      applyTexts();
      renderSelects();
      if (save) storageSet(code);
      document.dispatchEvent(new CustomEvent('i18n:change', { detail: { code: code } }));
    });
  }

  function detect() {
    var saved = storageGet();
    if (saved && isAvailable(saved)) return saved;
    var prefs = navigator.languages || [navigator.language || ''];
    for (var i = 0; i < prefs.length; i++) {
      var code = String(prefs[i]).toLowerCase().split('-')[0];
      if (isAvailable(code)) return code;
    }
    return state.defaultCode;
  }

  function onChange(event) {
    var target = event.target;
    if (target.matches && target.matches('select[data-lang-select]')) {
      setLanguage(target.value, true).catch(function () {});
    }
  }

  function guess() {
    var saved = storageGet();
    if (saved && /^[a-z]{2,3}$/.test(saved)) return saved;
    var prefs = navigator.languages || [navigator.language || ''];
    var code = String(prefs[0] || '').toLowerCase().split('-')[0];
    return /^[a-z]{2,3}$/.test(code) ? code : 'pt';
  }

  function init() {
    document.addEventListener('change', onChange);
    var early = guess();
    var earlyDict = loadDict(early).catch(function () {
      return null;
    });
    loadJSON('i18n/languages.json')
      .then(function (config) {
        state.languages = config.languages || [];
        state.defaultCode = config['default'] || 'pt';
        var code = detect();
        var fallbackReady = loadDict(state.defaultCode).then(function (fallback) {
          state.fallback = fallback;
        });
        if (code === state.defaultCode) {
          return fallbackReady.then(function () {
            return setLanguage(code, false);
          });
        }
        return earlyDict.then(function () {
          return setLanguage(code, false);
        }).then(function () {
          return fallbackReady.then(applyTexts);
        });
      })
      .catch(function () {
        root.classList.add('i18n-offline');
      });
  }

  window.I18N = {
    t: t,
    setLanguage: setLanguage,
    current: function () {
      return state.current;
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
