(() => {
  const form = document.getElementById('mortar-form');
  const error = document.getElementById('mortar-error');
  const get = id => document.getElementById(id);
  const number = id => Number(get(id).value.replace(',', '.'));
  const format = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 2 });
  const money = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

  function calculate(event) {
    if (event) event.preventDefault();
    const area = number('area');
    const rate = number('rate');
    const loss = number('loss');
    const bag = number('bag');
    const priceField = get('price').value.trim();
    const price = priceField === '' ? null : number('price');
    const valid = area > 0 && area <= 100000 && rate > 0 && rate <= 50 &&
      loss >= 0 && loss <= 100 && bag > 0 && bag <= 100 &&
      (price === null || (price >= 0 && price <= 100000));
    if (!valid) {
      error.textContent = 'Confira os números informados. Área, consumo e peso do saco devem ser maiores que zero.';
      error.hidden = false;
      return;
    }
    error.hidden = true;
    const factor = 1 + loss / 100;
    const kilograms = area * rate * factor;
    const exactBags = kilograms / bag;
    const bags = Math.ceil(exactBags - 1e-10);
    get('bags').textContent = format.format(bags);
    get('bag-size').textContent = format.format(bag);
    get('weight').textContent = `${format.format(kilograms)} kg estimados para ${format.format(area)} m².`;
    get('formula').innerHTML = `${format.format(area)} m² × ${format.format(rate)} kg/m² × ${format.format(factor)} = ${format.format(kilograms)} kg<br>${format.format(kilograms)} kg ÷ ${format.format(bag)} kg = ${format.format(exactBags)} → ${format.format(bags)} sacos`;
    get('cost').hidden = price === null;
    if (price !== null) get('cost').textContent = `Custo estimado: ${money.format(bags * price)} (${format.format(bags)} sacos × ${money.format(price)}).`;
  }

  form.addEventListener('submit', calculate);
  form.addEventListener('input', calculate);
  calculate();
})();
