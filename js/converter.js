(function () {
  var STORAGE_KEY = 'bvsp-moeda';
  var REGION_CURRENCY = {
    US: 'USD', VE: 'VES', HT: 'HTG', BO: 'BOB', CO: 'COP', PE: 'PEN', PY: 'PYG', AR: 'ARS',
    UY: 'UYU', CL: 'CLP', CU: 'CUP', CN: 'CNY', AO: 'AOA', CD: 'CDF', NG: 'NGN', SN: 'XOF',
    CI: 'XOF', ML: 'XOF', BF: 'XOF', TG: 'XOF', BJ: 'XOF', NE: 'XOF', GW: 'XOF', CM: 'XAF',
    GA: 'XAF', CG: 'XAF', TD: 'XAF', CF: 'XAF', GQ: 'XAF', AF: 'AFN', SY: 'SYP', UA: 'UAH',
    LB: 'LBP', BD: 'BDT', GB: 'GBP', ES: 'EUR', PT: 'EUR', FR: 'EUR', IT: 'EUR', DE: 'EUR'
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

  function locale() {
    var lang = document.documentElement.getAttribute('lang') || 'pt';
    var LOCALES = { pt: 'pt-BR', ar: 'ar-u-nu-latn', ht: 'fr-HT' };
    return LOCALES[lang] || lang;
  }

  function currencyName(code) {
    try {
      var names = new Intl.DisplayNames([locale()], { type: 'currency' });
      var name = names.of(code);
      return name ? name.charAt(0).toUpperCase() + name.slice(1) : code;
    } catch (e) {
      return code;
    }
  }

  function money(value, code) {
    var digits = Math.abs(value) > 0 && Math.abs(value) < 0.1 ? 4 : 2;
    try {
      return new Intl.NumberFormat(locale(), {
        style: 'currency',
        currency: code,
        minimumFractionDigits: 2,
        maximumFractionDigits: digits
      }).format(value);
    } catch (e) {
      return code + ' ' + value.toFixed(2);
    }
  }

  function parseAmount(text) {
    var value = String(text).replace(/[^\d.,-]/g, '');
    if (!value) return NaN;
    var lastComma = value.lastIndexOf(',');
    var lastDot = value.lastIndexOf('.');
    if (lastComma > -1 && lastDot > -1) {
      var decimal = lastComma > lastDot ? ',' : '.';
      var thousands = decimal === ',' ? '.' : ',';
      value = value.split(thousands).join('').replace(decimal, '.');
    } else if (lastComma > -1) {
      value = value.split('.').join('').replace(',', '.');
    } else if (/^\d{1,3}(\.\d{3})+$/.test(value)) {
      value = value.split('.').join('');
    }
    return parseFloat(value);
  }

  function initialCurrency(codes) {
    var saved = storageGet();
    if (saved && codes.indexOf(saved) > -1) return saved;
    var prefs = navigator.languages || [navigator.language || ''];
    for (var i = 0; i < prefs.length; i++) {
      var region = String(prefs[i]).split('-')[1];
      var code = region && REGION_CURRENCY[region.toUpperCase()];
      if (code && codes.indexOf(code) > -1) return code;
    }
    return codes[0];
  }

  function start() {
    var form = document.querySelector('[data-converter]');
    if (!form) return;

    var amount = form.querySelector('#conv-amount');
    var select = form.querySelector('#conv-currency');
    var result = form.querySelector('#conv-result');
    var rateLine = form.querySelector('[data-conv-rate]');
    var dateLine = form.querySelector('[data-conv-date]');
    var data = null;
    var current = null;

    function template(name, values) {
      var text = form.getAttribute('data-tpl-' + name) || '';
      Object.keys(values).forEach(function (key) {
        text = text.split('{' + key + '}').join(values[key]);
      });
      return text;
    }

    function direction() {
      var checked = form.querySelector('input[name="conv-direction"]:checked');
      return checked ? checked.value : 'from-brl';
    }

    function fillCurrencies() {
      var codes = Object.keys(data.moedas);
      select.innerHTML = '';
      codes.forEach(function (code) {
        var option = document.createElement('option');
        option.value = code;
        option.textContent = currencyName(code) + ' (' + code + ')';
        select.appendChild(option);
      });
      select.value = current;
    }

    function renderPrices(code, rate) {
      document.querySelectorAll('[data-brl]').forEach(function (cell) {
        cell.textContent = money(parseFloat(cell.getAttribute('data-brl')), 'BRL');
      });
      document.querySelectorAll('[data-brl-conv]').forEach(function (cell) {
        cell.textContent = money(parseFloat(cell.getAttribute('data-brl-conv')) / rate, code);
      });
      document.querySelectorAll('[data-conv-code]').forEach(function (cell) {
        cell.textContent = '(' + code + ')';
      });
    }

    function render() {
      if (!data) return;
      var code = select.value;
      var rate = data.moedas[code];
      var value = parseAmount(amount.value);
      if (isNaN(value)) {
        result.textContent = '–';
      } else if (direction() === 'from-brl') {
        result.textContent = money(value, 'BRL') + ' = ' + money(value / rate, code);
      } else {
        result.textContent = money(value, code) + ' = ' + money(value * rate, 'BRL');
      }
      rateLine.textContent =
        template('rate', { from: money(1, code), to: money(rate, 'BRL') }) +
        ' · ' +
        template('rate', { from: money(1, 'BRL'), to: money(1 / rate, code) });
      var date = new Date(data.data + 'T12:00:00');
      var dateText = data.data;
      try {
        dateText = new Intl.DateTimeFormat(locale(), { dateStyle: 'long' }).format(date);
      } catch (e) {}
      dateLine.textContent = template('date', { date: dateText });
      renderPrices(code, rate);
    }

    form.addEventListener('submit', function (event) {
      event.preventDefault();
    });
    form.addEventListener('input', render);
    select.addEventListener('change', function () {
      current = select.value;
      storageSet(current);
      render();
    });
    document.addEventListener('i18n:change', function () {
      if (!data) {
        if (result.getAttribute('data-error')) result.textContent = template('error', {});
        return;
      }
      fillCurrencies();
      render();
    });

    fetch('data/cotacoes.json')
      .then(function (response) {
        if (!response.ok) throw new Error('cotacoes');
        return response.json();
      })
      .then(function (json) {
        data = json;
        current = initialCurrency(Object.keys(data.moedas));
        fillCurrencies();
        render();
      })
      .catch(function () {
        result.setAttribute('data-error', 'true');
        result.textContent = template('error', {});
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
