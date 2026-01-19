// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Инициализация навигации
    initNavigation();

    // Инициализация галереи (если на странице галереи)
    if (document.querySelector('.gallery')) {
        initGallery();
    }

    // Инициализация формы тест-драйва (если на странице тест-драйва)
    if (document.getElementById('testDriveForm')) {
        initTestDriveForm();
    }

    // Инициализация FAQ (если на странице тест-драйва)
    if (document.querySelector('.faq-item')) {
        initFAQ();
    }

    // Инициализация переключения страниц
    initPageSwitching();

    // Установка минимальной даты для формы тест-драйва
    setMinDateForTestDrive();

    // Инициализация анимаций
    initAnimations();
});

// Инициализация навигации
function initNavigation() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            const icon = navToggle.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });

        // Закрытие меню при клике на ссылку
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                const icon = navToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');

                // Обновление активной ссылки
                navLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
            });
        });

        // Закрытие меню при клике вне его
        document.addEventListener('click', function(event) {
            if (!event.target.closest('.nav-container') && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                const icon = navToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }
}

// Инициализация галереи
function initGallery() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Удаляем активный класс со всех кнопок
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Добавляем активный класс нажатой кнопке
            this.classList.add('active');

            const filterValue = this.getAttribute('data-filter');

            // Фильтруем элементы галереи
            galleryItems.forEach(item => {
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 10);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // Инициализация видео-плейсхолдера
    const videoPlaceholder = document.querySelector('.video-placeholder');
    if (videoPlaceholder) {
        videoPlaceholder.addEventListener('click', function() {
            // Сохраняем оригинальный контент
            const originalHTML = this.innerHTML;

            // Показываем состояние загрузки
            this.innerHTML = `
                <div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;">
                    <div style="text-align: center;">
                        <i class="fas fa-spinner fa-spin" style="font-size: 3rem; color: #0066b3; margin-bottom: 20px;"></i>
                        <p>Загрузка видео...</p>
                    </div>
                </div>
            `;

            // Через 1.5 секунды показываем сообщение
            setTimeout(() => {
                this.innerHTML = `
                    <div style="width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 40px;">
                        <i class="fas fa-play-circle" style="font-size: 4rem; color: #0066b3; margin-bottom: 20px;"></i>
                        <h3 style="color: white; margin-bottom: 15px;">Видео недоступно в демонстрационной версии</h3>
                        <p style="color: #b0b7c3; text-align: center; max-width: 400px;">
                            В реальном проекте здесь будет встроенное видео с тест-драйвом BMW i8.
                            Вы можете посмотреть видео на официальном канале BMW.
                        </p>
                        <button class="btn-primary" style="margin-top: 30px; background: transparent; border: 2px solid #0066b3;">
                            <i class="fab fa-youtube"></i> Перейти на YouTube
                        </button>
                    </div>
                `;

                // Добавляем обработчик для кнопки
                const youtubeBtn = this.querySelector('.btn-primary');
                if (youtubeBtn) {
                    youtubeBtn.addEventListener('click', function(e) {
                        e.stopPropagation();
                        window.open('https://www.youtube.com/results?search_query=BMW+i8+test+drive', '_blank');
                    });
                }

                // Возвращаем оригинальный контент через 10 секунд
                setTimeout(() => {
                    this.innerHTML = originalHTML;
                    initGallery(); // Реинициализация
                }, 10000);
            }, 1500);
        });
    }
}

// Инициализация формы тест-драйва
function initTestDriveForm() {
    const form = document.getElementById('testDriveForm');

    if (form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault();

            // Валидация формы
            if (validateForm()) {
                // Показываем индикатор загрузки
                const submitBtn = form.querySelector('button[type="submit"]');
                const originalBtnText = submitBtn.innerHTML;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Отправка...';
                submitBtn.disabled = true;

                // Получаем данные формы
                const formData = {
                    fullName: document.getElementById('fullName').value,
                    phone: document.getElementById('phone').value,
                    email: document.getElementById('email').value,
                    preferredDate: document.getElementById('preferredDate').value,
                    preferredTime: document.getElementById('preferredTime').value,
                    drivingExperience: document.getElementById('drivingExperience').value,
                    location: document.getElementById('location').value,
                    comments: document.getElementById('comments').value,
                    newsletter: document.getElementById('newsletter').checked
                };

                // Имитация отправки на сервер
                setTimeout(() => {
                    // В реальном проекте здесь был бы AJAX-запрос к серверу
                    console.log('Данные формы:', formData);

                    // Показываем сообщение об успехе
                    showFormMessage('Заявка успешно отправлена! Мы свяжемся с вами в течение 2 часов в рабочее время для подтверждения тест-драйва.', 'success');

                    // Сбрасываем форму
                    form.reset();

                    // Восстанавливаем кнопку
                    submitBtn.innerHTML = originalBtnText;
                    submitBtn.disabled = false;

                    // Прокручиваем к началу формы
                    form.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 2000);
            }
        });

        // Форматирование телефона
        const phoneInput = document.getElementById('phone');
        if (phoneInput) {
            phoneInput.addEventListener('input', function(e) {
                let value = e.target.value.replace(/\D/g, '');

                if (value.length > 0) {
                    if (value[0] === '7' || value[0] === '8') {
                        value = value.substring(1);
                    }

                    let formattedValue = '+7 (';

                    if (value.length > 0) {
                        formattedValue += value.substring(0, 3);
                    }
                    if (value.length > 3) {
                        formattedValue += ') ' + value.substring(3, 6);
                    }
                    if (value.length > 6) {
                        formattedValue += '-' + value.substring(6, 8);
                    }
                    if (value.length > 8) {
                        formattedValue += '-' + value.substring(8, 10);
                    }

                    e.target.value = formattedValue;
                }
            });
        }
    }
}

