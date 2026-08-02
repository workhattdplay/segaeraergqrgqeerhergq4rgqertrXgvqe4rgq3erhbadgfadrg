import { useState, useEffect } from 'react'

const BUILDINGS = [
  { label: 'Приветствие', floors: 3 },
  { label: 'Преимущества', floors: 5 },
  { label: 'Заявка', floors: 7, signal: true },
  { label: 'Прайс', floors: 4 },
  { label: 'Контакты', floors: 3 },
]

const ADVANTAGES = [
  {
    floor: '01',
    title: 'Запуск за 3-4 дня',
    text: 'От брифа до рабочего сайта с формой заявок — без месяцев согласований.',
  },
  {
    floor: '02',
    title: 'Под ваш город и нишу',
    text: 'Тексты, офферы и визуал собираем под конкретный город и конкурентов, а не по шаблону.',
  },
  {
    floor: '03',
    title: 'Заявки сразу в Telegram',
    text: 'Каждое обращение с сайта прилетает вам в бот — без CRM и лишних шагов.',
  },
  {
    floor: '04',
    title: 'Скорость и SEO из коробки',
    text: 'Оптимизация под Core Web Vitals и базовое SEO уже на этапе сборки, а не постфактум.',
  },
  {
    floor: '05',
    title: 'Адаптивность на любом экране',
    text: 'Один макет одинаково хорошо работает на телефоне, планшете и ПК.',
  },
  {
    floor: '06',
    title: 'Поддержка после запуска',
    text: 'Правки, новые блоки и обновление прайса — сопровождаем сайт и после сдачи.',
  },
]

const PLANS = [
  { name: 'Старт', price: '11 000 ₽', desc: 'Статичный без приёма заявок' },
  { name: 'Бизнес', price: '18 000 ₽', desc: 'Статичный с приёмом заявок' },
  { name: 'Про', price: '23 000 ₽', desc: 'С анимациями и приёмом заявок' },
]

function App() {
  const [form, setForm] = useState({ name: '', phone: '', city: '', message: '' })
  const [status, setStatus] = useState('idle')

  useEffect(() => {
    const els = document.querySelectorAll('.reveal')
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            io.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.15 }
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('request failed')
      setStatus('success')
      setForm({ name: '', phone: '', city: '', message: '' })
    } catch {
      setStatus('error')
    }
  }

  return (
    <>
      <header className="header">
        <div className="container header__row">
          <span className="logo">flux<span className="logo__accent">.prod</span></span>
          <nav className="nav">
            <a href="#advantages">Преимущества</a>
            <a href="#form">Заявка</a>
            <a href="#price">Прайс</a>
            <a href="#contacts">Контакты</a>
          </nav>
          <a href="#form" className="btn btn--sm">Оставить заявку</a>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="container hero__row">
            <div className="hero__copy">
              <span className="eyebrow">Студия лендингов</span>
              <h1>
                Строим сайты, которые приносят заявки малому и среднему бизнесу
                в городах России
              </h1>
              <p className="hero__lead">
                Один лендинг — пять этажей: приветствие, преимущества, форма заявки,
                прайс и контакты. Собираем под ваш город, нишу и бюджет.
              </p>
              <div className="hero__actions">
                <a href="#form" className="btn btn--primary">Оставить заявку</a>
                <a href="#advantages" className="btn btn--ghost">Что входит</a>
              </div>
            </div>

            <div className="skyline" aria-hidden="true">
              {BUILDINGS.map((b, i) => (
                <div className="skyline__building" key={b.label} style={{ '--i': i }}>
                  <div className={`skyline__stack ${b.signal ? 'skyline__stack--signal' : ''}`}>
                    {Array.from({ length: b.floors }).map((_, f) => (
                      <span
                        className="skyline__floor"
                        key={f}
                        style={{ '--f': b.floors - f }}
                      />
                    ))}
                  </div>
                  <span className="skyline__label">{b.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="advantages" id="advantages">
          <div className="container">
            <span className="eyebrow">Почему мы</span>
            <h2>Каждый этаж закрывает свою задачу</h2>
            <div className="advantages__grid">
              {ADVANTAGES.map((a, i) => (
                <div className="advantage reveal" key={a.floor} style={{ '--d': i }}>
                  <span className="advantage__floor">Этаж {a.floor}</span>
                  <h3>{a.title}</h3>
                  <p>{a.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="form-section" id="form">
          <div className="container form-section__row">
            <div className="form-section__copy reveal">
              <span className="eyebrow">Заявка</span>
              <h2>Обсудим ваш лендинг</h2>
              <p>
                Заполните форму — заявка мгновенно придёт нам в Telegram,
                и мы свяжемся с вами в течение рабочего дня.
              </p>
            </div>

            <form className="lead-form reveal" style={{ '--d': 1 }} onSubmit={handleSubmit}>
              <label className="field">
                <span>Имя</span>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Как к вам обращаться"
                  required
                />
              </label>
              <label className="field">
                <span>Телефон</span>
                <input
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+7 900 000-00-00"
                  required
                />
              </label>
              <label className="field">
                <span>Город</span>
                <input
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  placeholder="Например, Казань"
                  required
                />
              </label>
              <label className="field">
                <span>Комментарий</span>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Кратко о бизнесе и задаче"
                  rows={3}
                />
              </label>

              <button className="btn btn--primary" type="submit" disabled={status === 'loading'}>
                {status === 'loading' ? 'Отправляем…' : 'Отправить заявку'}
              </button>

              {status === 'success' && (
                <p className="form-status form-status--ok">Заявка отправлена, свяжемся скоро.</p>
              )}
              {status === 'error' && (
                <p className="form-status form-status--error">
                  Не получилось отправить. Попробуйте ещё раз или напишите нам напрямую.
                </p>
              )}
            </form>
          </div>
        </section>

        <section className="price" id="price">
          <div className="container">
            <span className="eyebrow">Прайс</span>
            <h2>Тарифы </h2>
            <div className="price__grid">
              {PLANS.map((p, i) => (
                <div className="price__card reveal" key={p.name} style={{ '--d': i }}>
                  <h3>{p.name}</h3>
                  <p>{p.desc}</p>
                  <span className="price__value">{p.price}</span>
                  <a href="#form" className="btn btn--ghost btn--sm">Оставьте заявку</a>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="contacts" id="contacts">
          <div className="container contacts__row">
            <div>
              <span className="eyebrow">Контакты</span>
              <h2>Свяжитесь с нами</h2>
            </div>
            <div className="contacts__grid">
              <div className="contacts__item reveal" style={{ '--d': 0 }}>
                <span>Телефон</span>
                <strong>+79371655455</strong>
              </div>
              <div className="contacts__item reveal" style={{ '--d': 1 }}>
                <span>Telegram</span>
                <strong>https://t.me/lordgeass</strong>
              </div>
              <div className="contacts__item reveal" style={{ '--d': 2 }}>
                <span>Email</span>
                <strong>d1zzze616@gmail.com</strong>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container">
          <span>© {new Date().getFullYear()} flux.production — лендинги для бизнеса в городах России</span>
        </div>
      </footer>
    </>
  )
}

export default App
