const { useState, useEffect } = React;

// Данные портфолио
const portfolioItems = [
  { id: 'neiro', tag: 'Нейрофото', name: 'Серия семейных нейрофото', desc: 'Нежные портреты с доработкой в нейросетях и ручной ретушью. Для печати и соцсетей. Нажмите, чтобы посмотреть 22 фото.' },
  { id: 'market', tag: 'Маркетплейсы', name: 'Карточки для Wildberries', desc: 'Комплект карточек с нейрофоном, инфографикой и акцентом на выгоды товара.' },
  { id: 'site', tag: 'Сайт', name: 'Лендинг для эксперта', desc: 'Одностраничный сайт с воронкой заявки и интеграцией мессенджера.' },
  { id: 'bot', tag: 'Бот', name: 'Telegram‑бот для комьюнити', desc: 'Бот, который отвечает на типовые вопросы и собирает заявки в одно место.' }
];

// Данные чипов
const chipsData = [
  { type: 'neiro', text: 'НейроФото для брендов и семейных съемок' },
  { type: 'site', text: 'Лендинги и сайты на JS' },
  { type: 'bot', text: 'Боты для бизнеса и комьюнити' },
  { type: 'market', text: 'Карточки для Wildberries и Ozon' }
];

// Компонент карусели
function CarouselModal({ isOpen, onClose, initialIndex = 0 }) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [imgError, setImgError] = useState(false);
  const totalPhotos = 22;
  const imgPath = 'img/';

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') {
        setCurrentIndex(prev => prev > 0 ? prev - 1 : prev);
        setImgError(false);
      }
      if (e.key === 'ArrowRight') {
        setCurrentIndex(prev => prev < totalPhotos - 1 ? prev + 1 : prev);
        setImgError(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose, totalPhotos]);

  if (!isOpen) return null;

  const nextPhoto = () => {
    if (currentIndex < totalPhotos - 1) {
      setCurrentIndex(currentIndex + 1);
      setImgError(false);
    }
  };

  const prevPhoto = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setImgError(false);
    }
  };

  return (
    React.createElement('div', { className: `modal ${isOpen ? 'active' : ''}`, onClick: onClose },
      React.createElement('span', { className: 'modal-close', onClick: onClose }, '×'),
      React.createElement('button', { className: 'carousel-btn carousel-prev', onClick: (e) => { e.stopPropagation(); prevPhoto(); } }, '‹'),
      React.createElement('button', { className: 'carousel-btn carousel-next', onClick: (e) => { e.stopPropagation(); nextPhoto(); } }, '›'),
      React.createElement('div', { className: 'modal-content', onClick: (e) => e.stopPropagation() },
        !imgError ? 
          React.createElement('img', { 
            src: `${imgPath}${currentIndex + 1}.jpg`, 
            alt: `Нейрофото работа ${currentIndex + 1}`,
            onError: () => setImgError(true)
          }) :
          React.createElement('div', { style: { width: 'min(500px, 80vw)', height: 'min(500px, 80vw)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#1a1a2e', borderRadius: '16px', color: '#888', textAlign: 'center', padding: '20px' } },
            React.createElement('div', { style: { fontSize: '64px', marginBottom: '20px' } }, '📷'),
            React.createElement('div', null, 'Фото не найдено'),
            React.createElement('div', { style: { fontSize: '12px', marginTop: '10px' } }, `${imgPath}${currentIndex + 1}.jpg`)
          )
      ),
      React.createElement('div', { className: 'carousel-counter' }, `${currentIndex + 1} / ${totalPhotos}`)
    )
  );
}

// Компонент карточки портфолио
function PortfolioCard({ item, onCardClick }) {
  return React.createElement('article', { className: 'portfolio-item', onClick: () => onCardClick(item.id) },
    React.createElement('div', { className: 'portfolio-tag' }, item.tag),
    React.createElement('div', { className: 'portfolio-name' }, item.name),
    React.createElement('p', { className: 'portfolio-desc' }, item.desc)
  );
}

