import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

// ─── Language definitions ──────────────────────────────────────────────────
export interface Language {
  code: string;
  label: string;
  nativeLabel: string;
  dir?: "rtl" | "ltr";
}

export const LANGUAGES: Language[] = [
  { code: "fr", label: "Français",         nativeLabel: "Français"          },
  { code: "en", label: "English",          nativeLabel: "English"           },
  { code: "it", label: "italiano",         nativeLabel: "italiano"          },
  { code: "ja", label: "日本語",            nativeLabel: "日本語"             },
  { code: "ko", label: "한국인",            nativeLabel: "한국인"             },
  { code: "de", label: "Deutsch",          nativeLabel: "Deutsch"           },
  { code: "ru", label: "Русский",          nativeLabel: "Русский"           },
  { code: "vi", label: "Tiếng Việt",       nativeLabel: "Tiếng Việt"        },
  { code: "pt", label: "Português",        nativeLabel: "Português"         },
  { code: "tr", label: "Türkçe",           nativeLabel: "Türkçe"            },
  { code: "es", label: "español",          nativeLabel: "español"           },
  { code: "fa", label: "فارسی",            nativeLabel: "فارسی",   dir: "rtl" },
  { code: "ar", label: "عربي",             nativeLabel: "عربي",    dir: "rtl" },
  { code: "id", label: "bahasa Indonesia", nativeLabel: "bahasa Indonesia"  },
  { code: "el", label: "Ελληνικά",         nativeLabel: "Ελληνικά"          },
  { code: "ht", label: "Haïtien",          nativeLabel: "Kreyòl ayisyen"    },
  { code: "ur", label: "اردو",             nativeLabel: "اردو",    dir: "rtl" },
];

// ─── Translation keys ──────────────────────────────────────────────────────
export type TranslationKey = keyof typeof translations["fr"];

type TranslationMap = Record<string, string>;

