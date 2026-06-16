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
    <div className={`modal ${isOpen ? 'active' : ''}`} onClick={onClose}>
      <span className="modal-close" onClick={onClose}>&times;</span>
      <button className="carousel-btn carousel-prev" onClick={(e) => { e.stopPropagation(); prevPhoto(); }}>‹</button>
      <button className="carousel-btn carousel-next" onClick={(e) => { e.stopPropagation(); nextPhoto(); }}>›</button>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {!imgError ? (
          <img 
            src={`${imgPath}${currentIndex + 1}.jpg`} 
            alt={`Нейрофото работа ${currentIndex + 1}`}
            onError={() => setImgError(true)}
          />
        ) : (
          <div style={{
            width: 'min(500px, 80vw)',
            height: 'min(500px, 80vw)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#1a1a2e',
            borderRadius: '16px',
            color: '#888',
            textAlign: 'center',
            padding: '20px'
          }}>
            <div style={{ fontSize: '64px', marginBottom: '20px' }}>📷</div>
            <div>Фото не найдено</div>
            <div style={{ fontSize: '12px', marginTop: '10px', wordBreak: 'break-all' }}>{imgPath}{currentIndex + 1}.jpg</div>
            <div style={{ fontSize: '12px', marginTop: '5px' }}>Положите фото в папку img</div>
          </div>
        )}
      </div>
      <div className="carousel-counter">{currentIndex + 1} / {totalPhotos}</div>
    </div>
  );
}

// Компонент карточки портфолио
function PortfolioCard({ item, onCardClick }) {
  return (
    <article className="portfolio-item" onClick={() => onCardClick(item.id)}>
      <div className="portfolio-tag">{item.tag}</div>
      <div className="portfolio-name">{item.name}</div>
      <p className="portfolio-desc">{item.desc}</p>
    </article>
  );
}

// Компонент чипа
function Chip({ type, text, onClick }) {
  return (
    <div className="chip" onClick={() => onClick(type)}>
      <span className="chip-dot"></span>
      {text}
    </div>
  );
}

// Компонент фото профиля
function ProfilePhoto() {
  return (
    <div className="photo-inner">
      <img 
        src="oksana.jpg"
        alt="Оксана"
        style={{ 
          width: '100%', 
          height: '100%', 
          objectFit: 'cover'
        }}
        onError={(e) => {
          e.target.style.display = 'none';
          e.target.parentElement.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
          e.target.parentElement.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: center; height: 100%; color: white; text-align: center; flex-direction: column;">
              <div style="font-size: 48px; margin-bottom: 10px;">📸</div>
              <div style="font-size: 14px;">Оксана Баннова</div>
            </div>
            <div class="photo-glow"></div>
          `;
        }}
      />
      <div className="photo-glow"></div>
    </div>
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

  return (
    <>
      <section className="hero">
        <div className="hero-text">
          <div className="tagline">
            <span className="tagline-dot"></span>
            Нейрофото • сайты • автоматизация
          </div>
          <div className="hello">Привет, я Оксана</div>
          <h1>Создаю <span>нейрофото</span>, сайты и ботов</h1>
          <p className="subtitle">
            Самозанятая специалистка по визуалу и автоматизации: от вау‑фото для соцсетей и маркетплейсов до продуманных сайтов и умных ботов.
          </p>
          
          <div className="chips">
            {chipsData.map((chip) => (
              <Chip key={chip.type} type={chip.type} text={chip.text} onClick={handleCardClick} />
            ))}
          </div>

          <div className="edu-wrap">
            <div className="section-title">Образование</div>
            <p className="edu-item"><strong>Прикладная математика и информатика</strong>, КемГУ — бакалавриат, 2018</p>
            <p className="edu-item"><strong>JavaScript‑разработчик</strong>, Нетология — 2025</p>
          </div>

          <div className="btn-row">
            <button className="btn btn-primary" onClick={handleBriefClick}>
              <span className="btn-icon">✉</span>
              Обсудить проект
            </button>
            <button className="btn btn-ghost" onClick={() => scrollToElement('portfolio')}>
              <span className="btn-icon">★</span>
              Посмотреть примеры
            </button>
          </div>
        </div>

        <aside className="hero-media">
          <div className="photo-wrap">
            <ProfilePhoto />
            <div className="badge">
              <div className="badge-inner">
                <span className="status-dot"></span>
                Открыта к новым проектам
              </div>
            </div>
          </div>

          <div className="accent-pill">
            <span><span className="accent-pill-emoji">⚡</span><strong>Нейрофото, сайты и боты под ключ</strong></span>
            <span>Соберу визуал и автоматизацию так, чтобы вам хотелось делиться ссылкой.</span>
          </div>

          <div className="contacts">
            Telegram: <a href="https://t.me/OksBann" target="_blank">@OksBann</a> ·
            VK: <a href="https://vk.com/neirooksii" target="_blank">vk.com/neirooksii</a>
          </div>
        </aside>
      </section>

      <section className="portfolio" id="portfolio">
        <div className="portfolio-inner">
          <div className="portfolio-header">
            <div>
              <div className="section-title">Портфолио</div>
              <div className="portfolio-title">Мои работы и услуги</div>
            </div>
            <div className="portfolio-sub">Нажмите на карточку "Нейрофото", чтобы посмотреть 22 фото</div>
          </div>
          <div className="portfolio-grid">
            {portfolioItems.map((item) => (
              <PortfolioCard key={item.id} item={item} onCardClick={handleCardClick} />
            ))}
          </div>
        </div>
      </section>

      <section className="contact-section" id="contact">
        <div className="contact-inner">
          <div className="contact-text">
            Хочется обсудить нейрофото, сайт, бота или карточки для маркетплейсов — напишите мне в удобный мессенджер.
          </div>
          <div className="contact-buttons">
            <a href="https://t.me/OksBann" target="_blank" className="contact-btn telegram">
              <span className="icon">✈</span><span>Написать в Telegram</span>
            </a>
            <a href="https://vk.com/neirooksii" target="_blank" className="contact-btn vk">
              <span className="icon">ВК</span><span>Написать во VK</span>
            </a>
            <a href="mailto:oksik3505@gmail.com" className="contact-btn email">
              <span className="icon">✉</span><span>Письмо на почту</span>
            </a>
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <div className="site-footer-inner">
          <div>© {new Date().getFullYear()} Оксана Баннова. Самозанятая.</div>
          <div className="site-footer-actions">
            <button className="footer-link-btn" onClick={() => scrollToElement('contact')}>Связаться</button>
            <button className="footer-link-btn" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Наверх</button>
          </div>
        </div>
      </footer>

      <CarouselModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} initialIndex={modalStartIndex} />
    </>
  );
}

// Рендерим приложение
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);