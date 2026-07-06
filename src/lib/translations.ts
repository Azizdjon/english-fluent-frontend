export type Lang = "en" | "uz";

// Nested dictionary. Access via dot-paths, e.g. t("nav.features").
// Uzbek falls back to English automatically when a key is missing.
export const translations: Record<Lang, Record<string, any>> = {
  en: {
    common: {
      getStarted: "Get started",
      signIn: "Sign in",
      signingIn: "Signing in...",
      email: "Email",
      password: "Password",
      loading: "Loading...",
      back: "Back",
      logout: "Log out",
      language: "Language",
    },
    nav: {
      features: "Features",
      howItWorks: "How it works",
      stories: "Stories",
      signIn: "Sign in",
      research: "Scientific Research",
      dashboard: "Dashboard",
      overview: "Overview",
      lessons: "Lessons",
      grammar: "Grammar",
      progress: "Progress",
      homework: "Homework",
      speakingLab: "Speaking Lab",
      exercises: "Exercises",
      diagnosticTest: "Diagnostic Test",
      pragmatic: "Pragmatic",
      profile: "Profile",
      students: "Students",
      messages: "Messages",
      userManagement: "User Management",
      courses: "Courses",
      settings: "Settings",
    },
    roles: {
      student: "Student",
      teacher: "Teacher",
      admin: "Admin",
    },
    landing: {
      metaTitle: "PragmaLearn — Speak English with Confidence",
      heroBadge: "AI-powered English, designed like cinema",
      heroTitle1: "Speak English",
      heroTitle2: "like the world is listening.",
      heroSubtitle:
        "Adaptive lessons, a real-time AI Speaking Lab, and pragmatic dialogues that drop you into the rooms you actually want to walk into — interviews, presentations, classrooms, boardrooms.",
      startFree: "Start learning free",
      seeHow: "See how it works",
      scroll: "Scroll",
      stats: {
        modules: "Interactive modules",
        learners: "Active learners",
        rating: "Average rating",
        pass: "Pass rate",
      },
      features: {
        eyebrow: "What's inside",
        title: "Six tools. One fluent you.",
        subtitle:
          "Every feature is built around one promise: turn passive study into active, confident speech.",
        items: {
          adaptiveTitle: "Adaptive AI Path",
          adaptiveDesc:
            "Your curriculum reshapes itself after every answer — never too easy, never too hard.",
          speakingTitle: "AI Speaking Lab",
          speakingDesc:
            "Real-time pronunciation, fluency, and intonation feedback from your browser microphone.",
          dialoguesTitle: "Pragmatic Dialogues",
          dialoguesDesc:
            "Rehearse real B2/C1 scenarios — interviews, presentations, doctor visits, business meetings.",
          lessonsTitle: "Cinematic Lessons",
          lessonsDesc:
            "HD video lessons with native speakers, paired with interactive grammar drills.",
          cefrTitle: "CEFR Aligned",
          cefrDesc:
            "Every module maps to A1–C2 outcomes, with a diagnostic test that places you in minutes.",
          certsTitle: "Certificates",
          certsDesc:
            "Earn shareable proof of progress at the end of each level — verified by your teacher.",
        },
      },
      journey: {
        eyebrow: "The journey",
        title: "From hesitant to fluent, in four steps.",
        subtitle:
          "No more endless feeds of random tips. A clear path, measurable progress, and a teacher who knows your name.",
        badge: "Loved by 12,000+ learners across 47 countries",
        step1Title: "Take the diagnostic",
        step1Desc:
          "A 10-minute adaptive test pinpoints your CEFR level across grammar, vocab, and listening.",
        step2Title: "Get your path",
        step2Desc:
          "An AI tutor assembles a weekly plan from 60+ modules, drills, and pragmatic scenarios.",
        step3Title: "Practice out loud",
        step3Desc:
          "Speak into the Speaking Lab — get instant feedback on rhythm, stress, and clarity.",
        step4Title: "Earn your certificate",
        step4Desc:
          "Complete the level, get verified by a teacher, and share your CEFR certificate.",
      },
      speakingLab: {
        eyebrow: "Speaking Lab",
        liveDemo: "Live demo",
        name: "AI Speaking Lab",
        title: "Your mouth, finally trained.",
        subtitle:
          "Most apps test what you can read. We train what you can say. Tap record, speak a sentence, and watch waveforms turn into actionable feedback — rhythm, stress, vowels, and confidence.",
        point1: "Phoneme-level pronunciation scoring",
        point2: "Pragmatic dialogue role-play (B2/C1)",
        point3: "Filler-word and pacing analysis",
        point4: "Shareable progress reports for teachers",
        cta: "Try the Speaking Lab",
      },
      stories: {
        eyebrow: "Stories",
        title: "Learners shipping their dreams in English.",
        t1Quote:
          "The Speaking Lab finally fixed my pronunciation. I went from B1 to C1 in eight months.",
        t1Name: "Sofía R.",
        t1Role: "Medical student, Madrid",
        t2Quote:
          "Pragmatic Dialogues nailed my job interview prep. I got hired by a London startup.",
        t2Name: "Kenji T.",
        t2Role: "Software engineer, Tokyo",
        t3Quote:
          "As a teacher, the homework grader saves me six hours a week. My students love it too.",
        t3Name: "Emma W.",
        t3Role: "English teacher, Berlin",
      },
      login: {
        eyebrow: "Step inside",
        title: "Pick your portal.",
        subtitle:
          "Demo mode — choose a role to explore the full experience instantly.",
        continueAs: "Continue as",
        loginAs: "Login as {role}",
        student: "Student",
        teacher: "Teacher",
        admin: "Admin",
        studentDesc: "Learn at your own pace",
        teacherDesc: "Manage classes & grade",
        adminDesc: "Platform analytics",
        signInFailed: "Sign-in failed",
        loadProfileFailed: "Could not load profile",
        unknownRole: "Unknown role: ",
      },
      footer: {
        copyright: "© 2026 PragmaLearn. Crafted for learners, everywhere.",
      },
    },
    loginPage: {
      heading: "Sign in",
      subtitle: "Sign in to your account",
      enterCreds: "Enter email and password",
      welcome: "Welcome!",
      wrongCreds: "Wrong email or password",
    },
    research: {
      metaTitle: "Scientific Research — PragmaLearn",
      badge: "Academic portfolio",
      title: "Scientific Research",
      subtitle:
        "Peer-reviewed articles, conference papers, and professional certificates in applied linguistics and English language pedagogy.",
      articlesTitle: "Articles & Publications",
      articlesSubtitle: "Selected research on pragmatics and language acquisition.",
      certsTitle: "Certificates & Awards",
      certsSubtitle: "Professional qualifications and recognitions.",
      readMore: "Read more",
      viewCertificate: "View certificate",
      publishedIn: "Published in",
      demoNotice:
        "This is a demonstration page with sample data. Real publications and certificates will be added soon.",
      backHome: "Back to home",
    },
  },

  uz: {
    common: {
      getStarted: "Boshlash",
      signIn: "Kirish",
      signingIn: "Kirilmoqda...",
      email: "Email",
      password: "Parol",
      loading: "Yuklanmoqda...",
      back: "Orqaga",
      logout: "Chiqish",
      language: "Til",
    },
    nav: {
      features: "Imkoniyatlar",
      howItWorks: "Qanday ishlaydi",
      stories: "Sharhlar",
      signIn: "Kirish",
      research: "Ilmiy izlanishlar",
      dashboard: "Boshqaruv paneli",
      overview: "Umumiy ko'rinish",
      lessons: "Darslar",
      grammar: "Grammatika",
      progress: "Natijalar",
      homework: "Uy vazifasi",
      speakingLab: "Nutq laboratoriyasi",
      exercises: "Mashqlar",
      diagnosticTest: "Diagnostik test",
      pragmatic: "Pragmatika",
      profile: "Profil",
      students: "O'quvchilar",
      messages: "Xabarlar",
      userManagement: "Foydalanuvchilar",
      courses: "Kurslar",
      settings: "Sozlamalar",
    },
    roles: {
      student: "O'quvchi",
      teacher: "O'qituvchi",
      admin: "Administrator",
    },
    landing: {
      metaTitle: "PragmaLearn — Ingliz tilida ishonch bilan gapiring",
      heroBadge: "Sun'iy intellektga asoslangan ingliz tili — kino kabi",
      heroTitle1: "Ingliz tilida gapiring",
      heroTitle2: "butun dunyo eshitayotgandek.",
      heroSubtitle:
        "Moslashuvchan darslar, real vaqtdagi AI Nutq laboratoriyasi va sizni haqiqatan kirmoqchi bo'lgan xonalarga olib kiradigan pragmatik muloqotlar — suhbatlar, taqdimotlar, sinflar, majlislar.",
      startFree: "Bepul o'rganishni boshlang",
      seeHow: "Qanday ishlashini ko'ring",
      scroll: "Pastga",
      stats: {
        modules: "Interaktiv modullar",
        learners: "Faol o'quvchilar",
        rating: "O'rtacha baho",
        pass: "O'tish darajasi",
      },
      features: {
        eyebrow: "Ichida nima bor",
        title: "Oltita vosita. Bitta ravon siz.",
        subtitle:
          "Har bir imkoniyat bitta va'da atrofida qurilgan: passiv o'qishni faol, ishonchli nutqqa aylantirish.",
        items: {
          adaptiveTitle: "Moslashuvchan AI yo'nalishi",
          adaptiveDesc:
            "Dasturingiz har bir javobdan keyin o'zini qayta shakllantiradi — hech qachon juda oson yoki juda qiyin emas.",
          speakingTitle: "AI Nutq laboratoriyasi",
          speakingDesc:
            "Brauzer mikrofoni orqali real vaqtda talaffuz, ravonlik va ohang bo'yicha fikr-mulohaza.",
          dialoguesTitle: "Pragmatik muloqotlar",
          dialoguesDesc:
            "Haqiqiy B2/C1 vaziyatlarini mashq qiling — suhbatlar, taqdimotlar, shifokor qabullari, biznes uchrashuvlari.",
          lessonsTitle: "Kinematik darslar",
          lessonsDesc:
            "Ona tilida so'zlashuvchilar bilan HD video darslar, interaktiv grammatika mashqlari bilan birga.",
          cefrTitle: "CEFR ga moslashtirilgan",
          cefrDesc:
            "Har bir modul A1–C2 natijalariga mos keladi, sizni bir necha daqiqada joylashtiruvchi diagnostik test bilan.",
          certsTitle: "Sertifikatlar",
          certsDesc:
            "Har bir daraja oxirida o'qituvchi tomonidan tasdiqlangan, ulashish mumkin bo'lgan taraqqiyot dalilini oling.",
        },
      },
      journey: {
        eyebrow: "Sayohat",
        title: "Ikkilanishdan ravonlikka, to'rt bosqichda.",
        subtitle:
          "Tasodifiy maslahatlarning cheksiz oqimi yo'q. Aniq yo'l, o'lchanadigan taraqqiyot va ismingizni biladigan o'qituvchi.",
        badge: "47 mamlakatdagi 12 000+ o'quvchi tomonidan sevilgan",
        step1Title: "Diagnostikadan o'ting",
        step1Desc:
          "10 daqiqalik moslashuvchan test grammatika, lug'at va tinglash bo'yicha CEFR darajangizni aniqlaydi.",
        step2Title: "Yo'lingizni oling",
        step2Desc:
          "AI o'qituvchi 60+ modul, mashq va pragmatik vaziyatlardan haftalik reja tuzadi.",
        step3Title: "Ovoz chiqarib mashq qiling",
        step3Desc:
          "Nutq laboratoriyasida gapiring — ritm, urg'u va ravshanlik bo'yicha darhol fikr oling.",
        step4Title: "Sertifikatingizni oling",
        step4Desc:
          "Darajani yakunlang, o'qituvchi tomonidan tasdiqlaning va CEFR sertifikatingizni ulashing.",
      },
      speakingLab: {
        eyebrow: "Nutq laboratoriyasi",
        liveDemo: "Jonli demo",
        name: "AI Nutq laboratoriyasi",
        title: "Nihoyat mashq qilingan nutqingiz.",
        subtitle:
          "Ko'p ilovalar siz o'qiy oladigan narsani tekshiradi. Biz siz ayta oladigan narsani o'rgatamiz. Yozishni bosing, jumla ayting va to'lqinlar amaliy fikrga aylanishini ko'ring — ritm, urg'u, unlilar va ishonch.",
        point1: "Fonema darajasidagi talaffuz bahosi",
        point2: "Pragmatik muloqot rol o'yini (B2/C1)",
        point3: "To'ldiruvchi so'zlar va sur'at tahlili",
        point4: "O'qituvchilar uchun ulashiladigan taraqqiyot hisobotlari",
        cta: "Nutq laboratoriyasini sinab ko'ring",
      },
      stories: {
        eyebrow: "Sharhlar",
        title: "O'quvchilar orzularini ingliz tilida ro'yobga chiqarmoqda.",
        t1Quote:
          "Nutq laboratoriyasi nihoyat talaffuzimni to'g'irladi. Sakkiz oyda B1 dan C1 ga o'tdim.",
        t1Name: "Sofía R.",
        t1Role: "Tibbiyot talabasi, Madrid",
        t2Quote:
          "Pragmatik muloqotlar ish suhbatiga tayyorgarligimni mukammal qildi. Londonlik startap meni ishga oldi.",
        t2Name: "Kenji T.",
        t2Role: "Dasturchi, Tokio",
        t3Quote:
          "O'qituvchi sifatida uy vazifasini baholovchi haftasiga olti soatimni tejaydi. O'quvchilarim ham buni yaxshi ko'radi.",
        t3Name: "Emma W.",
        t3Role: "Ingliz tili o'qituvchisi, Berlin",
      },
      login: {
        eyebrow: "Ichkariga qadam qo'ying",
        title: "Portalingizni tanlang.",
        subtitle:
          "Demo rejim — to'liq tajribani darhol ko'rish uchun rol tanlang.",
        continueAs: "Sifatida davom eting",
        loginAs: "{role} sifatida kirish",
        student: "O'quvchi",
        teacher: "O'qituvchi",
        admin: "Administrator",
        studentDesc: "O'z sur'atingizda o'rganing",
        teacherDesc: "Sinflarni boshqaring va baholang",
        adminDesc: "Platforma tahlili",
        signInFailed: "Kirish amalga oshmadi",
        loadProfileFailed: "Profil yuklanmadi",
        unknownRole: "Noma'lum rol: ",
      },
      footer: {
        copyright: "© 2026 PragmaLearn. O'quvchilar uchun, hamma joyda yaratilgan.",
      },
    },
    loginPage: {
      heading: "Kirish",
      subtitle: "Akkauntingizga kiring",
      enterCreds: "Email va parol kiriting",
      welcome: "Xush kelibsiz!",
      wrongCreds: "Email yoki parol xato",
    },
    research: {
      metaTitle: "Ilmiy izlanishlar — PragmaLearn",
      badge: "Akademik portfolio",
      title: "Ilmiy izlanishlar",
      subtitle:
        "Amaliy tilshunoslik va ingliz tili pedagogikasi bo'yicha taqriz qilingan maqolalar, konferensiya ishlari va professional sertifikatlar.",
      articlesTitle: "Maqolalar va nashrlar",
      articlesSubtitle: "Pragmatika va til o'zlashtirish bo'yicha tanlangan izlanishlar.",
      certsTitle: "Sertifikatlar va mukofotlar",
      certsSubtitle: "Professional malaka va e'tiroflar.",
      readMore: "Batafsil",
      viewCertificate: "Sertifikatni ko'rish",
      publishedIn: "Nashr etilgan",
      demoNotice:
        "Bu namunaviy ma'lumotlarga ega demo sahifa. Haqiqiy nashrlar va sertifikatlar tez orada qo'shiladi.",
      backHome: "Bosh sahifaga qaytish",
    },
  },
};
