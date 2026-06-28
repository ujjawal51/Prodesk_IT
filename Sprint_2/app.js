'use strict';

const state = {
  salary: 0,
  expenses: [],
  currency: 'INR',
  exchangeRate: null,
  chartInstance: null,
};

const DOM = {
  salaryForm: document.getElementById('salary-form'),
  salaryInput: document.getElementById('salary-input'),
  salaryError: document.getElementById('salary-error'),
  salaryPrefix: document.getElementById('salary-prefix'),
  expenseForm: document.getElementById('expense-form'),
  expenseNameInput: document.getElementById('expense-name-input'),
  expenseNameError: document.getElementById('expense-name-error'),
  expenseAmountInput: document.getElementById('expense-amount-input'),
  expenseAmountError: document.getElementById('expense-amount-error'),
  expensePrefix: document.getElementById('expense-prefix'),
  displaySalary: document.getElementById('display-salary'),
  displayExpenses: document.getElementById('display-expenses'),
  displayBalance: document.getElementById('display-balance'),
  statBalanceCard: document.getElementById('stat-balance-card'),
  expenseList: document.getElementById('expense-list'),
  emptyState: document.getElementById('empty-state'),
  expenseCount: document.getElementById('expense-count'),
  chartCanvas: document.getElementById('expense-pie-chart'),
  chartEmptyState: document.getElementById('chart-empty-state'),
  legendExpensesVal: document.getElementById('legend-expenses-val'),
  legendBalanceVal: document.getElementById('legend-balance-val'),
  thresholdBanner: document.getElementById('threshold-banner'),
  thresholdMessage: document.getElementById('threshold-message'),
  closeBannerBtn: document.getElementById('close-banner-btn'),
  currencyToggleBtn: document.getElementById('currency-toggle-btn'),
  currencyBtnText: document.getElementById('currency-btn-text'),
  currencyDisplay: document.getElementById('currency-display'),
  usdToInrRate: document.getElementById('usd-to-inr-rate'),
  rateStatus: document.getElementById('rate-status'),
  downloadPdfBtn: document.getElementById('download-pdf-btn'),
};

const LS_KEYS = {
  SALARY: 'cashflow_salary',
  EXPENSES: 'cashflow_expenses',
  CURRENCY: 'cashflow_currency',
};

function saveToStorage() {
  localStorage.setItem(LS_KEYS.SALARY, JSON.stringify(state.salary));
  localStorage.setItem(LS_KEYS.EXPENSES, JSON.stringify(state.expenses));
  localStorage.setItem(LS_KEYS.CURRENCY, JSON.stringify(state.currency));
}

function loadFromStorage() {
  const savedSalary = localStorage.getItem(LS_KEYS.SALARY);
  const savedExpenses = localStorage.getItem(LS_KEYS.EXPENSES);
  const savedCurrency = localStorage.getItem(LS_KEYS.CURRENCY);
  if (savedSalary !== null) state.salary = parseFloat(JSON.parse(savedSalary)) || 0;
  if (savedExpenses !== null) state.expenses = JSON.parse(savedExpenses) || [];
  if (savedCurrency !== null) state.currency = JSON.parse(savedCurrency);
}

function getTotalExpenses() {
  return state.expenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
}

function getRemainingBalance() {
  return state.salary - getTotalExpenses();
}

function convertAmount(inrValue) {
  if (state.currency === 'USD' && state.exchangeRate) {
    return inrValue / state.exchangeRate;
  }
  return inrValue;
}

function getCurrencySymbol() {
  return state.currency === 'USD' ? '$' : '₹';
}

function formatCurrency(inrValue) {
  const converted = convertAmount(inrValue);
  const symbol = getCurrencySymbol();
  return `${symbol}${converted.toFixed(2)}`;
}

function flashElement(el) {
  el.classList.remove('flash');
  void el.offsetWidth;
  el.classList.add('flash');
  el.addEventListener('animationend', () => el.classList.remove('flash'), { once: true });
}

function renderStats() {
  const totalExpenses = getTotalExpenses();
  const remainingBalance = getRemainingBalance();

  DOM.displaySalary.textContent = formatCurrency(state.salary);
  DOM.displayExpenses.textContent = formatCurrency(totalExpenses);
  DOM.displayBalance.textContent = formatCurrency(remainingBalance);

  flashElement(DOM.displaySalary);
  flashElement(DOM.displayExpenses);
  flashElement(DOM.displayBalance);

  const symbol = getCurrencySymbol();
  DOM.salaryPrefix.textContent = symbol;
  DOM.expensePrefix.textContent = symbol;

  checkThreshold(remainingBalance);

  DOM.legendExpensesVal.textContent = formatCurrency(totalExpenses);
  DOM.legendBalanceVal.textContent = formatCurrency(Math.max(0, remainingBalance));
}

