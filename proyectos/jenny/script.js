const menuButton = document.querySelector('.menu-button');
const navigation = document.querySelector('.nav');

menuButton.addEventListener('click', () => {
  const isOpen = navigation.classList.toggle('open');
  menuButton.classList.toggle('open', isOpen);
  menuButton.setAttribute('aria-expanded', String(isOpen));
});

document.querySelectorAll('.nav a').forEach((link) => {
  link.addEventListener('click', () => {
    navigation.classList.remove('open');
    menuButton.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
  });
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));
document.querySelector('#year').textContent = new Date().getFullYear();

const translations = {
  pt: {
    '.nav a[href="#acompanamiento"]': 'Acompanhamento',
    '.nav a[href="#sobre-mi"]': 'Sobre mim',
    '.nav a[href="#sesiones"]': 'Sessões',
    '.nav a[href="resenas.php"]': 'Depoimentos',
    '.nav-cta': 'Agendar sessão',
    '.hero .eyebrow': 'Acompanhamento pessoal · 100% online',
    '.hero h1': 'Sua decisão de hoje pode mudar o seu <em>amanhã.</em>',
    '.hero-text': 'Um espaço próximo e prático para compreender o que você está vivendo, descobrir novas possibilidades e avançar em direção a mudanças concretas.',
    '.hero .primary': 'Quero agendar uma sessão <span>↗</span>',
    '.hero .text-link': 'Saiba como funciona',
    '.hero-trust span': 'pessoas acompanhadas<br>em processos individuais',
    '.areas .section-heading .eyebrow': 'Principais áreas de acompanhamento',
    '.areas .section-heading h2': 'Um processo pensado para o que você precisa hoje',
    '.areas .section-heading>p:last-child': 'Cada experiência é diferente. As sessões se adaptam à sua história, às suas necessidades e aos objetivos que você deseja alcançar.',
    '.area-card:nth-child(1) h3': 'Autoestima e confiança',
    '.area-card:nth-child(1) p': 'Reconheça seus recursos, fortaleça a relação consigo mesma e avance com mais segurança.',
    '.area-card:nth-child(2) h3': 'Gestão emocional',
    '.area-card:nth-child(2) p': 'Compreenda o que sente e encontre novas ferramentas para atravessar processos de mudança.',
    '.area-card:nth-child(3) h3': 'Crenças e hábitos',
    '.area-card:nth-child(3) p': 'Identifique padrões de pensamento que limitam você e construa alternativas mais úteis.',
    '.areas-extra': 'Também podemos trabalhar relacionamentos e limites pessoais, tomada de decisões, encerramentos, novos começos e objetivos pessoais.',
    '.nlp .eyebrow': 'Uma ferramenta para a mudança',
    '.nlp h2': 'O que é PNL?',
    '.nlp p:nth-of-type(2)': 'A Programação Neurolinguística reúne ferramentas e exercícios que permitem explorar como pensamos, interpretamos nossas experiências e construímos determinados padrões.',
    '.nlp p:nth-of-type(3)': 'Nas sessões utilizamos essas ferramentas de forma prática e personalizada, de acordo com o que você quer trabalhar e o objetivo que deseja alcançar.',
    '.about-copy .eyebrow': 'Minha história',
    '.about-copy h2': 'Acompanhar processos de mudança se tornou minha vocação',
    '.about-copy>p:nth-of-type(2)': 'Durante mais de 16 anos trabalhei em Recursos Humanos, acompanhando pessoas e gerenciando processos no ambiente profissional e organizacional.',
    '.about-copy>p:nth-of-type(3)': 'Em 2021 iniciei minha formação em Programação Neurolinguística. Em 2022 obtive minha certificação como Master em PNL e, desde então, dedico-me ao acompanhamento individual online.',
    '.about-copy>p:nth-of-type(4)': 'O que começou como uma busca pessoal se transformou em minha vocação. Desde então, acompanhei mais de 600 pessoas em seus processos de transformação.',
    '.credentials div:nth-child(1) span': 'anos de experiência em Recursos Humanos',
    '.credentials div:nth-child(2) span': 'Certificação Practitioner em PNL',
    '.credentials div:nth-child(3) span': 'Certificação Master em PNL',
    '.credentials div:nth-child(4) span': 'pessoas acompanhadas',
    '.certification-copy .eyebrow': 'Formação certificada',
    '.certification-copy h2': 'Certificação internacional IANLP',
    '.certification-copy>p:not(.eyebrow):not(.certification-detail)': 'Sua formação pode ser consultada no registro internacional de graduados da International Association for Neuro-Linguistic Programming.',
    '.certification-copy .certification-detail': '<strong>Practitioner em PNL · 2021<br>Master em PNL · 2022</strong>',
    '.certification-copy .button': 'Consultar registro oficial <span>↗</span>',
    '.fit-intro .eyebrow': 'Como saber?',
    '.fit-intro h2': 'Este espaço pode ser para você se…',
    '.fit-list p:nth-child(1)': '<span>01</span>Você sente que está repetindo padrões que deseja mudar.',
    '.fit-list p:nth-child(2)': '<span>02</span>Você quer recuperar a confiança em si mesma.',
    '.fit-list p:nth-child(3)': '<span>03</span>Você está passando por uma mudança e precisa organizar suas ideias.',
    '.fit-list p:nth-child(4)': '<span>04</span>Você quer trabalhar seus hábitos, emoções ou relacionamentos.',
    '.fit-list p:nth-child(5)': '<span>05</span>Você sabe que quer mudar, mas não sabe por onde começar.',
    '.session-copy .eyebrow': 'Primeira sessão',
    '.session-copy h2': 'Vamos começar entendendo o que você quer transformar',
    '.session-copy>p:not(.eyebrow)': 'Conversaremos sobre a situação que você está vivendo, identificaremos o que deseja trabalhar e definiremos um objetivo concreto. Utilizaremos ferramentas e exercícios de PNL adaptados a você.',
    '.session-copy li:nth-child(1)': '<span>✓</span> Sessão individual de 60 minutos',
    '.session-copy li:nth-child(2)': '<span>✓</span> Modalidade 100% online',
    '.session-copy li:nth-child(3)': '<span>✓</span> Atendimento em espanhol, português e inglês',
    '.price-box>span': 'Valor por sessão',
    '.price-box .button': 'Agendar pelo WhatsApp <span>↗</span>',
    '.price-box p': 'Consulte planos de sessões e modalidades especiais.',
    '.testimonials-copy .eyebrow': 'Experiências reais',
    '.testimonials-copy h2': 'Conheça as experiências de quem viveu este processo',
    '.testimonials-copy+p,.testimonials-copy p:not(.eyebrow)': 'Os depoimentos são enviados diretamente pelas pessoas acompanhadas e publicados após uma revisão para proteger sua privacidade.',
    '.testimonials .button': 'Ver e deixar um depoimento <span>→</span>',
    '.closing-copy .eyebrow': 'Dê o primeiro passo',
    '.closing-copy h2': 'A mudança que você procura pode começar com uma conversa',
    '.closing-copy>p:not(.eyebrow)': 'Se você sente que este acompanhamento é para você, escreva para mim. Podemos conversar brevemente e esclarecer suas dúvidas antes de agendar.',
    '.closing-copy .button': 'Entre em contato <span>↗</span>',
    '.footer-brand p': 'Transforme sua mente, transforme sua vida.',
    '.disclaimer': '<strong>Acompanhamento complementar.</strong> As sessões de PNL não substituem o atendimento psicológico, psiquiátrico ou médico.'
  },
  en: {
    '.nav a[href="#acompanamiento"]': 'Support',
    '.nav a[href="#sobre-mi"]': 'About me',
    '.nav a[href="#sesiones"]': 'Sessions',
    '.nav a[href="resenas.php"]': 'Reviews',
    '.nav-cta': 'Book a session',
    '.hero .eyebrow': 'Personal support · 100% online',
    '.hero h1': 'Your decision today can change your <em>tomorrow.</em>',
    '.hero-text': 'A warm and practical space to understand what you are experiencing, discover new possibilities and move toward meaningful change.',
    '.hero .primary': 'I want to book a session <span>↗</span>',
    '.hero .text-link': 'Learn how it works',
    '.hero-trust span': 'people supported<br>through individual processes',
    '.areas .section-heading .eyebrow': 'Main areas of support',
    '.areas .section-heading h2': 'A process designed around what you need today',
    '.areas .section-heading>p:last-child': 'Every experience is different. Sessions are adapted to your story, your needs and the goals you want to reach.',
    '.area-card:nth-child(1) h3': 'Self-esteem and confidence',
    '.area-card:nth-child(1) p': 'Recognize your strengths, improve your relationship with yourself and move forward with greater confidence.',
    '.area-card:nth-child(2) h3': 'Emotional management',
    '.area-card:nth-child(2) p': 'Understand what you feel and find new tools to navigate periods of change.',
    '.area-card:nth-child(3) h3': 'Beliefs and habits',
    '.area-card:nth-child(3) p': 'Identify limiting thought patterns and build more useful alternatives.',
    '.areas-extra': 'We can also work on relationships and personal boundaries, decision-making, endings, new beginnings and personal goals.',
    '.nlp .eyebrow': 'A tool for change',
    '.nlp h2': 'What is NLP?',
    '.nlp p:nth-of-type(2)': 'Neuro-Linguistic Programming brings together tools and exercises that help us explore how we think, interpret our experiences and build certain patterns.',
    '.nlp p:nth-of-type(3)': 'During sessions, we use these tools in a practical and personalized way according to what you want to work on and the goal you want to achieve.',
    '.about-copy .eyebrow': 'My story',
    '.about-copy h2': 'Supporting change became my vocation',
    '.about-copy>p:nth-of-type(2)': 'For more than 16 years, I worked in Human Resources, supporting people and managing processes in professional and organizational settings.',
    '.about-copy>p:nth-of-type(3)': 'In 2021, I began my training in Neuro-Linguistic Programming. In 2022, I became certified as a Master in NLP and have since dedicated myself to individual online support.',
    '.about-copy>p:nth-of-type(4)': 'What began as a personal search became my vocation. Since then, I have supported more than 600 people through their transformation processes.',
    '.credentials div:nth-child(1) span': 'years of experience in Human Resources',
    '.credentials div:nth-child(2) span': 'NLP Practitioner Certification',
    '.credentials div:nth-child(3) span': 'NLP Master Certification',
    '.credentials div:nth-child(4) span': 'people supported',
    '.certification-copy .eyebrow': 'Accredited training',
    '.certification-copy h2': 'International IANLP certification',
    '.certification-copy>p:not(.eyebrow):not(.certification-detail)': 'Her training can be consulted in the international graduates registry of the International Association for Neuro-Linguistic Programming.',
    '.certification-copy .certification-detail': '<strong>NLP Practitioner · 2021<br>NLP Master · 2022</strong>',
    '.certification-copy .button': 'View official registry <span>↗</span>',
    '.fit-intro .eyebrow': 'How can you know?',
    '.fit-intro h2': 'This space may be for you if…',
    '.fit-list p:nth-child(1)': '<span>01</span>You feel you are repeating patterns you want to change.',
    '.fit-list p:nth-child(2)': '<span>02</span>You want to regain confidence in yourself.',
    '.fit-list p:nth-child(3)': '<span>03</span>You are going through a change and need to organize your thoughts.',
    '.fit-list p:nth-child(4)': '<span>04</span>You want to work on your habits, emotions or relationships.',
    '.fit-list p:nth-child(5)': '<span>05</span>You know you want change, but you do not know where to begin.',
    '.session-copy .eyebrow': 'First session',
    '.session-copy h2': 'Let us begin by understanding what you want to transform',
    '.session-copy>p:not(.eyebrow)': 'We will discuss what you are experiencing, identify what you want to work on and define a clear goal. We will use NLP tools and exercises adapted to you.',
    '.session-copy li:nth-child(1)': '<span>✓</span> Individual 60-minute session',
    '.session-copy li:nth-child(2)': '<span>✓</span> 100% online',
    '.session-copy li:nth-child(3)': '<span>✓</span> Available in Spanish, Portuguese and English',
    '.price-box>span': 'Price per session',
    '.price-box .button': 'Book via WhatsApp <span>↗</span>',
    '.price-box p': 'Ask about session plans and special options.',
    '.testimonials-copy .eyebrow': 'Real experiences',
    '.testimonials-copy h2': 'Read the experiences of people who have gone through this process',
    '.testimonials-copy p:not(.eyebrow)': 'Reviews are submitted directly by the people supported and published after moderation to protect their privacy.',
    '.testimonials .button': 'Read and leave a review <span>→</span>',
    '.closing-copy .eyebrow': 'Take the first step',
    '.closing-copy h2': 'The change you are looking for can begin with a conversation',
    '.closing-copy>p:not(.eyebrow)': 'If you feel this support is right for you, write to me. We can have a brief conversation and answer your questions before booking.',
    '.closing-copy .button': 'Contact me <span>↗</span>',
    '.footer-brand p': 'Transform your mind, transform your life.',
    '.disclaimer': '<strong>Complementary support.</strong> NLP sessions do not replace psychological, psychiatric or medical care.'
  }
};

const originalContent = new Map();
document.querySelectorAll('#language-select').forEach((select) => {
  Object.values(translations).forEach((language) => {
    Object.keys(language).forEach((selector) => {
      const element = document.querySelector(selector);
      if (element && !originalContent.has(selector)) originalContent.set(selector, element.innerHTML);
    });
  });

  const applyLanguage = (language) => {
    document.documentElement.lang = language;
    if (language === 'es') {
      originalContent.forEach((content, selector) => {
        const element = document.querySelector(selector);
        if (element) element.innerHTML = content;
      });
    } else {
      Object.entries(translations[language]).forEach(([selector, content]) => {
        const element = document.querySelector(selector);
        if (element) element.innerHTML = content;
      });
    }
    localStorage.setItem('jenni-language', language);
  };

  const savedLanguage = localStorage.getItem('jenni-language') || 'es';
  select.value = savedLanguage;
  applyLanguage(savedLanguage);
  select.addEventListener('change', (event) => applyLanguage(event.target.value));
});