// ─── Translations ──────────────────────────────────────────────────────────
export const translations: Record<string, TranslationMap> = {
  fr: {
    // Nav
    navHome: "Maison", navProducts: "Produits", navTeam: "Équipe", navMine: "Le mien",
    // Login
    welcomeTitle: "Bienvenue parmi nous",
    welcomeSubtitle: "Commencez votre parcours d'investissement",
    phoneLabel: "Téléphone", passwordLabel: "Mot de passe",
    forgotPassword: "Mot de passe oublié ?",
    loginBtn: "CONNEXION", registerLink: "S'inscrire",
    enterPhone: "Veuillez entrer votre numéro de téléphone",
    enterPassword: "Veuillez entrer votre mot de passe",
    // Register
    verificationCode: "Code de vérification", invitationCode: "Code d'invitation",
    loginLink: "Se connecter ?", registerBtn: "S'inscrire",
    enterPhoneReg: "Entrez votre numéro de téléphone",
    enterPasswordReg: "Entrez votre mot de passe",
    enterVerif: "Entrez votre code de vérification",
    enterInvit: "Code d'invitation (optionnel)",
    // Home
    accountAssets: "Actifs du compte", totalRevenue: "Revenu total",
    becomePartner: "Devenez partenaire commercial de TREK et débloquez des opportunités de croissance pour vos actifs.",
    recharge: "Recharger", withdraw: "Retirer", accountBtn: "Compte",
    myProducts: "Mes produits", whatsapp: "Whatsapp",
    globalPartnerships: "PARTENARIATS MONDIAUX TREK",
    partnershipsDesc: "Trek Bicycle Corporation fut fondée en 1976 par Dick Burke et Bevil Hogg à Waterloo, Wisconsin. Pionnière dans la conception de vélos haut de gamme, Trek s'est imposée comme une référence mondiale grâce à ses innovations constantes et ses partenariats stratégiques. En confiant votre investissement à Trek, vous rejoignez un réseau mondial de partenaires engagés dans la croissance durable.",
    ourProducts: "Nos Produits", investBtn: "Investir",
    perDay: "/ jour", estimatedTotal: "total estimé", noProducts: "Aucun produit disponible",
    insufficientBalance: "Solde insuffisant. Il vous manque",
    earning24h: "Gains versés toutes les 24 heures",
    cancel: "Annuler", confirm: "Confirmer",
    price: "Prix :", dailyRevenue: "Revenu quotidien :", estimatedRevenue: "Revenu estimé :", duration: "Durée :", days: "jours",
    purchaseSuccess: "Produit acheté !", purchaseSuccessDesc: "Vous commencerez à recevoir des gains demain.",
    marqueeText: "Fondée en 1976 à Waterloo, Wisconsin, Trek Bicycle Corporation s'engage à créer des vélos plus performants. Rejoignez-nous et faites fructifier votre patrimoine dès aujourd'hui avec TREK.",
    // Account
    personalCenter: "Centre personnel", signOut: "Se déconnecter",
    balance: "Solde", pendingCommerce: "Commerce en\nsuspens", volume: "Volume",
    deposit: "Depot", withdrawal: "Retrait",
    security: "Sécurité", about: "À propos", files: "Dossiers",
    addCard: "Ajouter une carte", customerService: "CS", adminPanel: "Panel Admin",
    adminPinTitle: "Code d'accès administrateur", adminPinDesc: "Entrez votre code PIN pour accéder au panel administrateur",
    // Language
    selectLanguage: "Sélectionner la langue", searchLanguage: "Rechercher...",
    teamTitle: "Équipe", myTeam: "Mon équipe", invitationLink: "Lien d'invitation", copy: "Copier", teamDetails: "Détails de l'équipe", share: "Partager", commissionRate: "Taux de commission", validUser: "Utilisateur valide", commission: "Commission", myRevenues: "Mes revenus", numberOfPeople: "Nombre de personnes", invitationGift: "Cadeau d'invitation", viewTeamDetails: "Voir les détails de mon équipe", cashbackLevel1Pre: "Lorsque vos amis s'inscrivent et effectuent leur investissement, vous recevez immédiatement", cashbackLevel2Pre: "Lorsque les membres de votre équipe de niveau 2 investissent, vous recevez", cashbackLevel3Pre: "Lorsque les membres de votre équipe de niveau 3 investissent, vous recevez", ofCashback: "de cashback", codeCopied: "Code d'invitation copié !", linkCopied: "Lien d'invitation copié !", linkCopiedInstagram: "Lien copié !", linkCopiedInstagramDesc: "Collez-le dans votre bio Instagram.", teamHistory: "Historique d'équipe", levelLabel: "Niveau", teamMembersLabel: "Membres de l'équipe", teamDepositsLabel: "Dépôts de l'équipe", noMembersMsg: "Aucun membre au niveau", inviteFriendsMsg: "Invitez des amis pour agrandir votre équipe", accountLabel: "Compte", dateLabel: "Date",
  },

  en: {
    navHome: "Home", navProducts: "Products", navTeam: "Team", navMine: "Mine",
    welcomeTitle: "Welcome among us",
    welcomeSubtitle: "Start your investment journey",
    phoneLabel: "Phone", passwordLabel: "Password",
    forgotPassword: "Forgot password?",
    loginBtn: "LOGIN", registerLink: "Sign up",
    enterPhone: "Please enter your phone number",
    enterPassword: "Please enter your password",
    verificationCode: "Verification code", invitationCode: "Invitation code",
    loginLink: "Login?", registerBtn: "Sign up",
    enterPhoneReg: "Enter your phone number",
    enterPasswordReg: "Enter your password",
    enterVerif: "Enter your verification code",
    enterInvit: "Invitation code (optional)",
    accountAssets: "Account assets", totalRevenue: "Total revenue",
    becomePartner: "Become a TREK business partner and unlock growth opportunities for your assets.",
    recharge: "Deposit", withdraw: "Withdraw", accountBtn: "Account",
    myProducts: "My products", whatsapp: "Whatsapp",
    globalPartnerships: "TREK GLOBAL PARTNERSHIPS",
    partnershipsDesc: "Trek Bicycle Corporation was founded in 1976 by Dick Burke and Bevil Hogg in Waterloo, Wisconsin. A pioneer in high-performance bicycle design, Trek has established itself as a global benchmark through constant innovation and strategic partnerships. By entrusting your investment to Trek, you join a global network of partners committed to sustainable growth.",
    ourProducts: "Our Products", investBtn: "Invest",
    perDay: "/ day", estimatedTotal: "est. total", noProducts: "No products available",
    insufficientBalance: "Insufficient balance. You need",
    earning24h: "Earnings paid every 24 hours",
    cancel: "Cancel", confirm: "Confirm",
    price: "Price:", dailyRevenue: "Daily revenue:", estimatedRevenue: "Est. revenue:", duration: "Duration:", days: "days",
    purchaseSuccess: "Product purchased!", purchaseSuccessDesc: "You will start receiving earnings tomorrow.",
    marqueeText: "Founded in 1976 in Waterloo, Wisconsin, Trek Bicycle Corporation is committed to creating higher performance bicycles. Join us and grow your wealth with TREK today.",
    personalCenter: "Personal center", signOut: "Sign out",
    balance: "Balance", pendingCommerce: "Pending\ncommerce", volume: "Volume",
    deposit: "Deposit", withdrawal: "Withdrawal",
    security: "Security", about: "About", files: "Files",
    addCard: "Add card", customerService: "CS", adminPanel: "Admin Panel",
    adminPinTitle: "Administrator access code", adminPinDesc: "Enter your PIN code to access the admin panel",
    selectLanguage: "Select language", searchLanguage: "Search...",
    teamTitle: "Team", myTeam: "My team", invitationLink: "Invitation link", copy: "Copy", teamDetails: "Team details", share: "Share", commissionRate: "Commission rate", validUser: "Valid user", commission: "Commission", myRevenues: "My revenues", numberOfPeople: "Number of people", invitationGift: "Invitation gift", viewTeamDetails: "View my team details", cashbackLevel1Pre: "When your friends sign up and invest, you immediately receive", cashbackLevel2Pre: "When level 2 team members invest, you receive", cashbackLevel3Pre: "When level 3 team members invest, you receive", ofCashback: "cashback", codeCopied: "Invitation code copied!", linkCopied: "Invitation link copied!", linkCopiedInstagram: "Link copied!", linkCopiedInstagramDesc: "Paste it in your Instagram bio.", teamHistory: "Team history", levelLabel: "Level", teamMembersLabel: "Team members", teamDepositsLabel: "Team deposits", noMembersMsg: "No members at level", inviteFriendsMsg: "Invite friends to grow your team", accountLabel: "Account", dateLabel: "Date",
  },

  it: {
    navHome: "Home", navProducts: "Prodotti", navTeam: "Squadra", navMine: "Il mio",
    welcomeTitle: "Benvenuto tra noi",
    welcomeSubtitle: "Inizia il tuo percorso di investimento",
    phoneLabel: "Telefono", passwordLabel: "Password",
    forgotPassword: "Password dimenticata?",
    loginBtn: "ACCEDI", registerLink: "Iscriviti",
    enterPhone: "Inserisci il tuo numero di telefono",
    enterPassword: "Inserisci la tua password",
    verificationCode: "Codice di verifica", invitationCode: "Codice invito",
    loginLink: "Accedi?", registerBtn: "Iscriviti",
    enterPhoneReg: "Inserisci il tuo numero di telefono",
    enterPasswordReg: "Inserisci la tua password",
    enterVerif: "Inserisci il codice di verifica",
    enterInvit: "Codice invito (opzionale)",
    accountAssets: "Attività del conto", totalRevenue: "Entrate totali",
    becomePartner: "Diventa un partner commerciale TREK e sblocca opportunità di crescita per i tuoi asset.",
    recharge: "Deposita", withdraw: "Preleva", accountBtn: "Conto",
    myProducts: "I miei prodotti", whatsapp: "Whatsapp",
    globalPartnerships: "PARTNERSHIP MONDIALI TREK",
    partnershipsDesc: "Trek Bicycle Corporation è stata fondata nel 1976 da Dick Burke e Bevil Hogg a Waterloo, Wisconsin. Pioniera nel design di biciclette di alta gamma, Trek si è affermata come riferimento mondiale grazie alle sue costanti innovazioni e partnership strategiche.",
    ourProducts: "I Nostri Prodotti", investBtn: "Investi",
    perDay: "/ giorno", estimatedTotal: "totale stimato", noProducts: "Nessun prodotto disponibile",
    insufficientBalance: "Saldo insufficiente. Ti mancano",
    earning24h: "Guadagni pagati ogni 24 ore",
    cancel: "Annulla", confirm: "Conferma",
    price: "Prezzo:", dailyRevenue: "Reddito giornaliero:", estimatedRevenue: "Reddito stimato:", duration: "Durata:", days: "giorni",
    purchaseSuccess: "Prodotto acquistato!", purchaseSuccessDesc: "Inizierai a ricevere guadagni domani.",
    marqueeText: "Fondata nel 1976 a Waterloo, Wisconsin, Trek Bicycle Corporation si impegna a creare biciclette più performanti. Unisciti a noi e fai crescere il tuo patrimonio con TREK.",
    personalCenter: "Centro personale", signOut: "Disconnetti",
    balance: "Saldo", pendingCommerce: "Commercio\nin sospeso", volume: "Volume",
    deposit: "Deposito", withdrawal: "Prelievo",
    security: "Sicurezza", about: "Chi siamo", files: "Documenti",
    addCard: "Aggiungi carta", customerService: "CS", adminPanel: "Pannello Admin",
    adminPinTitle: "Codice accesso amministratore", adminPinDesc: "Inserisci il tuo PIN per accedere al pannello admin",
    selectLanguage: "Seleziona lingua", searchLanguage: "Cerca...",
    teamTitle: "Squadra", myTeam: "La mia squadra", invitationLink: "Link di invito", copy: "Copia", teamDetails: "Dettagli squadra", share: "Condividi", commissionRate: "Tasso di commissione", validUser: "Utente valido", commission: "Commissione", myRevenues: "I miei ricavi", numberOfPeople: "Numero di persone", invitationGift: "Regalo di invito", viewTeamDetails: "Vedi i dettagli della mia squadra", cashbackLevel1Pre: "Quando i tuoi amici si registrano e investono, ricevi immediatamente", cashbackLevel2Pre: "Quando i membri di livello 2 investono, ricevi", cashbackLevel3Pre: "Quando i membri di livello 3 investono, ricevi", ofCashback: "di cashback", codeCopied: "Codice copiato!", linkCopied: "Link copiato!", linkCopiedInstagram: "Link copiato!", linkCopiedInstagramDesc: "Incollalo nella tua bio Instagram.", teamHistory: "Storico squadra", levelLabel: "Livello", teamMembersLabel: "Membri della squadra", teamDepositsLabel: "Depositi della squadra", noMembersMsg: "Nessun membro al livello", inviteFriendsMsg: "Invita amici per far crescere la tua squadra", accountLabel: "Account", dateLabel: "Data",
  },

  ja: {
    navHome: "ホーム", navProducts: "製品", navTeam: "チーム", navMine: "マイ",
    welcomeTitle: "ようこそ",
    welcomeSubtitle: "投資の旅を始めましょう",
    phoneLabel: "電話番号", passwordLabel: "パスワード",
    forgotPassword: "パスワードをお忘れですか？",
    loginBtn: "ログイン", registerLink: "登録",
    enterPhone: "電話番号を入力してください",
    enterPassword: "パスワードを入力してください",
    verificationCode: "認証コード", invitationCode: "招待コード",
    loginLink: "ログイン？", registerBtn: "登録",
    enterPhoneReg: "電話番号を入力", enterPasswordReg: "パスワードを入力",
    enterVerif: "認証コードを入力", enterInvit: "招待コード（任意）",
    accountAssets: "口座資産", totalRevenue: "総収益",
    becomePartner: "TREKのビジネスパートナーになり、資産の成長機会をアンロックしてください。",
    recharge: "入金", withdraw: "出金", accountBtn: "アカウント",
    myProducts: "マイ製品", whatsapp: "Whatsapp",
    globalPartnerships: "TREKグローバルパートナーシップ",
    partnershipsDesc: "Trek Bicycle Corporationは1976年にDick BurkeとBevil Hoggによってウィスコンシン州ウォータールーで設立されました。",
    ourProducts: "製品", investBtn: "投資",
    perDay: "/ 日", estimatedTotal: "推定合計", noProducts: "製品なし",
    insufficientBalance: "残高不足。不足額：",
    earning24h: "24時間ごとに収益支払い",
    cancel: "キャンセル", confirm: "確認",
    price: "価格：", dailyRevenue: "日次収益：", estimatedRevenue: "推定収益：", duration: "期間：", days: "日",
    purchaseSuccess: "購入完了！", purchaseSuccessDesc: "明日から収益を受け取り始めます。",
    marqueeText: "1976年にウィスコンシン州ウォータールーで設立されたTrek Bicycle Corporationは、より高性能な自転車の製造に取り組んでいます。",
    personalCenter: "個人センター", signOut: "ログアウト",
    balance: "残高", pendingCommerce: "保留中\n取引", volume: "取引量",
    deposit: "入金", withdrawal: "出金",
    security: "セキュリティ", about: "について", files: "ファイル",
    addCard: "カード追加", customerService: "CS", adminPanel: "管理パネル",
    adminPinTitle: "管理者アクセスコード", adminPinDesc: "管理パネルにアクセスするためのPINコードを入力してください",
    selectLanguage: "言語を選択", searchLanguage: "検索...",
    teamTitle: "チーム", myTeam: "マイチーム", invitationLink: "招待リンク", copy: "コピー", teamDetails: "チーム詳細", share: "共有", commissionRate: "コミッション率", validUser: "有効ユーザー", commission: "コミッション", myRevenues: "収益", numberOfPeople: "人数", invitationGift: "招待ギフト", viewTeamDetails: "チームの詳細を見る", cashbackLevel1Pre: "友達が登録して投資を行うと、すぐに", cashbackLevel2Pre: "レベル2のメンバーが投資すると", cashbackLevel3Pre: "レベル3のメンバーが投資すると", ofCashback: "のキャッシュバックを受け取ります", codeCopied: "招待コードをコピーしました！", linkCopied: "招待リンクをコピーしました！", linkCopiedInstagram: "リンクをコピーしました！", linkCopiedInstagramDesc: "InstagramのBioに貼り付けてください。", teamHistory: "チーム履歴", levelLabel: "レベル", teamMembersLabel: "チームメンバー", teamDepositsLabel: "チームデポジット", noMembersMsg: "レベルにメンバーがいません", inviteFriendsMsg: "友達を招待してチームを広げましょう", accountLabel: "アカウント", dateLabel: "日付",
  },

  ko: {
    navHome: "홈", navProducts: "제품", navTeam: "팀", navMine: "내것",
    welcomeTitle: "환영합니다",
    welcomeSubtitle: "투자 여정을 시작하세요",
    phoneLabel: "전화번호", passwordLabel: "비밀번호",
    forgotPassword: "비밀번호를 잊으셨나요?",
    loginBtn: "로그인", registerLink: "가입",
    enterPhone: "전화번호를 입력하세요",
    enterPassword: "비밀번호를 입력하세요",
    verificationCode: "인증 코드", invitationCode: "초대 코드",
    loginLink: "로그인?", registerBtn: "가입하기",
    enterPhoneReg: "전화번호 입력", enterPasswordReg: "비밀번호 입력",
    enterVerif: "인증 코드 입력", enterInvit: "초대 코드 (선택)",
    accountAssets: "계정 자산", totalRevenue: "총 수익",
    becomePartner: "TREK의 비즈니스 파트너가 되어 자산 성장 기회를 잠금 해제하세요.",
    recharge: "입금", withdraw: "출금", accountBtn: "계정",
    myProducts: "내 제품", whatsapp: "Whatsapp",
    globalPartnerships: "TREK 글로벌 파트너십",
    partnershipsDesc: "Trek Bicycle Corporation은 1976년 Dick Burke와 Bevil Hogg가 위스콘신주 워털루에 설립했습니다.",
    ourProducts: "제품", investBtn: "투자",
    perDay: "/ 일", estimatedTotal: "예상 합계", noProducts: "제품 없음",
    insufficientBalance: "잔액 부족. 부족액：",
    earning24h: "24시간마다 수익 지급",
    cancel: "취소", confirm: "확인",
    price: "가격：", dailyRevenue: "일일 수익：", estimatedRevenue: "예상 수익：", duration: "기간：", days: "일",
    purchaseSuccess: "구매 완료!", purchaseSuccessDesc: "내일부터 수익을 받기 시작합니다.",
    marqueeText: "1976년 위스콘신주 워털루에 설립된 Trek Bicycle Corporation은 더 뛰어난 성능의 자전거를 만들기 위해 노력합니다.",
    personalCenter: "개인 센터", signOut: "로그아웃",
    balance: "잔액", pendingCommerce: "보류 중\n거래", volume: "거래량",
    deposit: "입금", withdrawal: "출금",
    security: "보안", about: "정보", files: "파일",
    addCard: "카드 추가", customerService: "CS", adminPanel: "관리 패널",
    adminPinTitle: "관리자 액세스 코드", adminPinDesc: "관리 패널에 액세스하려면 PIN 코드를 입력하세요",
    selectLanguage: "언어 선택", searchLanguage: "검색...",
    teamTitle: "팀", myTeam: "내 팀", invitationLink: "초대 링크", copy: "복사", teamDetails: "팀 세부정보", share: "공유", commissionRate: "커미션 비율", validUser: "유효한 사용자", commission: "커미션", myRevenues: "내 수익", numberOfPeople: "인원 수", invitationGift: "초대 선물", viewTeamDetails: "내 팀 세부정보 보기", cashbackLevel1Pre: "친구들이 가입하고 투자를 완료하면 즉시", cashbackLevel2Pre: "레벨 2 팀원이 투자하면", cashbackLevel3Pre: "레벨 3 팀원이 투자하면", ofCashback: "캐시백을 받습니다", codeCopied: "초대 코드가 복사되었습니다!", linkCopied: "초대 링크가 복사되었습니다!", linkCopiedInstagram: "링크가 복사되었습니다!", linkCopiedInstagramDesc: "인스타그램 바이오에 붙여넣으세요.", teamHistory: "팀 기록", levelLabel: "레벨", teamMembersLabel: "팀 멤버", teamDepositsLabel: "팀 입금", noMembersMsg: "레벨에 멤버가 없습니다", inviteFriendsMsg: "친구를 초대하여 팀을 키우세요", accountLabel: "계정", dateLabel: "날짜",
  },

  de: {
    navHome: "Startseite", navProducts: "Produkte", navTeam: "Team", navMine: "Meins",
    welcomeTitle: "Willkommen bei uns",
    welcomeSubtitle: "Beginnen Sie Ihre Investitionsreise",
    phoneLabel: "Telefon", passwordLabel: "Passwort",
    forgotPassword: "Passwort vergessen?",
    loginBtn: "ANMELDEN", registerLink: "Registrieren",
    enterPhone: "Bitte geben Sie Ihre Telefonnummer ein",
    enterPassword: "Bitte geben Sie Ihr Passwort ein",
    verificationCode: "Bestätigungscode", invitationCode: "Einladungscode",
    loginLink: "Anmelden?", registerBtn: "Registrieren",
    enterPhoneReg: "Telefonnummer eingeben", enterPasswordReg: "Passwort eingeben",
    enterVerif: "Bestätigungscode eingeben", enterInvit: "Einladungscode (optional)",
    accountAssets: "Kontovermögen", totalRevenue: "Gesamteinnahmen",
    becomePartner: "Werden Sie TREK-Geschäftspartner und erschließen Sie Wachstumschancen für Ihre Vermögenswerte.",
    recharge: "Einzahlen", withdraw: "Abheben", accountBtn: "Konto",
    myProducts: "Meine Produkte", whatsapp: "Whatsapp",
    globalPartnerships: "TREK GLOBALE PARTNERSCHAFTEN",
    partnershipsDesc: "Trek Bicycle Corporation wurde 1976 von Dick Burke und Bevil Hogg in Waterloo, Wisconsin gegründet. Als Pionier im Hochleistungsfahrraddesign hat sich Trek dank ständiger Innovationen und strategischer Partnerschaften als globale Referenz etabliert.",
    ourProducts: "Unsere Produkte", investBtn: "Investieren",
    perDay: "/ Tag", estimatedTotal: "geschätzter Gesamtbetrag", noProducts: "Keine Produkte verfügbar",
    insufficientBalance: "Unzureichendes Guthaben. Es fehlen",
    earning24h: "Gewinne werden alle 24 Stunden ausgezahlt",
    cancel: "Abbrechen", confirm: "Bestätigen",
    price: "Preis:", dailyRevenue: "Tageseinnahmen:", estimatedRevenue: "Geschätzte Einnahmen:", duration: "Dauer:", days: "Tage",
    purchaseSuccess: "Produkt gekauft!", purchaseSuccessDesc: "Sie werden morgen beginnen, Einnahmen zu erhalten.",
    marqueeText: "Trek Bicycle Corporation wurde 1976 in Waterloo, Wisconsin gegründet und ist bestrebt, leistungsfähigere Fahrräder zu entwickeln. Schließen Sie sich uns an und lassen Sie Ihr Vermögen mit TREK wachsen.",
    personalCenter: "Persönliches Zentrum", signOut: "Abmelden",
    balance: "Kontostand", pendingCommerce: "Ausstehender\nHandel", volume: "Volumen",
    deposit: "Einzahlung", withdrawal: "Auszahlung",
    security: "Sicherheit", about: "Über uns", files: "Dateien",
    addCard: "Karte hinzufügen", customerService: "CS", adminPanel: "Admin-Panel",
    adminPinTitle: "Administrator-Zugangscode", adminPinDesc: "Geben Sie Ihren PIN-Code ein, um auf das Admin-Panel zuzugreifen",
    selectLanguage: "Sprache auswählen", searchLanguage: "Suchen...",
    teamTitle: "Team", myTeam: "Mein Team", invitationLink: "Einladungslink", copy: "Kopieren", teamDetails: "Team-Details", share: "Teilen", commissionRate: "Provisionssatz", validUser: "Gültiger Benutzer", commission: "Provision", myRevenues: "Meine Einnahmen", numberOfPeople: "Anzahl der Personen", invitationGift: "Einladungsgeschenk", viewTeamDetails: "Meine Team-Details anzeigen", cashbackLevel1Pre: "Wenn Ihre Freunde sich registrieren und investieren, erhalten Sie sofort", cashbackLevel2Pre: "Wenn Level-2-Mitglieder investieren, erhalten Sie", cashbackLevel3Pre: "Wenn Level-3-Mitglieder investieren, erhalten Sie", ofCashback: "Cashback", codeCopied: "Einladungscode kopiert!", linkCopied: "Einladungslink kopiert!", linkCopiedInstagram: "Link kopiert!", linkCopiedInstagramDesc: "Füge ihn in deine Instagram-Bio ein.", teamHistory: "Team-Verlauf", levelLabel: "Level", teamMembersLabel: "Teammitglieder", teamDepositsLabel: "Team-Einzahlungen", noMembersMsg: "Keine Mitglieder auf Level", inviteFriendsMsg: "Lade Freunde ein, um dein Team zu vergrößern", accountLabel: "Konto", dateLabel: "Datum",
  },

  ru: {
    navHome: "Главная", navProducts: "Продукты", navTeam: "Команда", navMine: "Моё",
    welcomeTitle: "Добро пожаловать",
    welcomeSubtitle: "Начните свой инвестиционный путь",
    phoneLabel: "Телефон", passwordLabel: "Пароль",
    forgotPassword: "Забыли пароль?",
    loginBtn: "ВОЙТИ", registerLink: "Зарегистрироваться",
    enterPhone: "Введите номер телефона",
    enterPassword: "Введите пароль",
    verificationCode: "Код подтверждения", invitationCode: "Код приглашения",
    loginLink: "Войти?", registerBtn: "Зарегистрироваться",
    enterPhoneReg: "Введите номер телефона", enterPasswordReg: "Введите пароль",
    enterVerif: "Введите код подтверждения", enterInvit: "Код приглашения (необязательно)",
    accountAssets: "Активы счёта", totalRevenue: "Общий доход",
    becomePartner: "Станьте бизнес-партнёром TREK и откройте возможности роста для ваших активов.",
    recharge: "Пополнить", withdraw: "Вывести", accountBtn: "Аккаунт",
    myProducts: "Мои продукты", whatsapp: "Whatsapp",
    globalPartnerships: "ГЛОБАЛЬНОЕ ПАРТНЁРСТВО TREK",
    partnershipsDesc: "Trek Bicycle Corporation была основана в 1976 году Диком Бёрком и Бевилом Хоггом в Уотерлу, Висконсин. Пионер в разработке высокопроизводительных велосипедов, Trek стала мировым эталоном благодаря постоянным инновациям и стратегическим партнёрствам.",
    ourProducts: "Наши Продукты", investBtn: "Инвестировать",
    perDay: "/ день", estimatedTotal: "оценочный итог", noProducts: "Продукты недоступны",
    insufficientBalance: "Недостаточно средств. Не хватает",
    earning24h: "Прибыль выплачивается каждые 24 часа",
    cancel: "Отмена", confirm: "Подтвердить",
    price: "Цена:", dailyRevenue: "Ежедневный доход:", estimatedRevenue: "Ожидаемый доход:", duration: "Срок:", days: "дней",
    purchaseSuccess: "Продукт куплен!", purchaseSuccessDesc: "Вы начнёте получать прибыль завтра.",
    marqueeText: "Trek Bicycle Corporation основана в 1976 году в Уотерлу, Висконсин, и стремится создавать более производительные велосипеды. Присоединяйтесь к нам и приумножайте своё состояние с TREK.",
    personalCenter: "Личный кабинет", signOut: "Выйти",
    balance: "Баланс", pendingCommerce: "Ожидающие\nсделки", volume: "Объём",
    deposit: "Депозит", withdrawal: "Вывод",
    security: "Безопасность", about: "О нас", files: "Файлы",
    addCard: "Добавить карту", customerService: "CS", adminPanel: "Панель Admin",
    adminPinTitle: "Код доступа администратора", adminPinDesc: "Введите PIN-код для доступа к панели администратора",
    selectLanguage: "Выбрать язык", searchLanguage: "Поиск...",
    teamTitle: "Команда", myTeam: "Моя команда", invitationLink: "Реферальная ссылка", copy: "Копировать", teamDetails: "Детали команды", share: "Поделиться", commissionRate: "Ставка комиссии", validUser: "Действительный пользователь", commission: "Комиссия", myRevenues: "Мои доходы", numberOfPeople: "Количество людей", invitationGift: "Подарок за приглашение", viewTeamDetails: "Посмотреть детали команды", cashbackLevel1Pre: "Когда ваши друзья регистрируются и инвестируют, вы сразу получаете", cashbackLevel2Pre: "Когда участники 2-го уровня инвестируют, вы получаете", cashbackLevel3Pre: "Когда участники 3-го уровня инвестируют, вы получаете", ofCashback: "кэшбэка", codeCopied: "Код скопирован!", linkCopied: "Ссылка скопирована!", linkCopiedInstagram: "Ссылка скопирована!", linkCopiedInstagramDesc: "Вставьте её в свой профиль Instagram.", teamHistory: "История команды", levelLabel: "Уровень", teamMembersLabel: "Участники команды", teamDepositsLabel: "Депозиты команды", noMembersMsg: "Нет участников на уровне", inviteFriendsMsg: "Приглашайте друзей для развития команды", accountLabel: "Аккаунт", dateLabel: "Дата",
  },

  vi: {
    navHome: "Trang chủ", navProducts: "Sản phẩm", navTeam: "Đội nhóm", navMine: "Của tôi",
    welcomeTitle: "Chào mừng bạn",
    welcomeSubtitle: "Bắt đầu hành trình đầu tư của bạn",
    phoneLabel: "Điện thoại", passwordLabel: "Mật khẩu",
    forgotPassword: "Quên mật khẩu?",
    loginBtn: "ĐĂNG NHẬP", registerLink: "Đăng ký",
    enterPhone: "Vui lòng nhập số điện thoại",
    enterPassword: "Vui lòng nhập mật khẩu",
    verificationCode: "Mã xác minh", invitationCode: "Mã mời",
    loginLink: "Đăng nhập?", registerBtn: "Đăng ký",
    enterPhoneReg: "Nhập số điện thoại", enterPasswordReg: "Nhập mật khẩu",
    enterVerif: "Nhập mã xác minh", enterInvit: "Mã mời (tùy chọn)",
    accountAssets: "Tài sản tài khoản", totalRevenue: "Tổng doanh thu",
    becomePartner: "Trở thành đối tác kinh doanh TREK và mở khóa cơ hội tăng trưởng cho tài sản của bạn.",
    recharge: "Nạp tiền", withdraw: "Rút tiền", accountBtn: "Tài khoản",
    myProducts: "Sản phẩm của tôi", whatsapp: "Whatsapp",
    globalPartnerships: "ĐỐI TÁC TOÀN CẦU TREK",
    partnershipsDesc: "Trek Bicycle Corporation được thành lập năm 1976 bởi Dick Burke và Bevil Hogg tại Waterloo, Wisconsin. Là người tiên phong trong thiết kế xe đạp hiệu suất cao, Trek đã khẳng định vị trí là chuẩn mực toàn cầu nhờ đổi mới liên tục và quan hệ đối tác chiến lược.",
    ourProducts: "Sản Phẩm", investBtn: "Đầu tư",
    perDay: "/ ngày", estimatedTotal: "tổng ước tính", noProducts: "Không có sản phẩm",
    insufficientBalance: "Số dư không đủ. Thiếu",
    earning24h: "Thu nhập được trả mỗi 24 giờ",
    cancel: "Hủy", confirm: "Xác nhận",
    price: "Giá:", dailyRevenue: "Thu nhập hàng ngày:", estimatedRevenue: "Thu nhập ước tính:", duration: "Thời hạn:", days: "ngày",
    purchaseSuccess: "Mua hàng thành công!", purchaseSuccessDesc: "Bạn sẽ bắt đầu nhận thu nhập vào ngày mai.",
    marqueeText: "Trek Bicycle Corporation được thành lập năm 1976 tại Waterloo, Wisconsin, cam kết tạo ra những chiếc xe đạp hiệu suất cao hơn. Tham gia cùng chúng tôi và phát triển tài sản của bạn với TREK.",
    personalCenter: "Trung tâm cá nhân", signOut: "Đăng xuất",
    balance: "Số dư", pendingCommerce: "Giao dịch\nđang chờ", volume: "Khối lượng",
    deposit: "Nạp tiền", withdrawal: "Rút tiền",
    security: "Bảo mật", about: "Giới thiệu", files: "Hồ sơ",
    addCard: "Thêm thẻ", customerService: "CS", adminPanel: "Bảng Admin",
    adminPinTitle: "Mã truy cập quản trị viên", adminPinDesc: "Nhập mã PIN để truy cập bảng quản trị",
    selectLanguage: "Chọn ngôn ngữ", searchLanguage: "Tìm kiếm...",
    teamTitle: "Đội nhóm", myTeam: "Đội của tôi", invitationLink: "Liên kết mời", copy: "Sao chép", teamDetails: "Chi tiết đội", share: "Chia sẻ", commissionRate: "Tỷ lệ hoa hồng", validUser: "Người dùng hợp lệ", commission: "Hoa hồng", myRevenues: "Thu nhập của tôi", numberOfPeople: "Số người", invitationGift: "Quà mời", viewTeamDetails: "Xem chi tiết đội của tôi", cashbackLevel1Pre: "Khi bạn bè đăng ký và đầu tư, bạn nhận được ngay", cashbackLevel2Pre: "Khi thành viên cấp 2 đầu tư, bạn nhận", cashbackLevel3Pre: "Khi thành viên cấp 3 đầu tư, bạn nhận", ofCashback: "hoàn tiền", codeCopied: "Đã sao chép mã mời!", linkCopied: "Đã sao chép liên kết mời!", linkCopiedInstagram: "Đã sao chép liên kết!", linkCopiedInstagramDesc: "Dán vào bio Instagram của bạn.", teamHistory: "Lịch sử đội", levelLabel: "Cấp", teamMembersLabel: "Thành viên đội", teamDepositsLabel: "Tiền gửi đội", noMembersMsg: "Không có thành viên ở cấp", inviteFriendsMsg: "Mời bạn bè để mở rộng đội của bạn", accountLabel: "Tài khoản", dateLabel: "Ngày",
  },

  pt: {
    navHome: "Início", navProducts: "Produtos", navTeam: "Equipe", navMine: "Meu",
    welcomeTitle: "Bem-vindo entre nós",
    welcomeSubtitle: "Comece sua jornada de investimento",
    phoneLabel: "Telefone", passwordLabel: "Senha",
    forgotPassword: "Esqueceu a senha?",
    loginBtn: "ENTRAR", registerLink: "Cadastrar",
    enterPhone: "Digite seu número de telefone",
    enterPassword: "Digite sua senha",
    verificationCode: "Código de verificação", invitationCode: "Código de convite",
    loginLink: "Entrar?", registerBtn: "Cadastrar",
    enterPhoneReg: "Digite seu telefone", enterPasswordReg: "Digite sua senha",
    enterVerif: "Digite o código de verificação", enterInvit: "Código de convite (opcional)",
    accountAssets: "Ativos da conta", totalRevenue: "Receita total",
    becomePartner: "Torne-se um parceiro comercial da TREK e desbloqueie oportunidades de crescimento para seus ativos.",
    recharge: "Depositar", withdraw: "Sacar", accountBtn: "Conta",
    myProducts: "Meus produtos", whatsapp: "Whatsapp",
    globalPartnerships: "PARCERIAS GLOBAIS TREK",
    partnershipsDesc: "A Trek Bicycle Corporation foi fundada em 1976 por Dick Burke e Bevil Hogg em Waterloo, Wisconsin. Pioneira no design de bicicletas de alto desempenho, a Trek se consolidou como referência global graças às suas inovações constantes e parcerias estratégicas.",
    ourProducts: "Nossos Produtos", investBtn: "Investir",
    perDay: "/ dia", estimatedTotal: "total estimado", noProducts: "Nenhum produto disponível",
    insufficientBalance: "Saldo insuficiente. Faltam",
    earning24h: "Ganhos pagos a cada 24 horas",
    cancel: "Cancelar", confirm: "Confirmar",
    price: "Preço:", dailyRevenue: "Receita diária:", estimatedRevenue: "Receita estimada:", duration: "Duração:", days: "dias",
    purchaseSuccess: "Produto comprado!", purchaseSuccessDesc: "Você começará a receber ganhos amanhã.",
    marqueeText: "Fundada em 1976 em Waterloo, Wisconsin, a Trek Bicycle Corporation está comprometida em criar bicicletas de maior desempenho. Junte-se a nós e faça seu patrimônio crescer com a TREK.",
    personalCenter: "Centro pessoal", signOut: "Sair",
    balance: "Saldo", pendingCommerce: "Comércio\npendente", volume: "Volume",
    deposit: "Depósito", withdrawal: "Saque",
    security: "Segurança", about: "Sobre", files: "Arquivos",
    addCard: "Adicionar cartão", customerService: "CS", adminPanel: "Painel Admin",
    adminPinTitle: "Código de acesso do administrador", adminPinDesc: "Digite seu PIN para acessar o painel de administração",
    selectLanguage: "Selecionar idioma", searchLanguage: "Pesquisar...",
    teamTitle: "Equipe", myTeam: "Minha equipe", invitationLink: "Link de convite", copy: "Copiar", teamDetails: "Detalhes da equipe", share: "Compartilhar", commissionRate: "Taxa de comissão", validUser: "Usuário válido", commission: "Comissão", myRevenues: "Minha receita", numberOfPeople: "Número de pessoas", invitationGift: "Presente de convite", viewTeamDetails: "Ver detalhes da minha equipe", cashbackLevel1Pre: "Quando seus amigos se cadastram e investem, você recebe imediatamente", cashbackLevel2Pre: "Quando membros do nível 2 investem, você recebe", cashbackLevel3Pre: "Quando membros do nível 3 investem, você recebe", ofCashback: "de cashback", codeCopied: "Código de convite copiado!", linkCopied: "Link de convite copiado!", linkCopiedInstagram: "Link copiado!", linkCopiedInstagramDesc: "Cole-o na sua bio do Instagram.", teamHistory: "Histórico da equipe", levelLabel: "Nível", teamMembersLabel: "Membros da equipe", teamDepositsLabel: "Depósitos da equipe", noMembersMsg: "Nenhum membro no nível", inviteFriendsMsg: "Convide amigos para crescer sua equipe", accountLabel: "Conta", dateLabel: "Data",
  },

  tr: {
    navHome: "Ana Sayfa", navProducts: "Ürünler", navTeam: "Takım", navMine: "Benim",
    welcomeTitle: "Aramıza hoş geldiniz",
    welcomeSubtitle: "Yatırım yolculuğunuza başlayın",
    phoneLabel: "Telefon", passwordLabel: "Şifre",
    forgotPassword: "Şifremi unuttum?",
    loginBtn: "GİRİŞ", registerLink: "Kayıt Ol",
    enterPhone: "Telefon numaranızı girin",
    enterPassword: "Şifrenizi girin",
    verificationCode: "Doğrulama kodu", invitationCode: "Davet kodu",
    loginLink: "Giriş yap?", registerBtn: "Kayıt Ol",
    enterPhoneReg: "Telefon numaranızı girin", enterPasswordReg: "Şifrenizi girin",
    enterVerif: "Doğrulama kodunu girin", enterInvit: "Davet kodu (isteğe bağlı)",
    accountAssets: "Hesap varlıkları", totalRevenue: "Toplam gelir",
    becomePartner: "TREK ticari ortağı olun ve varlıklarınız için büyüme fırsatlarının kilidini açın.",
    recharge: "Yatır", withdraw: "Çek", accountBtn: "Hesap",
    myProducts: "Ürünlerim", whatsapp: "Whatsapp",
    globalPartnerships: "TREK KÜRESEL ORTAKLIKLARI",
    partnershipsDesc: "Trek Bicycle Corporation, 1976 yılında Dick Burke ve Bevil Hogg tarafından Wisconsin'in Waterloo şehrinde kuruldu. Yüksek performanslı bisiklet tasarımında öncü olan Trek, sürekli yenilikler ve stratejik ortaklıklar sayesinde küresel bir referans haline geldi.",
    ourProducts: "Ürünlerimiz", investBtn: "Yatırım Yap",
    perDay: "/ gün", estimatedTotal: "tahmini toplam", noProducts: "Ürün yok",
    insufficientBalance: "Yetersiz bakiye. Eksik:",
    earning24h: "Kazançlar her 24 saatte bir ödenir",
    cancel: "İptal", confirm: "Onayla",
    price: "Fiyat:", dailyRevenue: "Günlük gelir:", estimatedRevenue: "Tahmini gelir:", duration: "Süre:", days: "gün",
    purchaseSuccess: "Ürün satın alındı!", purchaseSuccessDesc: "Yarından itibaren kazanç almaya başlayacaksınız.",
    marqueeText: "Wisconsin'in Waterloo şehrinde 1976 yılında kurulan Trek Bicycle Corporation, daha yüksek performanslı bisikletler yaratmaya kararlıdır. Bize katılın ve TREK ile servetinizi büyütün.",
    personalCenter: "Kişisel Merkez", signOut: "Çıkış Yap",
    balance: "Bakiye", pendingCommerce: "Bekleyen\nticaret", volume: "Hacim",
    deposit: "Yatırım", withdrawal: "Çekim",
    security: "Güvenlik", about: "Hakkında", files: "Dosyalar",
    addCard: "Kart Ekle", customerService: "CS", adminPanel: "Yönetici Paneli",
    adminPinTitle: "Yönetici erişim kodu", adminPinDesc: "Yönetici paneline erişmek için PIN kodunuzu girin",
    selectLanguage: "Dil seçin", searchLanguage: "Ara...",
    teamTitle: "Takım", myTeam: "Benim takımım", invitationLink: "Davet bağlantısı", copy: "Kopyala", teamDetails: "Takım detayları", share: "Paylaş", commissionRate: "Komisyon oranı", validUser: "Geçerli kullanıcı", commission: "Komisyon", myRevenues: "Gelirlerim", numberOfPeople: "Kişi sayısı", invitationGift: "Davet hediyesi", viewTeamDetails: "Takım detaylarımı görüntüle", cashbackLevel1Pre: "Arkadaşlarınız kaydolup yatırım yaptığında hemen alırsınız", cashbackLevel2Pre: "Seviye 2 üyeler yatırım yaptığında alırsınız", cashbackLevel3Pre: "Seviye 3 üyeler yatırım yaptığında alırsınız", ofCashback: "nakit iadesi", codeCopied: "Davet kodu kopyalandı!", linkCopied: "Davet bağlantısı kopyalandı!", linkCopiedInstagram: "Bağlantı kopyalandı!", linkCopiedInstagramDesc: "Instagram biyonuza yapıştırın.", teamHistory: "Takım geçmişi", levelLabel: "Seviye", teamMembersLabel: "Takım üyeleri", teamDepositsLabel: "Takım mevduatları", noMembersMsg: "Seviyede üye yok", inviteFriendsMsg: "Takımını büyütmek için arkadaş davet et", accountLabel: "Hesap", dateLabel: "Tarih",
  },

  es: {
    navHome: "Inicio", navProducts: "Productos", navTeam: "Equipo", navMine: "Mi cuenta",
    welcomeTitle: "Bienvenido entre nosotros",
    welcomeSubtitle: "Comienza tu viaje de inversión",
    phoneLabel: "Teléfono", passwordLabel: "Contraseña",
    forgotPassword: "¿Olvidaste tu contraseña?",
    loginBtn: "INICIAR SESIÓN", registerLink: "Registrarse",
    enterPhone: "Ingresa tu número de teléfono",
    enterPassword: "Ingresa tu contraseña",
    verificationCode: "Código de verificación", invitationCode: "Código de invitación",
    loginLink: "¿Iniciar sesión?", registerBtn: "Registrarse",
    enterPhoneReg: "Ingresa tu teléfono", enterPasswordReg: "Ingresa tu contraseña",
    enterVerif: "Ingresa el código de verificación", enterInvit: "Código de invitación (opcional)",
    accountAssets: "Activos de la cuenta", totalRevenue: "Ingresos totales",
    becomePartner: "Conviértete en socio comercial de TREK y desbloquea oportunidades de crecimiento para tus activos.",
    recharge: "Depositar", withdraw: "Retirar", accountBtn: "Cuenta",
    myProducts: "Mis productos", whatsapp: "Whatsapp",
    globalPartnerships: "ASOCIACIONES MUNDIALES TREK",
    partnershipsDesc: "Trek Bicycle Corporation fue fundada en 1976 por Dick Burke y Bevil Hogg en Waterloo, Wisconsin. Pionera en el diseño de bicicletas de alto rendimiento, Trek se ha consolidado como referente mundial gracias a sus constantes innovaciones y alianzas estratégicas.",
    ourProducts: "Nuestros Productos", investBtn: "Invertir",
    perDay: "/ día", estimatedTotal: "total estimado", noProducts: "No hay productos disponibles",
    insufficientBalance: "Saldo insuficiente. Faltan",
    earning24h: "Ganancias pagadas cada 24 horas",
    cancel: "Cancelar", confirm: "Confirmar",
    price: "Precio:", dailyRevenue: "Ingreso diario:", estimatedRevenue: "Ingreso estimado:", duration: "Duración:", days: "días",
    purchaseSuccess: "¡Producto comprado!", purchaseSuccessDesc: "Empezarás a recibir ganancias mañana.",
    marqueeText: "Fundada en 1976 en Waterloo, Wisconsin, Trek Bicycle Corporation se compromete a crear bicicletas de mayor rendimiento. Únete a nosotros y haz crecer tu patrimonio con TREK.",
    personalCenter: "Centro personal", signOut: "Cerrar sesión",
    balance: "Saldo", pendingCommerce: "Comercio\npendiente", volume: "Volumen",
    deposit: "Depósito", withdrawal: "Retiro",
    security: "Seguridad", about: "Acerca de", files: "Archivos",
    addCard: "Agregar tarjeta", customerService: "CS", adminPanel: "Panel Admin",
    adminPinTitle: "Código de acceso de administrador", adminPinDesc: "Ingresa tu PIN para acceder al panel de administración",
    selectLanguage: "Seleccionar idioma", searchLanguage: "Buscar...",
    teamTitle: "Equipo", myTeam: "Mi equipo", invitationLink: "Enlace de invitación", copy: "Copiar", teamDetails: "Detalles del equipo", share: "Compartir", commissionRate: "Tasa de comisión", validUser: "Usuario válido", commission: "Comisión", myRevenues: "Mis ingresos", numberOfPeople: "Número de personas", invitationGift: "Regalo de invitación", viewTeamDetails: "Ver los detalles de mi equipo", cashbackLevel1Pre: "Cuando tus amigos se registran e invierten, recibes inmediatamente", cashbackLevel2Pre: "Cuando los miembros de nivel 2 invierten, recibes", cashbackLevel3Pre: "Cuando los miembros de nivel 3 invierten, recibes", ofCashback: "de cashback", codeCopied: "¡Código de invitación copiado!", linkCopied: "¡Enlace de invitación copiado!", linkCopiedInstagram: "¡Enlace copiado!", linkCopiedInstagramDesc: "Pégalo en tu bio de Instagram.", teamHistory: "Historial del equipo", levelLabel: "Nivel", teamMembersLabel: "Miembros del equipo", teamDepositsLabel: "Depósitos del equipo", noMembersMsg: "Sin miembros en el nivel", inviteFriendsMsg: "Invita amigos para hacer crecer tu equipo", accountLabel: "Cuenta", dateLabel: "Fecha",
  },

  fa: {
    navHome: "خانه", navProducts: "محصولات", navTeam: "تیم", navMine: "من",
    welcomeTitle: "به جمع ما خوش آمدید",
    welcomeSubtitle: "سفر سرمایه‌گذاری خود را شروع کنید",
    phoneLabel: "تلفن", passwordLabel: "رمز عبور",
    forgotPassword: "رمز عبور را فراموش کردید؟",
    loginBtn: "ورود", registerLink: "ثبت‌نام",
    enterPhone: "شماره تلفن خود را وارد کنید",
    enterPassword: "رمز عبور خود را وارد کنید",
    verificationCode: "کد تأیید", invitationCode: "کد دعوت",
    loginLink: "ورود؟", registerBtn: "ثبت‌نام",
    enterPhoneReg: "شماره تلفن را وارد کنید", enterPasswordReg: "رمز عبور را وارد کنید",
    enterVerif: "کد تأیید را وارد کنید", enterInvit: "کد دعوت (اختیاری)",
    accountAssets: "دارایی‌های حساب", totalRevenue: "درآمد کل",
    becomePartner: "شریک تجاری TREK شوید و فرصت‌های رشد را برای دارایی‌های خود باز کنید.",
    recharge: "واریز", withdraw: "برداشت", accountBtn: "حساب",
    myProducts: "محصولات من", whatsapp: "Whatsapp",
    globalPartnerships: "شراکت‌های جهانی TREK",
    partnershipsDesc: "شرکت Trek Bicycle Corporation در سال ۱۹۷۶ توسط دیک برک و بویل هوگ در واترلو، ویسکانسین تأسیس شد.",
    ourProducts: "محصولات ما", investBtn: "سرمایه‌گذاری",
    perDay: "/ روز", estimatedTotal: "مجموع تخمینی", noProducts: "محصولی موجود نیست",
    insufficientBalance: "موجودی ناکافی. کمبود:",
    earning24h: "سود هر ۲۴ ساعت پرداخت می‌شود",
    cancel: "لغو", confirm: "تأیید",
    price: "قیمت:", dailyRevenue: "درآمد روزانه:", estimatedRevenue: "درآمد تخمینی:", duration: "مدت:", days: "روز",
    purchaseSuccess: "محصول خریداری شد!", purchaseSuccessDesc: "از فردا شروع به دریافت سود خواهید کرد.",
    marqueeText: "شرکت Trek Bicycle Corporation در سال ۱۹۷۶ در واترلو، ویسکانسین تأسیس شد و متعهد به ساخت دوچرخه‌های با عملکرد بالاتر است.",
    personalCenter: "مرکز شخصی", signOut: "خروج",
    balance: "موجودی", pendingCommerce: "معاملات\nمعلق", volume: "حجم",
    deposit: "واریز", withdrawal: "برداشت",
    security: "امنیت", about: "درباره", files: "پرونده‌ها",
    addCard: "افزودن کارت", customerService: "CS", adminPanel: "پانل مدیر",
    adminPinTitle: "کد دسترسی مدیر", adminPinDesc: "برای دسترسی به پانل مدیر، کد PIN خود را وارد کنید",
    selectLanguage: "انتخاب زبان", searchLanguage: "جستجو...",
    teamTitle: "تیم", myTeam: "تیم من", invitationLink: "لینک دعوت", copy: "کپی", teamDetails: "جزئیات تیم", share: "اشتراک‌گذاری", commissionRate: "نرخ کمیسیون", validUser: "کاربر معتبر", commission: "کمیسیون", myRevenues: "درآمدهای من", numberOfPeople: "تعداد افراد", invitationGift: "هدیه دعوت", viewTeamDetails: "مشاهده جزئیات تیم", cashbackLevel1Pre: "وقتی دوستانتان ثبت‌نام و سرمایه‌گذاری می‌کنند، بلافاصله", cashbackLevel2Pre: "وقتی اعضای سطح ۲ سرمایه‌گذاری می‌کنند،", cashbackLevel3Pre: "وقتی اعضای سطح ۳ سرمایه‌گذاری می‌کنند،", ofCashback: "کش‌بک دریافت می‌کنید", codeCopied: "کد دعوت کپی شد!", linkCopied: "لینک دعوت کپی شد!", linkCopiedInstagram: "لینک کپی شد!", linkCopiedInstagramDesc: "آن را در بیوی اینستاگرام خود جایگذاری کنید.", teamHistory: "تاریخچه تیم", levelLabel: "سطح", teamMembersLabel: "اعضای تیم", teamDepositsLabel: "واریزهای تیم", noMembersMsg: "هیچ عضوی در سطح", inviteFriendsMsg: "برای بزرگ کردن تیم دوستانتان را دعوت کنید", accountLabel: "حساب", dateLabel: "تاریخ",
  },

  ar: {
    navHome: "الرئيسية", navProducts: "المنتجات", navTeam: "الفريق", navMine: "حسابي",
    welcomeTitle: "مرحباً بكم بيننا",
    welcomeSubtitle: "ابدأ رحلتك الاستثمارية",
    phoneLabel: "الهاتف", passwordLabel: "كلمة المرور",
    forgotPassword: "نسيت كلمة المرور؟",
    loginBtn: "تسجيل الدخول", registerLink: "إنشاء حساب",
    enterPhone: "أدخل رقم هاتفك",
    enterPassword: "أدخل كلمة المرور",
    verificationCode: "رمز التحقق", invitationCode: "رمز الدعوة",
    loginLink: "تسجيل الدخول؟", registerBtn: "إنشاء حساب",
    enterPhoneReg: "أدخل رقم الهاتف", enterPasswordReg: "أدخل كلمة المرور",
    enterVerif: "أدخل رمز التحقق", enterInvit: "رمز الدعوة (اختياري)",
    accountAssets: "أصول الحساب", totalRevenue: "إجمالي الإيرادات",
    becomePartner: "كن شريكاً تجارياً لـ TREK وافتح فرص النمو لأصولك.",
    recharge: "إيداع", withdraw: "سحب", accountBtn: "الحساب",
    myProducts: "منتجاتي", whatsapp: "Whatsapp",
    globalPartnerships: "الشراكات العالمية لـ TREK",
    partnershipsDesc: "تأسست شركة Trek Bicycle Corporation عام 1976 على يد ديك بيرك وبيفيل هوج في واترلو، ويسكونسن. رائدة في تصميم الدراجات عالية الأداء، أثبتت Trek نفسها كمرجع عالمي بفضل الابتكارات المستمرة والشراكات الاستراتيجية.",
    ourProducts: "منتجاتنا", investBtn: "استثمر",
    perDay: "/ يوم", estimatedTotal: "الإجمالي المقدر", noProducts: "لا توجد منتجات",
    insufficientBalance: "رصيد غير كافٍ. ينقص:",
    earning24h: "تُدفع الأرباح كل 24 ساعة",
    cancel: "إلغاء", confirm: "تأكيد",
    price: "السعر:", dailyRevenue: "الدخل اليومي:", estimatedRevenue: "الدخل المقدر:", duration: "المدة:", days: "أيام",
    purchaseSuccess: "تم شراء المنتج!", purchaseSuccessDesc: "ستبدأ في تلقي الأرباح غداً.",
    marqueeText: "تأسست Trek Bicycle Corporation عام 1976 في واترلو، ويسكونسن، وتلتزم بإنشاء دراجات أعلى أداءً. انضم إلينا وانمِّ ثروتك مع TREK.",
    personalCenter: "المركز الشخصي", signOut: "تسجيل الخروج",
    balance: "الرصيد", pendingCommerce: "التجارة\nالمعلقة", volume: "الحجم",
    deposit: "إيداع", withdrawal: "سحب",
    security: "الأمان", about: "حول", files: "الملفات",
    addCard: "إضافة بطاقة", customerService: "CS", adminPanel: "لوحة الإدارة",
    adminPinTitle: "رمز وصول المسؤول", adminPinDesc: "أدخل رمز PIN للوصول إلى لوحة الإدارة",
    selectLanguage: "اختر اللغة", searchLanguage: "بحث...",
    teamTitle: "الفريق", myTeam: "فريقي", invitationLink: "رابط الدعوة", copy: "نسخ", teamDetails: "تفاصيل الفريق", share: "مشاركة", commissionRate: "معدل العمولة", validUser: "مستخدم صالح", commission: "عمولة", myRevenues: "إيراداتي", numberOfPeople: "عدد الأشخاص", invitationGift: "هدية الدعوة", viewTeamDetails: "عرض تفاصيل فريقي", cashbackLevel1Pre: "عندما يسجل أصدقاؤك ويستثمرون، تحصل فورًا على", cashbackLevel2Pre: "عندما يستثمر أعضاء المستوى 2، تحصل على", cashbackLevel3Pre: "عندما يستثمر أعضاء المستوى 3، تحصل على", ofCashback: "استرداد نقدي", codeCopied: "تم نسخ رمز الدعوة!", linkCopied: "تم نسخ رابط الدعوة!", linkCopiedInstagram: "تم نسخ الرابط!", linkCopiedInstagramDesc: "الصقه في بيو إنستغرام.", teamHistory: "سجل الفريق", levelLabel: "المستوى", teamMembersLabel: "أعضاء الفريق", teamDepositsLabel: "إيداعات الفريق", noMembersMsg: "لا أعضاء في المستوى", inviteFriendsMsg: "ادعُ أصدقاء لتنمية فريقك", accountLabel: "حساب", dateLabel: "تاريخ",
  },

  id: {
    navHome: "Beranda", navProducts: "Produk", navTeam: "Tim", navMine: "Saya",
    welcomeTitle: "Selamat datang di antara kami",
    welcomeSubtitle: "Mulailah perjalanan investasi Anda",
    phoneLabel: "Telepon", passwordLabel: "Kata Sandi",
    forgotPassword: "Lupa kata sandi?",
    loginBtn: "MASUK", registerLink: "Daftar",
    enterPhone: "Masukkan nomor telepon Anda",
    enterPassword: "Masukkan kata sandi Anda",
    verificationCode: "Kode verifikasi", invitationCode: "Kode undangan",
    loginLink: "Masuk?", registerBtn: "Daftar",
    enterPhoneReg: "Masukkan nomor telepon", enterPasswordReg: "Masukkan kata sandi",
    enterVerif: "Masukkan kode verifikasi", enterInvit: "Kode undangan (opsional)",
    accountAssets: "Aset akun", totalRevenue: "Total pendapatan",
    becomePartner: "Jadilah mitra bisnis TREK dan buka peluang pertumbuhan untuk aset Anda.",
    recharge: "Setor", withdraw: "Tarik", accountBtn: "Akun",
    myProducts: "Produk saya", whatsapp: "Whatsapp",
    globalPartnerships: "KEMITRAAN GLOBAL TREK",
    partnershipsDesc: "Trek Bicycle Corporation didirikan pada tahun 1976 oleh Dick Burke dan Bevil Hogg di Waterloo, Wisconsin. Sebagai pelopor dalam desain sepeda kinerja tinggi, Trek telah memantapkan diri sebagai tolok ukur global berkat inovasi yang konstan dan kemitraan strategis.",
    ourProducts: "Produk Kami", investBtn: "Investasi",
    perDay: "/ hari", estimatedTotal: "total estimasi", noProducts: "Tidak ada produk",
    insufficientBalance: "Saldo tidak cukup. Kurang:",
    earning24h: "Penghasilan dibayar setiap 24 jam",
    cancel: "Batal", confirm: "Konfirmasi",
    price: "Harga:", dailyRevenue: "Pendapatan harian:", estimatedRevenue: "Pendapatan estimasi:", duration: "Durasi:", days: "hari",
    purchaseSuccess: "Produk dibeli!", purchaseSuccessDesc: "Anda akan mulai menerima penghasilan besok.",
    marqueeText: "Trek Bicycle Corporation didirikan pada tahun 1976 di Waterloo, Wisconsin, berkomitmen untuk menciptakan sepeda yang lebih berperforma. Bergabunglah dengan kami dan kembangkan kekayaan Anda dengan TREK.",
    personalCenter: "Pusat pribadi", signOut: "Keluar",
    balance: "Saldo", pendingCommerce: "Perdagangan\ntertunda", volume: "Volume",
    deposit: "Setor", withdrawal: "Penarikan",
    security: "Keamanan", about: "Tentang", files: "File",
    addCard: "Tambah kartu", customerService: "CS", adminPanel: "Panel Admin",
    adminPinTitle: "Kode akses administrator", adminPinDesc: "Masukkan PIN Anda untuk mengakses panel admin",
    selectLanguage: "Pilih bahasa", searchLanguage: "Cari...",
    teamTitle: "Tim", myTeam: "Tim saya", invitationLink: "Tautan undangan", copy: "Salin", teamDetails: "Detail tim", share: "Bagikan", commissionRate: "Tingkat komisi", validUser: "Pengguna valid", commission: "Komisi", myRevenues: "Pendapatan saya", numberOfPeople: "Jumlah orang", invitationGift: "Hadiah undangan", viewTeamDetails: "Lihat detail tim saya", cashbackLevel1Pre: "Ketika teman-teman Anda mendaftar dan berinvestasi, Anda langsung mendapatkan", cashbackLevel2Pre: "Ketika anggota level 2 berinvestasi, Anda mendapatkan", cashbackLevel3Pre: "Ketika anggota level 3 berinvestasi, Anda mendapatkan", ofCashback: "cashback", codeCopied: "Kode undangan disalin!", linkCopied: "Tautan undangan disalin!", linkCopiedInstagram: "Tautan disalin!", linkCopiedInstagramDesc: "Tempelkan di bio Instagram Anda.", teamHistory: "Riwayat tim", levelLabel: "Level", teamMembersLabel: "Anggota tim", teamDepositsLabel: "Deposito tim", noMembersMsg: "Tidak ada anggota di level", inviteFriendsMsg: "Undang teman untuk memperbesar tim Anda", accountLabel: "Akun", dateLabel: "Tanggal",
  },

  el: {
    navHome: "Αρχική", navProducts: "Προϊόντα", navTeam: "Ομάδα", navMine: "Δικό μου",
    welcomeTitle: "Καλώς ήλθατε ανάμεσά μας",
    welcomeSubtitle: "Ξεκινήστε το επενδυτικό σας ταξίδι",
    phoneLabel: "Τηλέφωνο", passwordLabel: "Κωδικός",
    forgotPassword: "Ξεχάσατε τον κωδικό;",
    loginBtn: "ΣΥΝΔΕΣΗ", registerLink: "Εγγραφή",
    enterPhone: "Εισάγετε τον αριθμό τηλεφώνου σας",
    enterPassword: "Εισάγετε τον κωδικό σας",
    verificationCode: "Κωδικός επαλήθευσης", invitationCode: "Κωδικός πρόσκλησης",
    loginLink: "Σύνδεση;", registerBtn: "Εγγραφή",
    enterPhoneReg: "Εισάγετε τηλέφωνο", enterPasswordReg: "Εισάγετε κωδικό",
    enterVerif: "Εισάγετε κωδικό επαλήθευσης", enterInvit: "Κωδικός πρόσκλησης (προαιρετικό)",
    accountAssets: "Περιουσιακά στοιχεία", totalRevenue: "Συνολικά έσοδα",
    becomePartner: "Γίνετε εμπορικός συνεργάτης της TREK και ξεκλειδώστε ευκαιρίες ανάπτυξης για τα περιουσιακά σας στοιχεία.",
    recharge: "Κατάθεση", withdraw: "Ανάληψη", accountBtn: "Λογαριασμός",
    myProducts: "Τα προϊόντα μου", whatsapp: "Whatsapp",
    globalPartnerships: "ΠΑΓΚΟΣΜΙΕΣ ΣΥΝΕΡΓΑΣΙΕΣ TREK",
    partnershipsDesc: "Η Trek Bicycle Corporation ιδρύθηκε το 1976 από τον Dick Burke και τον Bevil Hogg στο Waterloo του Wisconsin. Πρωτοπόρος στο σχεδιασμό ποδηλάτων υψηλής απόδοσης, η Trek έχει καθιερωθεί ως παγκόσμιο σημείο αναφοράς.",
    ourProducts: "Τα Προϊόντα μας", investBtn: "Επένδυση",
    perDay: "/ ημέρα", estimatedTotal: "εκτιμώμενο σύνολο", noProducts: "Δεν υπάρχουν προϊόντα",
    insufficientBalance: "Ανεπαρκές υπόλοιπο. Λείπουν:",
    earning24h: "Τα κέρδη καταβάλλονται κάθε 24 ώρες",
    cancel: "Ακύρωση", confirm: "Επιβεβαίωση",
    price: "Τιμή:", dailyRevenue: "Ημερήσια έσοδα:", estimatedRevenue: "Εκτιμώμενα έσοδα:", duration: "Διάρκεια:", days: "ημέρες",
    purchaseSuccess: "Το προϊόν αγοράστηκε!", purchaseSuccessDesc: "Θα αρχίσετε να λαμβάνετε κέρδη αύριο.",
    marqueeText: "Η Trek Bicycle Corporation ιδρύθηκε το 1976 στο Waterloo, Wisconsin, δεσμευμένη να δημιουργεί ποδήλατα υψηλότερης απόδοσης. Ελάτε μαζί μας και αυξήστε την περιουσία σας με την TREK.",
    personalCenter: "Προσωπικό κέντρο", signOut: "Αποσύνδεση",
    balance: "Υπόλοιπο", pendingCommerce: "Εκκρεμής\nεμπορία", volume: "Όγκος",
    deposit: "Κατάθεση", withdrawal: "Ανάληψη",
    security: "Ασφάλεια", about: "Σχετικά", files: "Αρχεία",
    addCard: "Προσθήκη κάρτας", customerService: "CS", adminPanel: "Πίνακας Admin",
    adminPinTitle: "Κωδικός πρόσβασης διαχειριστή", adminPinDesc: "Εισάγετε το PIN σας για πρόσβαση στον πίνακα διαχείρισης",
    selectLanguage: "Επιλογή γλώσσας", searchLanguage: "Αναζήτηση...",
    teamTitle: "Ομάδα", myTeam: "Η ομάδα μου", invitationLink: "Σύνδεσμος πρόσκλησης", copy: "Αντιγραφή", teamDetails: "Λεπτομέρειες ομάδας", share: "Κοινοποίηση", commissionRate: "Ποσοστό προμήθειας", validUser: "Έγκυρος χρήστης", commission: "Προμήθεια", myRevenues: "Τα έσοδά μου", numberOfPeople: "Αριθμός ατόμων", invitationGift: "Δώρο πρόσκλησης", viewTeamDetails: "Δείτε τις λεπτομέρειες της ομάδας μου", cashbackLevel1Pre: "Όταν οι φίλοι σας εγγραφούν και επενδύσουν, λαμβάνετε αμέσως", cashbackLevel2Pre: "Όταν τα μέλη επιπέδου 2 επενδύουν, λαμβάνετε", cashbackLevel3Pre: "Όταν τα μέλη επιπέδου 3 επενδύουν, λαμβάνετε", ofCashback: "επιστροφή χρημάτων", codeCopied: "Κωδικός πρόσκλησης αντιγράφηκε!", linkCopied: "Σύνδεσμος πρόσκλησης αντιγράφηκε!", linkCopiedInstagram: "Σύνδεσμος αντιγράφηκε!", linkCopiedInstagramDesc: "Επικολλήστε τον στη βιο του Instagram σας.", teamHistory: "Ιστορικό ομάδας", levelLabel: "Επίπεδο", teamMembersLabel: "Μέλη ομάδας", teamDepositsLabel: "Καταθέσεις ομάδας", noMembersMsg: "Δεν υπάρχουν μέλη στο επίπεδο", inviteFriendsMsg: "Προσκαλέστε φίλους για να μεγαλώσετε την ομάδα σας", accountLabel: "Λογαριασμός", dateLabel: "Ημερομηνία",
  },

  ht: {
    navHome: "Akèy", navProducts: "Pwodwi", navTeam: "Ekip", navMine: "Mwen",
    welcomeTitle: "Byenveni nan mitan nou",
    welcomeSubtitle: "Kòmanse vwayaj envestisman ou",
    phoneLabel: "Telefòn", passwordLabel: "Modpas",
    forgotPassword: "Ou bliye modpas ou?",
    loginBtn: "KONEKSYON", registerLink: "Enskri",
    enterPhone: "Tanpri antre nimewo telefòn ou",
    enterPassword: "Tanpri antre modpas ou",
    verificationCode: "Kòd verifikasyon", invitationCode: "Kòd envitasyon",
    loginLink: "Konekte?", registerBtn: "Enskri",
    enterPhoneReg: "Antre nimewo telefòn ou", enterPasswordReg: "Antre modpas ou",
    enterVerif: "Antre kòd verifikasyon an", enterInvit: "Kòd envitasyon (opsyonèl)",
    accountAssets: "Aktif kont lan", totalRevenue: "Revni total",
    becomePartner: "Vin patnè komèsyal TREK epi debloke opòtinite kwasans pou aktif ou yo.",
    recharge: "Depoze", withdraw: "Retire", accountBtn: "Kont",
    myProducts: "Pwodwi mwen yo", whatsapp: "Whatsapp",
    globalPartnerships: "PATENARYA MONDYAL TREK",
    partnershipsDesc: "Trek Bicycle Corporation te fonde an 1976 pa Dick Burke ak Bevil Hogg nan Waterloo, Wisconsin. Pwonje nan konstriksyon bisiklèt wo kalite, Trek etabli tèt li kòm referans mondyal gras a inovasyon kontinyèl ak patenarya estratejik.",
    ourProducts: "Pwodwi Nou Yo", investBtn: "Envesti",
    perDay: "/ jou", estimatedTotal: "total estimé", noProducts: "Pa gen pwodwi disponib",
    insufficientBalance: "Balans ensifizan. Mank:",
    earning24h: "Benefis peye chak 24 èdtan",
    cancel: "Anile", confirm: "Konfime",
    price: "Pri:", dailyRevenue: "Revni chak jou:", estimatedRevenue: "Revni estimé:", duration: "Dire:", days: "jou",
    purchaseSuccess: "Pwodwi achte!", purchaseSuccessDesc: "W ap kòmanse resevwa benefis demen.",
    marqueeText: "Trek Bicycle Corporation te fonde an 1976 nan Waterloo, Wisconsin, angaje nan kreye bisiklèt ki pi pèfòman. Rantre nan ekip nou epi fè richès ou grandi ak TREK.",
    personalCenter: "Sant pèsonèl", signOut: "Dekonekte",
    balance: "Balans", pendingCommerce: "Komès\nan atant", volume: "Volim",
    deposit: "Depo", withdrawal: "Retrè",
    security: "Sekirite", about: "Sou nou", files: "Dosye",
    addCard: "Ajoute kat", customerService: "CS", adminPanel: "Panel Admin",
    adminPinTitle: "Kòd aksè administratè", adminPinDesc: "Antre kòd PIN ou pou jwenn aksè nan panel admin lan",
    selectLanguage: "Chwazi lang", searchLanguage: "Chèche...",
    teamTitle: "Ekip", myTeam: "Ekip mwen", invitationLink: "Lyen envitasyon", copy: "Kopye", teamDetails: "Detay ekip", share: "Pataje", commissionRate: "Taux komisyon", validUser: "Itilizatè valid", commission: "Komisyon", myRevenues: "Revni mwen", numberOfPeople: "Kantite moun", invitationGift: "Kado envitasyon", viewTeamDetails: "Wè detay ekip mwen", cashbackLevel1Pre: "Lè zanmi ou yo enskri epi envesti, ou resevwa imedyatman", cashbackLevel2Pre: "Lè manm nivo 2 yo envesti, ou resevwa", cashbackLevel3Pre: "Lè manm nivo 3 yo envesti, ou resevwa", ofCashback: "kachbak", codeCopied: "Kòd envitasyon kopye!", linkCopied: "Lyen envitasyon kopye!", linkCopiedInstagram: "Lyen kopye!", linkCopiedInstagramDesc: "Kole l nan bio Instagram ou.", teamHistory: "Istwa ekip", levelLabel: "Nivo", teamMembersLabel: "Manm ekip", teamDepositsLabel: "Depo ekip", noMembersMsg: "Pa gen manm nan nivo", inviteFriendsMsg: "Envite zanmi pou grandi ekip ou", accountLabel: "Kont", dateLabel: "Dat",
  },

  ur: {
    navHome: "ہوم", navProducts: "مصنوعات", navTeam: "ٹیم", navMine: "میرا",
    welcomeTitle: "خوش آمدید",
    welcomeSubtitle: "اپنا سرمایہ کاری سفر شروع کریں",
    phoneLabel: "فون", passwordLabel: "پاس ورڈ",
    forgotPassword: "پاس ورڈ بھول گئے؟",
    loginBtn: "لاگ ان", registerLink: "رجسٹر کریں",
    enterPhone: "براہ کرم اپنا فون نمبر درج کریں",
    enterPassword: "براہ کرم اپنا پاس ورڈ درج کریں",
    verificationCode: "تصدیقی کوڈ", invitationCode: "دعوت نامہ کوڈ",
    loginLink: "لاگ ان؟", registerBtn: "رجسٹر کریں",
    enterPhoneReg: "اپنا فون نمبر درج کریں", enterPasswordReg: "اپنا پاس ورڈ درج کریں",
    enterVerif: "تصدیقی کوڈ درج کریں", enterInvit: "دعوت نامہ کوڈ (اختیاری)",
    accountAssets: "اکاؤنٹ اثاثے", totalRevenue: "کل آمدنی",
    becomePartner: "TREK کے کاروباری شراکت دار بنیں اور اپنے اثاثوں کے لیے ترقی کے مواقع کھولیں۔",
    recharge: "جمع کریں", withdraw: "نکالیں", accountBtn: "اکاؤنٹ",
    myProducts: "میری مصنوعات", whatsapp: "Whatsapp",
    globalPartnerships: "TREK گلوبل پارٹنرشپ",
    partnershipsDesc: "Trek Bicycle Corporation 1976 میں Dick Burke اور Bevil Hogg نے Waterloo، Wisconsin میں قائم کی۔ اعلی کارکردگی والی سائیکلوں کے ڈیزائن میں سرخیل، Trek نے مسلسل جدت اور اسٹریٹجک شراکت داری کے ذریعے عالمی معیار قائم کیا ہے۔",
    ourProducts: "ہماری مصنوعات", investBtn: "سرمایہ کاری کریں",
    perDay: "/ یوم", estimatedTotal: "تخمینی کل", noProducts: "کوئی مصنوعات نہیں",
    insufficientBalance: "ناکافی بیلنس۔ کمی:",
    earning24h: "ہر 24 گھنٹے میں آمدنی ادا کی جاتی ہے",
    cancel: "منسوخ", confirm: "تصدیق",
    price: "قیمت:", dailyRevenue: "یومیہ آمدنی:", estimatedRevenue: "تخمینی آمدنی:", duration: "مدت:", days: "دن",
    purchaseSuccess: "مصنوع خریدا گیا!", purchaseSuccessDesc: "کل سے آمدنی ملنا شروع ہو جائے گی۔",
    marqueeText: "Trek Bicycle Corporation 1976 میں Waterloo، Wisconsin میں قائم ہوئی اور بہتر کارکردگی والی سائیکلیں بنانے کے لیے پرعزم ہے۔ ہمارے ساتھ شامل ہوں اور TREK کے ساتھ اپنی دولت بڑھائیں۔",
    personalCenter: "ذاتی مرکز", signOut: "لاگ آؤٹ",
    balance: "بیلنس", pendingCommerce: "زیر التواء\nتجارت", volume: "حجم",
    deposit: "جمع", withdrawal: "نکاسی",
    security: "سیکیورٹی", about: "بارے میں", files: "فائلیں",
    addCard: "کارڈ شامل کریں", customerService: "CS", adminPanel: "ایڈمن پینل",
    adminPinTitle: "ایڈمن رسائی کوڈ", adminPinDesc: "ایڈمن پینل تک رسائی کے لیے PIN کوڈ درج کریں",
    selectLanguage: "زبان منتخب کریں", searchLanguage: "تلاش کریں...",
    teamTitle: "ٹیم", myTeam: "میری ٹیم", invitationLink: "دعوت لنک", copy: "کاپی", teamDetails: "ٹیم تفصیلات", share: "شیئر کریں", commissionRate: "کمیشن کی شرح", validUser: "درست صارف", commission: "کمیشن", myRevenues: "میری آمدنی", numberOfPeople: "افراد کی تعداد", invitationGift: "دعوت تحفہ", viewTeamDetails: "میری ٹیم کی تفصیلات دیکھیں", cashbackLevel1Pre: "جب آپ کے دوست رجسٹر ہو کر سرمایہ کاری کریں، آپ کو فوری طور پر", cashbackLevel2Pre: "جب لیول 2 کے اراکین سرمایہ کاری کریں، آپ کو", cashbackLevel3Pre: "جب لیول 3 کے اراکین سرمایہ کاری کریں، آپ کو", ofCashback: "کیش بیک ملتا ہے", codeCopied: "دعوت کوڈ کاپی ہو گیا!", linkCopied: "دعوت لنک کاپی ہو گیا!", linkCopiedInstagram: "لنک کاپی ہو گیا!", linkCopiedInstagramDesc: "اسے اپنے Instagram بائیو میں پیسٹ کریں۔", teamHistory: "ٹیم تاریخ", levelLabel: "سطح", teamMembersLabel: "ٹیم اراکین", teamDepositsLabel: "ٹیم جمع", noMembersMsg: "سطح پر کوئی رکن نہیں", inviteFriendsMsg: "اپنی ٹیم بڑھانے کے لیے دوستوں کو مدعو کریں", accountLabel: "اکاؤنٹ", dateLabel: "تاریخ",
  },
};

