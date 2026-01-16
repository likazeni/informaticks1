// Фильтрация изображений в галерее
document.addEventListener('DOMContentLoaded', function() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    // Обработка кликов по кнопкам фильтра
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Убираем активный класс у всех кнопок
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Добавляем активный класс текущей кнопке
            this.classList.add('active');

            const filterValue = this.getAttribute('data-filter');

            // Показываем/скрываем элементы галереи
            // galleryItems.forEach(item => {
            //     if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
            //         item.style.display = 'block';
            //         // Анимация появления
            //         setTimeout(() => {
            //             item.style.opacity = '1';
            //             item.style.transform = 'translateY(0)';
            //         }, 10);
            //     } else {
            //         item.style.opacity = '0';
            //         item.style.transform = 'translateY(20px)';
            //         setTimeout(() => {
            //             item.style.display = 'none';
            //         }, 300);
            //     }
            // });
        });
    });

    // Инициализация галереи
    function initGallery() {
        // Добавляем начальные стили для анимации
        galleryItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';

            // Постепенное появление элементов
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, 100 + (index * 100));
        });
    }

    initGallery();

    // Эффект при наведении на изображения
    const galleryImages = document.querySelectorAll('.gallery-image');
    galleryImages.forEach(image => {
        image.addEventListener('mouseenter', function() {
            this.style.filter = 'sepia(0.3) grayscale(0.3) brightness(1.1)';
        });

        image.addEventListener('mouseleave', function() {
            this.style.filter = 'sepia(0.2) grayscale(0.1)';
        });
    });
});