function renderExpenseList() {
  DOM.expenseList.innerHTML = '';

  if (state.expenses.length === 0) {
    DOM.emptyState.classList.remove('hidden');
    DOM.expenseList.classList.add('hidden');
    DOM.expenseCount.textContent = '0 items';
    return;
  }

  DOM.emptyState.classList.add('hidden');
  DOM.expenseList.classList.remove('hidden');
  DOM.expenseCount.textContent = `${state.expenses.length} item${state.expenses.length !== 1 ? 's' : ''}`;

  state.expenses.forEach(exp => {
    const li = createExpenseItem(exp);
    DOM.expenseList.appendChild(li);
  });
}

function createExpenseItem(exp) {
  const li = document.createElement('li');
  li.className = 'list-item';
  li.dataset.id = exp.id;
  li.setAttribute('role', 'listitem');

  const icon = getExpenseIcon(exp.name);

  li.innerHTML = `
    <div class="item-icon">${icon}</div>
    <div class="item-info">
      <span class="item-name" title="${escapeHtml(exp.name)}">${escapeHtml(exp.name)}</span>
      <span class="item-date">${exp.date}</span>
    </div>
    <span class="item-price">${formatCurrency(exp.amount)}</span>
    <button
      class="remove-btn"
      data-id="${exp.id}"
      aria-label="Delete expense: ${escapeHtml(exp.name)}"
      title="Delete this expense"
    >🗑️</button>
  `;

  return li;
}

function getExpenseIcon(name) {
  const n = name.toLowerCase();
  if (/rent|house|flat|pg|hostel/.test(n)) return '🏠';
  if (/food|eat|lunch|dinner|breakfast|restaurant|zomato|swiggy/.test(n)) return '🍔';
  if (/groceries|grocery|market|kirana/.test(n)) return '🛒';
  if (/netflix|prime|spotify|hotstar|ott|subscription/.test(n)) return '📺';
  if (/petrol|fuel|gas|travel|cab|uber|ola/.test(n)) return '⛽';
  if (/electricity|bill|water|internet|wifi|broadband/.test(n)) return '⚡';
  if (/mobile|phone|recharge/.test(n)) return '📱';
  if (/gym|fitness|health/.test(n)) return '💪';
  if (/clothes|shopping|amazon|flipkart/.test(n)) return '🛍️';
  if (/medicine|medical|doctor|hospital/.test(n)) return '💊';
  if (/emi|loan|insurance/.test(n)) return '🏦';
  if (/education|course|tuition|fees/.test(n)) return '📚';
  return '💸';
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

function renderChart() {
  const totalExpenses = getTotalExpenses();
  const remainingBalance = Math.max(0, getRemainingBalance());

  if (state.salary === 0) {
    DOM.chartEmptyState.classList.remove('hidden');
    if (state.chartInstance) {
      state.chartInstance.destroy();
      state.chartInstance = null;
    }
    return;
  }

  DOM.chartEmptyState.classList.add('hidden');

  const chartData = {
    labels: ['Expenses', 'Remaining Balance'],
    datasets: [{
      data: [
        parseFloat(totalExpenses.toFixed(2)),
        parseFloat(remainingBalance.toFixed(2)),
      ],
      backgroundColor: ['rgba(239, 68, 68, 0.85)', 'rgba(124, 58, 237, 0.85)'],
      borderColor: ['rgba(239, 68, 68, 1)', 'rgba(124, 58, 237, 1)'],
      borderWidth: 2,
      hoverBackgroundColor: ['rgba(239, 68, 68, 1)', 'rgba(124, 58, 237, 1)'],
      hoverBorderWidth: 3,
    }],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 600,
      easing: 'easeInOutQuart',
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: function (context) {
            const value = context.parsed;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const pct = total > 0 ? ((value / total) * 100).toFixed(1) : '0.0';
            const rate = (state.currency === 'USD' && state.exchangeRate) ? state.exchangeRate : 1;
            const display = state.currency === 'USD'
              ? `$${(value / rate).toFixed(2)}`
              : `₹${value.toFixed(2)}`;
            return ` ${display} (${pct}%)`;
          },
        },
        backgroundColor: 'rgba(19, 22, 32, 0.9)',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        titleColor: '#f0f4ff',
        bodyColor: '#8892b0',
        padding: 12,
      },
    },
    cutout: '55%',
  };

  if (state.chartInstance) {
    state.chartInstance.destroy();
    state.chartInstance = null;
  }

  state.chartInstance = new Chart(DOM.chartCanvas, {
    type: 'doughnut',
    data: chartData,
    options: chartOptions,
  });
}