// ─── Country → language mapping ────────────────────────────────────────────
// Maps ISO 3166-1 alpha-2 country codes to platform language codes.
// Only languages that exist in the translations object are used.
const COUNTRY_TO_LANG: Record<string, string> = {
  // French-speaking
  FR: "fr", BE: "fr", LU: "fr", MC: "fr", CH: "fr",
  TN: "fr", MA: "fr", DZ: "fr",
  SN: "fr", CI: "fr", ML: "fr", BF: "fr", GN: "fr", TG: "fr", BJ: "fr",
  NE: "fr", TD: "fr", CM: "fr", CF: "fr", CG: "fr", CD: "fr", GA: "fr",
  MG: "fr", MU: "fr", SC: "fr", DJ: "fr", KM: "fr",
  // Haitian Creole
  HT: "ht",
  // English-speaking
  US: "en", GB: "en", AU: "en", CA: "en", NZ: "en", IE: "en",
  NG: "en", GH: "en", KE: "en", TZ: "en", ZA: "en", ZW: "en",
  UG: "en", RW: "en", ZM: "en", MW: "en", SL: "en",
  IN: "en", SG: "en", PH: "en", MY: "en",
  // Urdu — Pakistan
  PK: "ur",
  // Arabic
  SA: "ar", AE: "ar", EG: "ar", JO: "ar", IQ: "ar", KW: "ar",
  QA: "ar", BH: "ar", OM: "ar", YE: "ar", LB: "ar", SY: "ar", LY: "ar", SD: "ar",
  // Spanish
  ES: "es", MX: "es", AR: "es", CO: "es", PE: "es", VE: "es", CL: "es",
  EC: "es", BO: "es", PY: "es", UY: "es", CR: "es", PA: "es", DO: "es",
  CU: "es", GT: "es", HN: "es", SV: "es", NI: "es",
  // Portuguese
  BR: "pt", PT: "pt", AO: "pt", MZ: "pt", CV: "pt", GW: "pt", ST: "pt",
  // German
  DE: "de", AT: "de", LI: "de",
  // Russian
  RU: "ru", BY: "ru", KZ: "ru",
  // Vietnamese
  VN: "vi",
  // Turkish
  TR: "tr",
  // Indonesian
  ID: "id",
  // Italian
  IT: "it", SM: "it",
  // Japanese
  JP: "ja",
  // Korean
  KR: "ko",
  // Greek
  GR: "el", CY: "el",
  // Persian
  IR: "fa", AF: "fa",
};

