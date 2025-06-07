function startCarousel() {
    var images = document.querySelectorAll('#carousel img');
    var index = 0;
    setInterval(function() {
      images[index].classList.remove('active');
      index = (index + 1) % images.length;
      images[index].classList.add('active');
    }, 5000);
  }
  
  startCarousel();

  document.addEventListener('DOMContentLoaded', () => {
    startCarousel();
  
    const hamburger = document.getElementById('hamburger');
    const navList = document.querySelector('.list');
  
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navList.classList.toggle('active');
    });
  });

  
// Получаем элементы
const modal = document.getElementById('userModal');
const userIcon = document.getElementById('userIcon');
const closeBtn = document.querySelector('.close');
const authForm = document.getElementById('authForm');
const googleBtn = document.getElementById('googleLogin');

// Открытие модального окна с плавным эффектом
userIcon.addEventListener('click', () => {
  modal.classList.add('show');
});

// Закрытие по крестику
closeBtn.addEventListener('click', () => {
  modal.classList.remove('show');
});

// Закрытие при клике на фон
window.addEventListener('click', (event) => {
  if (event.target === modal) {
    modal.classList.remove('show');
  }
});

// Отправка формы
authForm.addEventListener('submit', function (e) {
  e.preventDefault();

  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();

  if (!username || !password) {
    alert('Пожалуйста, заполните все поля!');
    return;
  }

  // Сохраняем в localStorage
  const userData = {
    username,
    password
  };
  localStorage.setItem('user', JSON.stringify(userData));

  alert('Вы успешно зарегистрированы!');
  modal.classList.remove('show');
  authForm.reset();
});

// Заглушка Google-кнопки
googleBtn.addEventListener('click', () => {
  alert('Вход через Google будет доступен позже.');
});

// Таймер распродажи
function startPromoTimer(endDateStr) {
  const endDate = new Date(endDateStr).getTime();
  const daysEl = document.getElementById('days');
  const hoursEl = document.getElementById('hours');
  const minutesEl = document.getElementById('minutes');
  const secondsEl = document.getElementById('seconds');

  function updateTimer() {
    const now = new Date().getTime();
    const diff = endDate - now;

    if (diff <= 0) {
      clearInterval(timerInterval);
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    daysEl.textContent = String(days).padStart(2, '0');
    hoursEl.textContent = String(hours).padStart(2, '0');
    minutesEl.textContent = String(minutes).padStart(2, '0');
    secondsEl.textContent = String(seconds).padStart(2, '0');
  }

  updateTimer();
  const timerInterval = setInterval(updateTimer, 1000);
}

// Запуск таймера по загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
  // Укажи реальную дату окончания акции
  startPromoTimer('July 31, 2025 23:59:59');
});


document.addEventListener('DOMContentLoaded', () => {
  const openBtn = document.getElementById('open-review-btn');
  const modal = document.getElementById('review-modal');
  const closeBtn = document.getElementById('close-modal');
  const form = document.getElementById('review-form');
  const grid = document.querySelector('.reviews-grid');

  // Открыть окно
  openBtn.addEventListener('click', () => {
    modal.classList.add('active');
  });
  // Закрыть окно крестиком
  closeBtn.addEventListener('click', () => {
    modal.classList.remove('active');
  });
  // Закрыть клик вне окна
  window.addEventListener('click', e => {
    if (e.target === modal) modal.classList.remove('active');
  });

  // Отправка формы
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const data = {
      name: form.name.value,
      category: form.category.value,
      rating: form.rating.value,
      text: form.comment.value
    };
    // POST на сервер
    const res = await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) return alert('Ошибка отправки');
    const review = await res.json();
    // Добавить на страницу
    const div = document.createElement('div');
    div.className = 'review-card';
    div.innerHTML = `
      <h3>${review.name} (${review.category})</h3>
      <div class="review-stars">${'★'.repeat(review.rating)}</div>
      <p>${review.text}</p>
    `;
    grid.appendChild(div);
    // Закрыть и сбросить форму
    modal.classList.remove('active');
    form.reset();
  });
});

document.getElementById('hamburger').onclick = function () {
  document.getElementById('mobileMenu').classList.add('active');
}
document.getElementById('closeMenu').onclick = function () {
  document.getElementById('mobileMenu').classList.remove('active');
}

document.addEventListener('DOMContentLoaded', function() {
  const minPriceInput = document.getElementById('min-price');
  const maxPriceInput = document.getElementById('max-price');
  const categoryCheckboxes = document.querySelectorAll('.category-checkbox');
  const cards = document.querySelectorAll('.product-card');

  function filterProducts() {
    const minPrice = parseInt(minPriceInput.value) || 0;
    const maxPrice = parseInt(maxPriceInput.value) || Infinity;
    // Собираем выбранные категории
    const selectedCategories = Array.from(categoryCheckboxes)
      .filter(cb => cb.checked)
      .map(cb => cb.value);

    cards.forEach(card => {
      const price = parseInt(card.dataset.price);
      const category = card.dataset.category;
      const matchPrice = price >= minPrice && price <= maxPrice;
      const matchCategory = selectedCategories.length === 0 || selectedCategories.includes(category);

      if (matchPrice && matchCategory) {
        card.style.display = '';
      } else {
        card.style.display = 'none';
      }
    });
  }

  minPriceInput.addEventListener('input', filterProducts);
  maxPriceInput.addEventListener('input', filterProducts);
  categoryCheckboxes.forEach(cb => cb.addEventListener('change', filterProducts));
});

    let cart = [];

    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const product = this.closest('.product');
            const id = product.dataset.id;
            const name = product.dataset.name;
            const price = product.dataset.price;

            // Добавляем в корзину
            cart.push({ id, name, price });

            // Обновляем отображение количества
            document.getElementById('cart-count').textContent = cart.length;
        });
    });

    // (Опционально) можно сохранить в localStorage
   localStorage.setItem('cart', JSON.stringify(cart));
    // (Опционально) можно загрузить из localStorage при инициализации
    const savedCart = JSON.parse(localStorage.getItem('cart'));
    if (savedCart) {
        cart = savedCart;
        document.getElementById('cart-count').textContent = cart.length;
    }
    