const el = id => document.getElementById(id);
const number = id => Number(el(id).value);
const fmt = (value, digits = 2) => new Intl.NumberFormat('pt-BR', { maximumFractionDigits: digits }).format(value);
const brl = value => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
const rooms = el('rooms');
let roomId = 0;
function addRoom(values = {}) {
  roomId += 1;
  const row = document.createElement('div');
  row.className = 'room-row';
  row.innerHTML = `<div class="room-title"><strong>Ambiente ${roomId}</strong><button type="button" class="remove-room" aria-label="Remover ambiente ${roomId}">Remover</button></div><div class="field-grid two"><label>Comprimento <small>metros</small><input class="room-length" type="number" inputmode="decimal" min="0.01" max="10000" step="0.01" value="${values.length ?? ''}" placeholder="Ex.: 5,00" required></label><label>Largura <small>metros</small><input class="room-width" type="number" inputmode="decimal" min="0.01" max="10000" step="0.01" value="${values.width ?? ''}" placeholder="Ex.: 4,00" required></label></div>`;
  row.querySelector('.remove-room').addEventListener('click', () => { if (rooms.children.length > 1) row.remove(); updateRemoveButtons(); });
  rooms.append(row);
  updateRemoveButtons();
}
function updateRemoveButtons() { rooms.querySelectorAll('.remove-room').forEach(button => button.hidden = rooms.children.length === 1); }
function fail(message) { el('form-error').textContent = message; el('form-error').hidden = false; }
function calculate(event) {
  event.preventDefault(); el('form-error').hidden = true;
  const invalidField = [...el('calculator').querySelectorAll('input')].find(input => !input.checkValidity() && (input.required || input.value !== ''));
  if (invalidField) { invalidField.focus(); return fail('Confira o campo destacado. Use um número dentro do intervalo permitido.'); }
  const roomValues = [...rooms.querySelectorAll('.room-row')].map(row => ({ length: Number(row.querySelector('.room-length').value), width: Number(row.querySelector('.room-width').value) }));
  if (roomValues.some(room => !(room.length > 0 && room.width > 0))) return fail('Informe comprimento e largura maiores que zero para cada ambiente.');
  const required = ['tile-width', 'tile-length', 'box-area', 'mortar-rate', 'mortar-bag', 'grout-rate', 'grout-pack'];
  if (required.some(id => !(number(id) > 0))) return fail('Confira as medidas da peça, a cobertura da caixa e os consumos dos materiais.');
  const mortarLoss = number('mortar-loss');
  if (!Number.isFinite(mortarLoss) || mortarLoss < 0 || mortarLoss > 100) return fail('A margem da argamassa deve estar entre 0% e 100%.');
  const area = roomValues.reduce((sum, room) => sum + room.length * room.width, 0);
  const tileLoss = number('layout') / 100;
  const purchaseArea = area * (1 + tileLoss);
  const boxes = Math.ceil(purchaseArea / number('box-area'));
  const mortarKg = area * number('mortar-rate') * (1 + mortarLoss / 100);
  const mortarBags = Math.ceil(mortarKg / number('mortar-bag'));
  const groutKg = area * number('grout-rate');
  const groutPacks = Math.ceil(groutKg / number('grout-pack'));
  if (![area, purchaseArea, boxes, mortarBags, groutPacks].every(Number.isFinite)) return fail('Confira os valores informados e tente novamente.');
  el('results-status').textContent = 'Estimativa pronta'; el('results-title').textContent = 'Sua lista de compras';
  el('results-lead').textContent = `${roomValues.length} ${roomValues.length === 1 ? 'ambiente medido' : 'ambientes medidos'} · valores arredondados para embalagens inteiras`;
  el('area-result').textContent = `${fmt(area)} m²`; el('purchase-area').textContent = `${fmt(purchaseArea)} m² de porcelanato com ${fmt(tileLoss * 100, 0)}% de margem`;
  el('boxes-result').textContent = `${fmt(boxes, 0)} ${boxes === 1 ? 'caixa' : 'caixas'}`; el('boxes-detail').textContent = `${fmt(boxes * number('box-area'))} m² de cobertura comprada`;
  el('mortar-result').textContent = `${fmt(mortarBags, 0)} ${mortarBags === 1 ? 'saco' : 'sacos'}`; el('mortar-detail').textContent = `${fmt(mortarKg)} kg necessários · sacos de ${fmt(number('mortar-bag'))} kg`;
  el('grout-result').textContent = `${fmt(groutPacks, 0)} ${groutPacks === 1 ? 'embalagem' : 'embalagens'}`; el('grout-detail').textContent = `${fmt(groutKg)} kg necessários · embalagens de ${fmt(number('grout-pack'))} kg`;
  const enteredPrices = ['box-price', 'mortar-price', 'grout-price'].some(id => el(id).value !== '');
  const total = boxes * number('box-price') + mortarBags * number('mortar-price') + groutPacks * number('grout-price');
  el('cost-row').hidden = !enteredPrices; el('cost-result').textContent = brl(total); el('results-content').hidden = false;
  const largeTile = number('tile-width') * number('tile-length') > 900;
  el('result-note').textContent = largeTile ? 'Peça acima de 30 × 30 cm: confira na ficha técnica se a aplicação exige dupla colagem e qual consumo de argamassa usar. Confirme todos os rendimentos antes de comprar.' : 'Quantidade estimada. Confira o rendimento e a indicação de uso nas embalagens antes de comprar.';
  if (window.innerWidth < 800) el('results-content').scrollIntoView({ behavior: 'smooth', block: 'start' });
}
el('add-room').addEventListener('click', () => addRoom()); el('calculator').addEventListener('submit', calculate);
el('copy-result').addEventListener('click', async () => {
  const list = `Calcula Piso — lista de compras\nÁrea: ${el('area-result').textContent}\nPorcelanato: ${el('boxes-result').textContent}\nArgamassa: ${el('mortar-result').textContent} (${el('mortar-detail').textContent})\nRejunte: ${el('grout-result').textContent} (${el('grout-detail').textContent})`;
  try { await navigator.clipboard.writeText(list); el('copy-result').textContent = 'Copiado!'; setTimeout(() => el('copy-result').textContent = 'Copiar lista', 1800); }
  catch { fail('Não foi possível copiar automaticamente. Selecione os resultados para copiar.'); }
});
el('print-result').addEventListener('click', () => window.print()); el('year').textContent = new Date().getFullYear(); addRoom({ length: 5, width: 4 });