/** Returns the best available platform language for the browser's locale. */
function detectLangFromBrowser(): string {
  try {
    const codes = navigator.languages?.length ? navigator.languages : [navigator.language];
    for (const raw of codes) {
      const base = raw.split("-")[0].toLowerCase();
      if (translations[base]) return base;
    }
  } catch {}
  return "fr";
}

// ─── Context ───────────────────────────────────────────────────────────────
const STORAGE_KEY = "trek_lang";
const MANUAL_KEY  = "trek_lang_manual"; // "true" when user explicitly chose a language

interface LanguageContextType {
  lang: string;
  /** Called when user manually picks a language. Persists the choice. */
  setLang: (code: string) => void;
  /** Called automatically with the user's country code. Ignored if the user
   *  already made a manual choice. */
  autoDetect: (countryCode: string) => void;
  t: (key: string) => string;
  dir: "ltr" | "rtl";
  currentLanguage: Language;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "fr",
  setLang: () => {},
  autoDetect: () => {},
  t: (k) => k,
  dir: "ltr",
  currentLanguage: LANGUAGES[0],
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<string>(() => {
    try {
      const isManual = localStorage.getItem(MANUAL_KEY) === "true";
      if (isManual) {
        return localStorage.getItem(STORAGE_KEY) || "fr";
      }
      // No manual choice yet — detect from browser
      return detectLangFromBrowser();
    } catch {
      return "fr";
    }
  });