// Компонент чипа
function Chip({ type, text, onClick }) {
  return React.createElement('div', { className: 'chip', onClick: () => onClick(type) },
    React.createElement('span', { className: 'chip-dot' }),
    text
  );
}

// Компонент фото профиля
function ProfilePhoto() {
  return React.createElement('div', { className: 'photo-inner' },
    React.createElement('img', { 
      src: 'oksana.jpg',
      alt: 'Оксана',
      style: { width: '100%', height: '100%', objectFit: 'cover' },
      onError: (e) => {
        e.target.style.display = 'none';
        e.target.parentElement.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
        e.target.parentElement.innerHTML = `
          <div style="display: flex; align-items: center; justify-content: center; height: 100%; color: white; text-align: center; flex-direction: column;">
            <div style="font-size: 48px; margin-bottom: 10px;">📸</div>
            <div style="font-size: 14px;">Оксана Баннова</div>
          </div>
          <div class="photo-glow"></div>
        `;
      }
    }),
    React.createElement('div', { className: 'photo-glow' })
  );
}

// Главный компонент приложения
function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStartIndex, setModalStartIndex] = useState(0);

  const openCarousel = (startIndex = 0) => {
    setModalStartIndex(startIndex);
    setIsModalOpen(true);
  };

  const handleCardClick = (type) => {
    if (type === 'neiro') {
      openCarousel(0);
    } else {
      alert('Примеры по этому направлению можно посмотреть в Telegram или VK. Напишите мне, и я покажу больше работ!');
    }
  };

  const scrollToElement = (id) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleBriefClick = () => {
    const email = "oksik3505@gmail.com";
    const subject = encodeURIComponent("Проект: нейрофото / сайт / бот");
    const body = encodeURIComponent("Привет, Оксана!\n\nКратко о задаче: \n— Что нужно: \n— Сроки: \n— Ссылки/референсы: \n\nБуду рада сотрудничеству!\n");
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
  };

  return React.createElement('div', null,
    // HERO секция
    React.createElement('section', { className: 'hero' },
      React.createElement('div', { className: 'hero-text' },
        React.createElement('div', { className: 'tagline' },
          React.createElement('span', { className: 'tagline-dot' }),
          'Нейрофото • сайты • автоматизация'
        ),
        React.createElement('div', { className: 'hello' }, 'Привет, я Оксана'),
        React.createElement('h1', null, 'Создаю ', React.createElement('span', null, 'нейрофото'), ', сайты и ботов'),
        React.createElement('p', { className: 'subtitle' }, 'Самозанятая специалистка по визуалу и автоматизации: от вау‑фото для соцсетей и маркетплейсов до продуманных сайтов и умных ботов.'),
        React.createElement('div', { className: 'chips' }, chipsData.map((chip) => React.createElement(Chip, { key: chip.type, type: chip.type, text: chip.text, onClick: handleCardClick }))),
        React.createElement('div', { className: 'edu-wrap' },
          React.createElement('div', { className: 'section-title' }, 'Образование'),
          React.createElement('p', { className: 'edu-item' }, React.createElement('strong', null, 'Прикладная математика и информатика'), ', КемГУ — бакалавриат, 2018'),
          React.createElement('p', { className: 'edu-item' }, React.createElement('strong', null, 'JavaScript‑разработчик'), ', Нетология — 2025')
        ),
        React.createElement('div', { className: 'btn-row' },
          React.createElement('button', { className: 'btn btn-primary', onClick: handleBriefClick },
            React.createElement('span', { className: 'btn-icon' }, '✉'),
            'Обсудить проект'
          ),
          React.createElement('button', { className: 'btn btn-ghost', onClick: () => scrollToElement('portfolio') },
            React.createElement('span', { className: 'btn-icon' }, '★'),
            'Посмотреть примеры'
          )
        )
      ),
      React.createElement('aside', { className: 'hero-media' },
        React.createElement('div', { className: 'photo-wrap' },
          React.createElement(ProfilePhoto, null),
          React.createElement('div', { className: 'badge' },
            React.createElement('div', { className: 'badge-inner' },
              React.createElement('span', { className: 'status-dot' }),
              'Открыта к новым проектам'
            )
          )
        ),
        React.createElement('div', { className: 'accent-pill' },
          React.createElement('span', null, React.createElement('span', { className: 'accent-pill-emoji' }, '⚡'), React.createElement('strong', null, 'Нейрофото, сайты и боты под ключ')),
          React.createElement('span', null, 'Соберу визуал и автоматизацию так, чтобы вам хотелось делиться ссылкой.')
        ),
        React.createElement('div', { className: 'contacts' },
          'Telegram: ', React.createElement('a', { href: 'https://t.me/OksBann', target: '_blank' }, '@OksBann'), ' · VK: ', React.createElement('a', { href: 'https://vk.com/neirooksii', target: '_blank' }, 'vk.com/neirooksii')
        )
      )
    ),
    
    // Портфолио
    React.createElement('section', { className: 'portfolio', id: 'portfolio' },
      React.createElement('div', { className: 'portfolio-inner' },
        React.createElement('div', { className: 'portfolio-header' },
          React.createElement('div', null,
            React.createElement('div', { className: 'section-title' }, 'Портфолио'),
            React.createElement('div', { className: 'portfolio-title' }, 'Мои работы и услуги')
          ),
          React.createElement('div', { className: 'portfolio-sub' }, 'Нажмите на карточку "Нейрофото", чтобы посмотреть 22 фото')
        ),
        React.createElement('div', { className: 'portfolio-grid' }, portfolioItems.map((item) => React.createElement(PortfolioCard, { key: item.id, item: item, onCardClick: handleCardClick })))
      )
    ),
    
    // Контакты
    React.createElement('section', { className: 'contact-section', id: 'contact' },
      React.createElement('div', { className: 'contact-inner' },
        React.createElement('div', { className: 'contact-text' }, 'Хочется обсудить нейрофото, сайт, бота или карточки для маркетплейсов — напишите мне в удобный мессенджер.'),
        React.createElement('div', { className: 'contact-buttons' },
          React.createElement('a', { href: 'https://t.me/OksBann', target: '_blank', className: 'contact-btn telegram' },
            React.createElement('span', { className: 'icon' }, '✈'),
            React.createElement('span', null, 'Написать в Telegram')
          ),
          React.createElement('a', { href: 'https://vk.com/neirooksii', target: '_blank', className: 'contact-btn vk' },
            React.createElement('span', { className: 'icon' }, 'ВК'),
            React.createElement('span', null, 'Написать во VK')
          ),
          React.createElement('a', { href: 'mailto:oksik3505@gmail.com', className: 'contact-btn email' },
            React.createElement('span', { className: 'icon' }, '✉'),
            React.createElement('span', null, 'Письмо на почту')
          )
        )
      )
    ),
    
    // Футер
    React.createElement('footer', { className: 'site-footer' },
      React.createElement('div', { className: 'site-footer-inner' },
        React.createElement('div', null, '© ', new Date().getFullYear(), ' Оксана Баннова. Самозанятая.'),
        React.createElement('div', { className: 'site-footer-actions' },
          React.createElement('button', { className: 'footer-link-btn', onClick: () => scrollToElement('contact') }, 'Связаться'),
          React.createElement('button', { className: 'footer-link-btn', onClick: () => window.scrollTo({ top: 0, behavior: 'smooth' }) }, 'Наверх')
        )
      )
    ),
    
    React.createElement(CarouselModal, { isOpen: isModalOpen, onClose: () => setIsModalOpen(false), initialIndex: modalStartIndex })
  );
}

// Рендерим приложение
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));