function checkThreshold(remainingBalance) {
  const threshold = state.salary * 0.10;
  const isCritical = state.salary > 0 && remainingBalance < threshold;

  if (isCritical) {
    DOM.statBalanceCard.classList.add('critical');
    const pct = state.salary > 0 ? ((remainingBalance / state.salary) * 100).toFixed(1) : 0;
    DOM.thresholdMessage.textContent =
      `⚠️ CRITICAL: Remaining balance (${formatCurrency(remainingBalance)}) is below 10% of your salary! Only ${pct}% remaining.`;
    DOM.thresholdBanner.classList.remove('hidden');
  } else {
    DOM.statBalanceCard.classList.remove('critical');
    DOM.thresholdBanner.classList.add('hidden');
  }
}

function showError(inputEl, errorEl, message) {
  inputEl.classList.add('has-error');
  errorEl.textContent = message;
}

function clearError(inputEl, errorEl) {
  inputEl.classList.remove('has-error');
  errorEl.textContent = '';
}

function validateSalaryForm() {
  const rawVal = DOM.salaryInput.value.trim();
  const val = parseFloat(rawVal);

  clearError(DOM.salaryInput, DOM.salaryError);

  if (rawVal === '' || isNaN(val)) {
    showError(DOM.salaryInput, DOM.salaryError, '⚠ Please enter your salary amount.');
    return false;
  }
  if (val <= 0) {
    showError(DOM.salaryInput, DOM.salaryError, '⚠ Salary must be a positive number.');
    return false;
  }
  return val;
}

function validateExpenseForm() {
  let isValid = true;
  const name = DOM.expenseNameInput.value.trim();
  const rawAmount = DOM.expenseAmountInput.value.trim();
  const amount = parseFloat(rawAmount);

  clearError(DOM.expenseNameInput, DOM.expenseNameError);
  clearError(DOM.expenseAmountInput, DOM.expenseAmountError);

  if (name === '') {
    showError(DOM.expenseNameInput, DOM.expenseNameError, '⚠ Expense name cannot be empty.');
    isValid = false;
  }
  if (rawAmount === '' || isNaN(amount)) {
    showError(DOM.expenseAmountInput, DOM.expenseAmountError, '⚠ Please enter a valid amount.');
    isValid = false;
  } else if (amount <= 0) {
    showError(DOM.expenseAmountInput, DOM.expenseAmountError, '⚠ Amount must be greater than zero.');
    isValid = false;
  }

  if (!isValid) return false;
  return { name, amount };
}

DOM.salaryForm.addEventListener('submit', function (e) {
  e.preventDefault();

  const val = validateSalaryForm();
  if (val === false) return;

  let salaryInInr = val;
  if (state.currency === 'USD' && state.exchangeRate) {
    salaryInInr = val * state.exchangeRate;
  }

  state.salary = parseFloat(salaryInInr.toFixed(2));
  saveToStorage();
  renderStats();
  renderChart();

  DOM.salaryInput.value = '';
  DOM.salaryInput.focus();
});

DOM.expenseForm.addEventListener('submit', function (e) {
  e.preventDefault();

  const result = validateExpenseForm();
  if (result === false) return;

  const { name, amount } = result;

  let amountInInr = amount;
  if (state.currency === 'USD' && state.exchangeRate) {
    amountInInr = amount * state.exchangeRate;
  }

  const newExpense = {
    id: generateId(),
    name: name,
    amount: parseFloat(amountInInr.toFixed(2)),
    date: getTodayDate(),
  };

  state.expenses.push(newExpense);
  saveToStorage();

  appendExpenseItemAnimated(newExpense);
  updateExpenseCount();
  renderStats();
  renderChart();

  DOM.expenseNameInput.value = '';
  DOM.expenseAmountInput.value = '';
  DOM.expenseNameInput.focus();
});

DOM.expenseList.addEventListener('click', function (e) {
  const deleteBtn = e.target.closest('.remove-btn');
  if (!deleteBtn) return;
  deleteExpense(deleteBtn.dataset.id);
});

DOM.closeBannerBtn.addEventListener('click', function () {
  DOM.thresholdBanner.classList.add('hidden');
});