// Валидация формы тест-драйва
function validateForm() {
    const fullName = document.getElementById('fullName').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const email = document.getElementById('email').value.trim();
    const preferredDate = document.getElementById('preferredDate').value;
    const preferredTime = document.getElementById('preferredTime').value;
    const drivingExperience = document.getElementById('drivingExperience').value;
    const agreeTerms = document.getElementById('agreeTerms').checked;

    // Проверка обязательных полей
    if (!fullName) {
        showFormMessage('Пожалуйста, введите ваше ФИО', 'error');
        return false;
    }

    if (!phone) {
        showFormMessage('Пожалуйста, введите ваш телефон', 'error');
        return false;
    }

    // Проверка формата телефона (минимум 10 цифр)
    const phoneDigits = phone.replace(/\D/g, '');
    if (phoneDigits.length < 10) {
        showFormMessage('Пожалуйста, введите корректный номер телефона', 'error');
        return false;
    }

    if (!email) {
        showFormMessage('Пожалуйста, введите ваш email', 'error');
        return false;
    }

    // Проверка формата email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showFormMessage('Пожалуйста, введите корректный email', 'error');
        return false;
    }

    if (!preferredDate) {
        showFormMessage('Пожалуйста, выберите предпочтительную дату', 'error');
        return false;
    }

    if (!preferredTime) {
        showFormMessage('Пожалуйста, выберите предпочтительное время', 'error');
        return false;
    }

    if (!drivingExperience) {
        showFormMessage('Пожалуйста, укажите ваш стаж вождения', 'error');
        return false;
    }

    if (!agreeTerms) {
        showFormMessage('Пожалуйста, согласитесь с обработкой персональных данных', 'error');
        return false;
    }

    return true;
}

// Показать сообщение формы
function showFormMessage(message, type) {
    // Удаляем предыдущие сообщения
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }

    // Создаем новое сообщение
    const messageDiv = document.createElement('div');
    messageDiv.className = `form-message ${type}`;
    messageDiv.innerHTML = `
        <div style="display: flex; align-items: center; gap: 15px;">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}" 
               style="font-size: 1.5rem;"></i>
            <div>
                <strong>${type === 'success' ? 'Успешно!' : 'Ошибка!'}</strong>
                <p style="margin: 5px 0 0 0;">${message}</p>
            </div>
        </div>
    `;

    messageDiv.style.padding = '20px';
    messageDiv.style.borderRadius = '10px';
    messageDiv.style.marginBottom = '30px';
    messageDiv.style.fontWeight = '500';
    messageDiv.style.animation = 'fadeIn 0.5s ease';

    if (type === 'success') {
        messageDiv.style.backgroundColor = 'rgba(40, 167, 69, 0.15)';
        messageDiv.style.color = '#28a745';
        messageDiv.style.border = '1px solid rgba(40, 167, 69, 0.3)';
    } else {
        messageDiv.style.backgroundColor = 'rgba(220, 53, 69, 0.15)';
        messageDiv.style.color = '#dc3545';
        messageDiv.style.border = '1px solid rgba(220, 53, 69, 0.3)';
    }

    // Вставляем сообщение перед формой
    const form = document.getElementById('testDriveForm');
    form.parentNode.insertBefore(messageDiv, form);

    // Автоматически скрываем сообщение через 5 секунд
    if (type === 'success') {
        setTimeout(() => {
            messageDiv.style.opacity = '0';
            messageDiv.style.transform = 'translateY(-10px)';
            messageDiv.style.transition = 'all 0.3s';
            setTimeout(() => {
                messageDiv.remove();
            }, 300);
        }, 5000);
    }
}

