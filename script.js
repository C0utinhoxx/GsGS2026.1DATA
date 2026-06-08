const state = {
  temperatura: 25,
  energia: 75,
  comunicacao: true,
  historico: []
};

let commOn = true;
let lastAlertLevels = [];

const ALERT_META = {
  ok: {
    icon: 'ti-circle-check',
    desc: 'Todos os parâmetros dentro dos limites operacionais.'
  },
  warn: {
    icon: 'ti-alert-triangle',
    desc: 'Atenção: verifique os sistemas indicados.'
  },
  fail: {
    icon: 'ti-alert-octagon',
    desc: 'Ação imediata necessária — risco à missão.'
  }
};

function toggleComm() {
  commOn = !commOn;
  const tog = document.getElementById('tog-comm');
  tog.className = 'toggle ' + (commOn ? 'on' : '');
}

function pad(n) {
  return String(n).padStart(2, '0');
}

function clock() {
  const d = new Date();
  document.getElementById('clock').textContent =
    `MET ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

setInterval(clock, 1000);
clock();

function notify(title, text, type) {
  if (typeof PNotify === 'undefined') return;

  const types = {
    success: 'success',
    error: 'error',
    warn: 'warning',
    info: 'info'
  };

  PNotify.alert({
    title,
    text,
    type: types[type] || 'info',
    delay: type === 'error' ? 5000 : 3500,
    hide: true,
    closer: true,
    sticker: false,
    width: '320px'
  });
}

function toast(msg, type) {
  const map = {
    error: { title: 'Erro', type: 'error' },
    warn: { title: 'Aviso', type: 'warn' },
    success: { title: 'Sucesso', type: 'success' },
    info: { title: 'Sistema', type: 'info' }
  };
  const cfg = map[type] || map.info;
  notify(cfg.title, msg, cfg.type);
}

function analyzeEntry(e) {
  const alerts = [];

  if (e.temperatura > 80) {
    alerts.push({
      msg: 'Superaquecimento detectado',
      level: 'fail',
      detail: `Temperatura em ${e.temperatura}°C — limite: 80°C`
    });
  }
  if (e.energia < 20) {
    alerts.push({
      msg: 'Nível de energia crítico',
      level: 'warn',
      detail: `Reserva em ${e.energia}% — mínimo recomendado: 20%`
    });
  }
  if (!e.comunicacao) {
    alerts.push({
      msg: 'Perda de comunicação',
      level: 'fail',
      detail: 'Link com a base terrestre interrompido'
    });
  }

  if (alerts.length === 0) {
    alerts.push({
      msg: 'Sistemas nominais',
      level: 'ok',
      detail: 'Nenhuma anomalia detectada nos sensores'
    });
  }

  return alerts;
}

function statusColor(e) {
  if (!e.comunicacao || e.temperatura > 80) return 'fail';
  if (e.energia < 20) return 'warn';
  return 'ok';
}

function renderAlertItem(a) {
  const meta = ALERT_META[a.level] || ALERT_META.ok;
  return `
    <div class="alert-item ${a.level}">
      <i class="ti ${meta.icon} alert-icon"></i>
      <div class="alert-body">
        <div class="alert-msg">${a.msg}</div>
        <div class="alert-desc">${a.detail || meta.desc}</div>
      </div>
    </div>
  `;
}

function pushAlertNotifications(alerts, isNewReading) {
  if (!isNewReading) return;

  const critical = alerts.filter(a => a.level === 'fail' || a.level === 'warn');
  const levels = alerts.map(a => a.level).join(',');

  if (levels === lastAlertLevels.join(',')) return;
  lastAlertLevels = alerts.map(a => a.level);

  critical.forEach(a => {
    notify(
      a.level === 'fail' ? '⚠ Alerta crítico' : '⚡ Aviso operacional',
      `${a.msg} — ${a.detail || ''}`,
      a.level === 'fail' ? 'error' : 'warn'
    );
  });

  if (critical.length === 0 && alerts.some(a => a.level === 'ok')) {
    notify('Missão estável', 'Todos os sensores reportando valores normais.', 'success');
  }
}

function renderStatus(isNewReading) {
  const e = state;
  const status = statusColor(e);

  document.getElementById('sensor-grid').innerHTML = `
    <div class="sensor-card ${e.temperatura > 80 ? 'fail' : e.temperatura > 60 ? 'warn' : 'ok'}">
      <i class="ti ti-temperature sensor-icon"></i>
      <div class="sensor-label">Temperatura</div>
      <div class="sensor-value">${e.temperatura}°C</div>
    </div>
    <div class="sensor-card ${e.energia < 20 ? 'fail' : e.energia < 40 ? 'warn' : 'ok'}">
      <i class="ti ti-battery-charging sensor-icon"></i>
      <div class="sensor-label">Energia</div>
      <div class="sensor-value">${e.energia}%</div>
    </div>
    <div class="sensor-card ${e.comunicacao ? 'ok' : 'fail'}">
      <i class="ti ti-antenna-bars-5 sensor-icon"></i>
      <div class="sensor-label">Comunicação</div>
      <div class="sensor-value">${e.comunicacao ? 'ONLINE' : 'OFFLINE'}</div>
    </div>
  `;

  const alerts = analyzeEntry(e);
  const listEl = document.getElementById('alerts-list');

  if (alerts.length === 0) {
    listEl.innerHTML = '<div class="alerts-empty">Nenhum alerta ativo</div>';
  } else {
    listEl.innerHTML = alerts.map(renderAlertItem).join('');
  }

  pushAlertNotifications(alerts, isNewReading);
}

function submitData() {
  state.temperatura = parseInt(document.getElementById('inp-temp').value, 10);
  state.energia = parseInt(document.getElementById('inp-energy').value, 10);
  state.comunicacao = commOn;

  const entry = {
    timestamp: new Date().toLocaleTimeString('pt-BR'),
    temperatura: state.temperatura,
    energia: state.energia,
    comunicacao: state.comunicacao,
    status: statusColor(state)
  };

  state.historico.unshift(entry);
  document.getElementById('count-nav').textContent = state.historico.length;

  renderStatus(true);
  toast('Leitura registrada com sucesso.', 'success');
}

function simulateData() {
  const t = Math.round(Math.random() * 140 - 30);
  const en = Math.round(Math.random() * 100);
  const c = Math.random() > 0.2;

  document.getElementById('inp-temp').value = t;
  document.getElementById('val-temp').textContent = t + '°C';

  document.getElementById('inp-energy').value = en;
  document.getElementById('val-energy').textContent = en + '%';

  commOn = c;
  document.getElementById('tog-comm').className = 'toggle ' + (c ? 'on' : '');

  toast('Valores simulados aplicados aos controles.', 'info');
}

function renderHistory() {
  const h = state.historico;
  const el = document.getElementById('history-content');

  if (h.length === 0) {
    el.innerHTML = '<div class="empty-state">Nenhuma leitura registrada ainda</div>';
    return;
  }

  el.innerHTML = h.map(e => `
    <div class="history-item">
      <span>${e.timestamp} — ${e.temperatura}°C / ${e.energia}% / ${e.comunicacao ? 'COM OK' : 'SEM COM'}</span>
      <span class="status-badge ${e.status}">${e.status.toUpperCase()}</span>
    </div>
  `).join('');
}

function renderAnalysis() {
  const h = state.historico;
  const el = document.getElementById('analysis-content');

  if (h.length === 0) {
    el.innerHTML = '<div class="empty-state">Sem dados para análise</div>';
    return;
  }

  const avgT = Math.round(h.reduce((a, b) => a + b.temperatura, 0) / h.length);
  const avgE = Math.round(h.reduce((a, b) => a + b.energia, 0) / h.length);
  const fails = h.filter(e => e.status === 'fail').length;

  el.innerHTML = `
    <div class="analysis-grid">
      <div class="analysis-card">
        <div class="label">Temp. média</div>
        <div class="value">${avgT}°C</div>
      </div>
      <div class="analysis-card">
        <div class="label">Energia média</div>
        <div class="value">${avgE}%</div>
      </div>
      <div class="analysis-card">
        <div class="label">Falhas</div>
        <div class="value" style="color:${fails ? 'var(--red)' : 'var(--accent-bright)'}">${fails}</div>
      </div>
    </div>
  `;
}

function show(screen) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));

  document.getElementById('screen-' + screen).classList.add('active');
  document.getElementById('nav-' + screen).classList.add('active');

  if (screen === 'analysis') renderAnalysis();
  if (screen === 'history') renderHistory();
  if (screen === 'status') renderStatus(false);
}

renderStatus(false);