DOM.currencyToggleBtn.addEventListener('click', function () {
  if (state.currency === 'INR') {
    fetchExchangeRate();
  } else {
    switchToINR();
  }
});

DOM.downloadPdfBtn.addEventListener('click', generatePDFReport);

function deleteExpense(id) {
  const itemEl = DOM.expenseList.querySelector(`[data-id="${id}"]`);

  if (itemEl) {
    itemEl.classList.add('slide-out');
    itemEl.addEventListener('animationend', function () {
      itemEl.remove();
      state.expenses = state.expenses.filter(exp => exp.id !== id);
      saveToStorage();

      if (state.expenses.length === 0) {
        DOM.emptyState.classList.remove('hidden');
        DOM.expenseList.classList.add('hidden');
      }

      updateExpenseCount();
      renderStats();
      renderChart();
    }, { once: true });
  } else {
    state.expenses = state.expenses.filter(exp => exp.id !== id);
    saveToStorage();
    renderExpenseList();
    renderStats();
    renderChart();
  }
}

function appendExpenseItemAnimated(exp) {
  DOM.emptyState.classList.add('hidden');
  DOM.expenseList.classList.remove('hidden');

  const li = createExpenseItem(exp);
  li.classList.add('slide-in');
  DOM.expenseList.insertBefore(li, DOM.expenseList.firstChild);
}

function updateExpenseCount() {
  const count = state.expenses.length;
  DOM.expenseCount.textContent = `${count} item${count !== 1 ? 's' : ''}`;
}

async function fetchExchangeRate() {
  DOM.currencyToggleBtn.disabled = true;
  DOM.rateStatus.className = 'rate-note loading';
  DOM.rateStatus.innerHTML = '<span class="spinner"></span> Fetching live rate...';
  DOM.usdToInrRate.textContent = '--';

  const API_URLS = [
    'https://api.frankfurter.app/latest?from=USD&to=INR',
    'https://open.er-api.com/v6/latest/USD',
  ];

  let rate = null;
  let lastError = null;

  for (const url of API_URLS) {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      if (data.rates && data.rates.INR) {
        rate = parseFloat(data.rates.INR);
        break;
      }
    } catch (err) {
      lastError = err;
    }
  }

  if (rate !== null) {
    state.exchangeRate = rate;
    state.currency = 'USD';
    saveToStorage();

    DOM.usdToInrRate.textContent = `${rate.toFixed(2)}`;
    DOM.rateStatus.className = 'rate-note success';
    DOM.rateStatus.textContent = `✅ Live rate fetched: 1 USD = ₹${rate.toFixed(2)}`;
    DOM.currencyDisplay.textContent = '$ USD';
    DOM.currencyBtnText.textContent = 'Switch to INR';
    DOM.currencyToggleBtn.disabled = false;

    renderStats();
    renderChart();
    renderExpenseList();
  } else {
    console.error('All currency APIs failed:', lastError);
    DOM.rateStatus.className = 'rate-note error';
    DOM.rateStatus.textContent = '❌ Could not fetch live rate. Try again later.';
    DOM.currencyToggleBtn.disabled = false;
  }
}

function switchToINR() {
  state.currency = 'INR';
  saveToStorage();

  DOM.currencyDisplay.textContent = '₹ INR';
  DOM.currencyBtnText.textContent = 'Switch to USD';
  DOM.rateStatus.className = 'rate-note';
  DOM.rateStatus.textContent = 'Click "Switch to USD" to fetch live rate';

  renderStats();
  renderChart();
  renderExpenseList();
}

