const get = id => document.getElementById(id);
const format = (value, digits = 2) => new Intl.NumberFormat('pt-BR', { maximumFractionDigits: digits }).format(value);
const money = value => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

function calculateBoxes(event) {
  event?.preventDefault();
  const form = get('boxes-form');
  const error = get('boxes-error');
  error.hidden = true;
  const invalid = [...form.querySelectorAll('input')].find(input => !input.checkValidity() && (input.required || input.value !== ''));
  if (invalid) {
    invalid.focus();
    error.textContent = 'Confira o campo destacado. Use um número dentro do intervalo permitido.';
    error.hidden = false;
    return;
  }
  const length = Number(get('length').value);
  const width = Number(get('width').value);
  const coverage = Number(get('coverage').value);
  const loss = Number(get('loss').value);
  if (!(length > 0 && width > 0 && coverage > 0)) return;
  const area = length * width;
  const purchaseArea = area * (1 + loss / 100);
  const rawBoxes = purchaseArea / coverage;
  const boxes = Math.ceil(rawBoxes);
  if (![area, purchaseArea, rawBoxes, boxes].every(Number.isFinite)) return;
  get('boxes').textContent = format(boxes, 0);
  get('boxes-unit').textContent = boxes === 1 ? 'caixa' : 'caixas';
  get('area-description').textContent = `Para um ambiente de ${format(area)} m², com ${format(loss, 0)}% de margem.`;
  get('formula').innerHTML = `${format(length)} m × ${format(width)} m = ${format(area)} m²<br>${format(area)} m² × ${format(1 + loss / 100)} = ${format(purchaseArea)} m² com margem<br>${format(purchaseArea)} m² ÷ ${format(coverage)} m² por caixa = ${format(rawBoxes)} → ${format(boxes, 0)} ${boxes === 1 ? 'caixa' : 'caixas'}`;
  get('coverage-description').textContent = `${format(boxes, 0)} ${boxes === 1 ? 'caixa cobre' : 'caixas cobrem'} ${format(boxes * coverage)} m².`;
  const hasPrice = get('price').value !== '';
  get('cost').hidden = !hasPrice;
  if (hasPrice) get('cost').textContent = `Custo estimado: ${money(boxes * Number(get('price').value))}.`;
  if (event) window.trackCalculatorUse?.('caixas_de_piso');
}

get('boxes-form').addEventListener('submit', calculateBoxes);