// Инициализация FAQ
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        // Скрываем все ответы по умолчанию
        answer.style.maxHeight = '0';
        answer.style.opacity = '0';
        answer.style.overflow = 'hidden';
        answer.style.transition = 'all 0.3s ease';

        question.addEventListener('click', () => {
            // Закрываем все другие открытые FAQ
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    const otherAnswer = otherItem.querySelector('.faq-answer');
                    const otherIcon = otherItem.querySelector('.faq-question i:last-child');

                    otherAnswer.style.maxHeight = '0';
                    otherAnswer.style.opacity = '0';
                    otherAnswer.style.paddingTop = '0';
                    otherItem.classList.remove('active');
                    otherIcon.classList.remove('fa-chevron-up');
                    otherIcon.classList.add('fa-chevron-down');
                }
            });

            // Переключаем текущий FAQ
            const isActive = item.classList.contains('active');
            const icon = question.querySelector('i:last-child');

            if (isActive) {
                answer.style.maxHeight = '0';
                answer.style.opacity = '0';
                answer.style.paddingTop = '0';
                item.classList.remove('active');
                icon.classList.remove('fa-chevron-up');
                icon.classList.add('fa-chevron-down');
            } else {
                answer.style.maxHeight = answer.scrollHeight + 'px';
                answer.style.opacity = '1';
                answer.style.paddingTop = '20px';
                item.classList.add('active');
                icon.classList.remove('fa-chevron-down');
                icon.classList.add('fa-chevron-up');
            }
        });
    });
}

// Установка минимальной даты для формы тест-драйва
function setMinDateForTestDrive() {
    const dateInput = document.getElementById('preferredDate');
    if (dateInput) {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        // Форматируем дату в формате YYYY-MM-DD
        const year = tomorrow.getFullYear();
        const month = String(tomorrow.getMonth() + 1).padStart(2, '0');
        const day = String(tomorrow.getDate()).padStart(2, '0');

        dateInput.min = `${year}-${month}-${day}`;

        // Устанавливаем значение по умолчанию (через 3 дня)
        const defaultDate = new Date(today);
        defaultDate.setDate(defaultDate.getDate() + 3);
        const defaultYear = defaultDate.getFullYear();
        const defaultMonth = String(defaultDate.getMonth() + 1).padStart(2, '0');
        const defaultDay = String(defaultDate.getDate()).padStart(2, '0');

        dateInput.value = `${defaultYear}-${defaultMonth}-${defaultDay}`;
    }
}

// Инициализация анимаций
function initAnimations() {
    // Анимация для карточек при скролле
    const animatedElements = document.querySelectorAll('.feature-card, .spec-item, .gallery-item, .tech-card, .testimonial-card, .scheme-item');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Анимация при скролле
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.backgroundColor = 'rgba(10, 15, 28, 0.95)';
        navbar.style.backdropFilter = 'blur(10px)';
        navbar.style.padding = '10px 0';
    } else {
        navbar.style.backgroundColor = 'rgba(10, 15, 28, 0.9)';
        navbar.style.backdropFilter = 'blur(5px)';
        navbar.style.padding = '15px 0';
    }
});

// Инициализация переключения страниц
function initPageSwitching() {
    // Функция для обновления активной страницы на основе URL
    function updateActivePage() {
        const path = window.location.pathname;
        let pageId = 'homePage';

        if (path.includes('gallery.html') || window.location.hash === '#gallery') {
            pageId = 'galleryPage';
        } else if (path.includes('technologies.html') || window.location.hash === '#technologies') {
            pageId = 'technologiesPage';
        } else if (path.includes('testdrive.html') || window.location.hash === '#testdrive') {
            pageId = 'testDrivePage';
        }

        // Показываем нужную страницу
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });

        const activePage = document.getElementById(pageId);
        if (activePage) {
            activePage.classList.add('active');
        }

        // Обновляем активную ссылку в навигации
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });

        const activeNavLink = document.querySelector(`.nav-link[href="${pageId === 'homePage' ? 'index.html' : pageId.replace('Page', '.html').toLowerCase()}"]`);
        if (activeNavLink) {
            activeNavLink.classList.add('active');
        }
    }

    // Обработка нажатия на ссылки навигации
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                const pageId = this.getAttribute('href').substring(1) + 'Page';

                // Показываем нужную страницу
                document.querySelectorAll('.page').forEach(page => {
                    page.classList.remove('active');
                });

                const activePage = document.getElementById(pageId);
                if (activePage) {
                    activePage.classList.add('active');
                    window.scrollTo(0, 0);
                }

                // Обновляем активную ссылку
                document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
                this.classList.add('active');

                // Обновляем URL
                history.pushState(null, null, `#${this.getAttribute('href').substring(1)}`);
            }
        });
    });

    // Обработка истории браузера
    window.addEventListener('popstate', updateActivePage);

    // Инициализация при загрузке
    updateActivePage();
}

// Инициализация при загрузке
window.addEventListener('load', function() {
    // Добавляем анимацию для hero section
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.style.opacity = '0';
        heroContent.style.transform = 'translateY(30px)';

        setTimeout(() => {
            heroContent.style.transition = 'opacity 1s ease, transform 1s ease';
            heroContent.style.opacity = '1';
            heroContent.style.transform = 'translateY(0)';
        }, 300);
    }

    // Инициализация плавающей анимации для машины в hero
    const heroCar = document.querySelector('.hero-car img');
    if (heroCar) {
        heroCar.style.animation = 'float 6s ease-in-out infinite';
    }
});