function generatePDFReport() {
  const { jsPDF } = window.jspdf;

  if (!jsPDF) {
    alert('PDF library not loaded. Please check your internet connection.');
    return;
  }

  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 20;
  let y = 20;

  const totalExpenses = getTotalExpenses();
  const balance = getRemainingBalance();
  const today = new Date().toLocaleDateString('en-IN', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  doc.setFillColor(13, 15, 23);
  doc.rect(0, 0, pageW, 35, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.text('Cash-Flow Report', margin, y + 5);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(136, 146, 176);
  doc.text(`Salary & Expense Summary - ${today}`, margin, y + 13);

  y = 45;

  doc.setFillColor(26, 30, 46);
  doc.roundedRect(margin, y, pageW - margin * 2, 45, 3, 3, 'F');

  const pdfPrefix = state.currency === 'USD' ? 'USD ' : 'INR ';

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(136, 146, 176);
  doc.text('TOTAL SALARY', margin + 8, y + 10);
  doc.setFontSize(13);
  doc.setTextColor(52, 211, 153);
  doc.text(`${pdfPrefix}${convertAmount(state.salary).toFixed(2)}`, margin + 8, y + 22);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(136, 146, 176);
  doc.text('TOTAL EXPENSES', margin + 68, y + 10);
  doc.setFontSize(13);
  doc.setTextColor(252, 165, 165);
  doc.text(`${pdfPrefix}${convertAmount(totalExpenses).toFixed(2)}`, margin + 68, y + 22);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(136, 146, 176);
  doc.text('REMAINING BALANCE', margin + 128, y + 10);
  doc.setFontSize(13);
  const balColor = balance < state.salary * 0.1 ? [239, 68, 68] : [167, 139, 250];
  doc.setTextColor(...balColor);
  doc.text(`${pdfPrefix}${convertAmount(Math.max(0, balance)).toFixed(2)}`, margin + 128, y + 22);

  if (state.currency === 'USD' && state.exchangeRate) {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8);
    doc.setTextColor(136, 146, 176);
    doc.text(`* Converted at 1 USD = INR ${state.exchangeRate.toFixed(2)}`, margin + 8, y + 38);
  }

  y += 60;

  doc.setFillColor(124, 58, 237);
  doc.rect(margin, y, pageW - margin * 2, 10, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.text('#', margin + 4, y + 7);
  doc.text('Expense Name', margin + 14, y + 7);
  doc.text('Date', margin + 105, y + 7);
  doc.text('Amount', margin + 143, y + 7);

  y += 14;

  if (state.expenses.length === 0) {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(10);
    doc.setTextColor(136, 146, 176);
    doc.text('No expenses logged yet.', margin + 4, y + 6);
    y += 14;
  } else {
    state.expenses.forEach((exp, index) => {
      const isEvenRow = index % 2 === 0;

      if (isEvenRow) {
        doc.setFillColor(26, 30, 46);
      } else {
        doc.setFillColor(240, 242, 248);
      }
      doc.rect(margin, y - 4, pageW - margin * 2, 12, 'F');

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);

      if (isEvenRow) {
        doc.setTextColor(240, 244, 255);
      } else {
        doc.setTextColor(30, 30, 50);
      }

      const displayName = exp.name.length > 32 ? exp.name.substring(0, 29) + '...' : exp.name;
      doc.text(`${index + 1}`, margin + 4, y + 4);
      doc.text(displayName, margin + 14, y + 4);
      doc.text(exp.date, margin + 105, y + 4);

      if (isEvenRow) {
        doc.setTextColor(252, 165, 165);
      } else {
        doc.setTextColor(180, 40, 40);
      }
      doc.text(`-${pdfPrefix}${convertAmount(exp.amount).toFixed(2)}`, margin + 143, y + 4);

      y += 12;

      if (y > 270) {
        doc.addPage();
        y = 20;
        doc.setFillColor(124, 58, 237);
        doc.rect(margin, y, pageW - margin * 2, 10, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.setTextColor(255, 255, 255);
        doc.text('#', margin + 4, y + 7);
        doc.text('Expense Name', margin + 14, y + 7);
        doc.text('Date', margin + 105, y + 7);
        doc.text('Amount', margin + 143, y + 7);
        y += 14;
      }
    });
  }

  y += 5;
  doc.setFillColor(19, 22, 32);
  doc.rect(margin, y, pageW - margin * 2, 12, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(167, 139, 250);
  doc.text('Net Remaining Balance:', margin + 4, y + 8);
  const balanceColor = balance < state.salary * 0.1 ? [239, 68, 68] : [52, 211, 153];
  doc.setTextColor(...balanceColor);
  doc.text(`${pdfPrefix}${convertAmount(Math.max(0, balance)).toFixed(2)}`, margin + 143, y + 8);

  y += 25;
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8);
  doc.setTextColor(74, 85, 104);
  doc.text('Generated by Cash-Flow', margin, y);

  const fileName = `CashFlow_Report_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

function getTodayDate() {
  return new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function init() {
  loadFromStorage();

  if (state.currency === 'USD' && state.exchangeRate) {
    DOM.currencyDisplay.textContent = '$ USD';
    DOM.currencyBtnText.textContent = 'Switch to INR';
    DOM.usdToInrRate.textContent = `${state.exchangeRate.toFixed(2)}`;
    DOM.rateStatus.className = 'rate-status success';
    DOM.rateStatus.textContent = `✅ Rate from last session: 1 USD = ₹${state.exchangeRate.toFixed(2)}`;
  }

  renderStats();
  renderExpenseList();
  renderChart();
}

init();