  /** Explicit user choice — persists and marks as manual. */
  const setLang = useCallback((code: string) => {
    setLangState(code);
    try {
      localStorage.setItem(STORAGE_KEY, code);
      localStorage.setItem(MANUAL_KEY, "true");
    } catch {}
  }, []);

  /** Auto-detect from the logged-in user's country.
   *  Only applies when the user has never manually chosen a language. */
  const autoDetect = useCallback((countryCode: string) => {
    try {
      if (localStorage.getItem(MANUAL_KEY) === "true") return;
      const detected = COUNTRY_TO_LANG[countryCode.toUpperCase()];
      if (detected && translations[detected]) {
        setLangState(detected);
        try { localStorage.setItem(STORAGE_KEY, detected); } catch {}
      }
    } catch {}
  }, []);

  const t = useCallback((key: string): string => {
    const map = translations[lang] || translations["fr"];
    return map[key] ?? (translations["fr"][key] ?? key);
  }, [lang]);

  const currentLanguage = LANGUAGES.find(l => l.code === lang) || LANGUAGES[0];
  const dir = currentLanguage.dir || "ltr";

  // Apply dir + lang attributes to <html> so CSS and screen-readers work
  useEffect(() => {
    document.documentElement.setAttribute("dir", dir);
    document.documentElement.setAttribute("lang", lang);
  }, [dir, lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, autoDetect, t, dir, currentLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}

// Shorthand alias
export function useT() {
  return useContext(LanguageContext).t;
}
