// Generates public/privacy.html and public/terms.html (EN / RU / KY in one page each).
// Edit the text below, then run: node scripts/make-legal-pages.mjs
import fs from 'fs';

const UPDATED = { en: '21 October 2026', ru: '21 октября 2026 г.', ky: '2026-жылдын 21-октябрына' };
const ISSUES = 'https://github.com/aiyma-a/brewmap/issues';
const GOOGLE_PP = 'https://policies.google.com/privacy';

const UI = {
  en: { back: '← Back to Brewmap', updated: 'Last updated', privacy: 'Privacy Policy', terms: 'Terms of Service', other: 'Terms of Service', contact: 'Contact', contactText: `Questions or requests: open an issue at <a href="${ISSUES}">github.com/aiyma-a/brewmap/issues</a>.` },
  ru: { back: '← Назад в Brewmap', updated: 'Обновлено', privacy: 'Политика конфиденциальности', terms: 'Условия использования', other: 'Условия использования', contact: 'Контакты', contactText: `Вопросы и запросы: создайте обращение на <a href="${ISSUES}">github.com/aiyma-a/brewmap/issues</a>.` },
  ky: { back: '← Brewmap’ка кайтуу', updated: 'Жаңыртылган', privacy: 'Купуялуулук саясаты', terms: 'Колдонуу шарттары', other: 'Колдонуу шарттары', contact: 'Байланыш', contactText: `Суроолор жана өтүнүчтөр: <a href="${ISSUES}">github.com/aiyma-a/brewmap/issues</a> дарегине кайрылыңыз.` },
};

const privacy = {
  en: [
    ['', '<p>Brewmap helps you find coffee shops near you in Kyrgyzstan. This page explains what information the app uses and where it goes.</p>'],
    ['What stays on your device', '<p>Your display name, username, saved coffee shops, reviews, language and light/dark choice are stored in your own browser (local storage). If you clear your browser data, or use "Delete account" in Settings, this local information is removed.</p>'],
    ['Accounts', `<p>You can use Brewmap without an account. If you create one (with email and password, or with Google), your email address, display name and sign-in details are stored by Google Firebase Authentication (Google Cloud). Passwords are stored by Google in protected form; Brewmap never sees them. If you use Google sign-in, Google shares your name and email with us. We use your email only to sign you in and to send confirmation and password-reset messages. Accounts are handled under the <a href="${GOOGLE_PP}">Google Privacy Policy</a>. To delete your account, open an issue (see Contact); an in-app option is planned.</p>`],
    ['"How busy is it?" reports', `<p>If you tap Quiet, Moderate or Packed on a coffee shop, Brewmap stores that report in Google Firebase (Google Cloud, Europe): the shop, your answer, the time, and a random anonymous ID that Firebase gives your browser. No name, email or location is attached. Reports are visible to everyone using the app and are used to show how busy a shop is. The anonymous ID lets us limit each visitor to one report per shop per hour; it is not linked to your profile. Google handles this data under the <a href="${GOOGLE_PP}">Google Privacy Policy</a>. To have your reports removed, open an issue (see Contact) and include the shop and time.</p>`],
    ['Location', '<p>If you allow it, your browser shares your location with the app so the map can centre on you and show distances. Your location is not stored by Brewmap. To find nearby coffee shops, the area you are looking at on the map is sent to Google (see below). You can refuse or withdraw location permission in your browser settings; the app then opens on Bishkek.</p>'],
    ['Google Maps and Places', `<p>Maps, coffee shop listings, photos, ratings and opening hours come from Google Maps Platform. When you use them, your browser contacts Google and sends your search text and map area. Google handles this under the <a href="${GOOGLE_PP}">Google Privacy Policy</a>.</p>`],
    ['Hosting', '<p>The site is hosted on GitHub Pages. GitHub may log technical information such as your IP address when you visit, under the <a href="https://docs.github.com/site-policy/privacy-policies/github-general-privacy-statement">GitHub Privacy Statement</a>.</p>'],
    ['What we do not do', '<p>We do not currently use advertising, analytics or tracking cookies, and we do not sell or share your information. If we add error tracking or accounts stored on a server, we will update this page first.</p>'],
    ['Children', '<p>Brewmap is not directed at children under 13.</p>'],
    ['Changes', '<p>We may update this policy. The date at the top shows the latest version.</p>'],
  ],
  ru: [
    ['', '<p>Brewmap помогает найти кофейни рядом с вами в Кыргызстане. На этой странице объясняется, какие данные использует приложение и куда они попадают.</p>'],
    ['Что остаётся на вашем устройстве', '<p>Отображаемое имя, имя пользователя, сохранённые кофейни, отзывы, язык и выбор светлой/тёмной темы хранятся в вашем браузере (локальное хранилище). Эти локальные данные удаляются, если вы очистите данные браузера или нажмёте «Удалить аккаунт» в настройках.</p>'],
    ['Аккаунты', `<p>Brewmap можно использовать без аккаунта. Если вы создадите аккаунт (по email и паролю или через Google), ваш адрес email, отображаемое имя и данные для входа хранятся в Google Firebase Authentication (Google Cloud). Пароли хранятся у Google в защищённом виде; Brewmap их не видит. При входе через Google мы получаем от Google ваше имя и email. Email используется только для входа и для отправки писем с подтверждением и сбросом пароля. Аккаунты обрабатываются в соответствии с <a href="${GOOGLE_PP}">Политикой конфиденциальности Google</a>. Чтобы удалить аккаунт, создайте обращение (см. «Контакты»); функция удаления в приложении планируется.</p>`],
    ['Отчёты «Насколько людно?»', `<p>Если вы нажмёте «Тихо», «Средне» или «Много людей» в карточке кофейни, Brewmap сохранит этот отчёт в Google Firebase (Google Cloud, Европа): кофейню, ваш ответ, время и случайный анонимный идентификатор, который Firebase присваивает вашему браузеру. Имя, email и местоположение не прикрепляются. Отчёты видны всем пользователям приложения и нужны, чтобы показывать загруженность кофейни. Анонимный идентификатор позволяет ограничить каждого посетителя одним отчётом на кофейню в час; он не связан с вашим профилем. Google обрабатывает эти данные в соответствии с <a href="${GOOGLE_PP}">Политикой конфиденциальности Google</a>. Чтобы удалить ваши отчёты, создайте обращение (см. «Контакты») и укажите кофейню и время.</p>`],
    ['Местоположение', '<p>Если вы разрешите, браузер передаёт приложению ваше местоположение, чтобы карта открывалась на вас и показывала расстояния. Brewmap не хранит ваше местоположение. Чтобы найти ближайшие кофейни, область карты, которую вы смотрите, отправляется в Google (см. ниже). Вы можете отказать или отозвать разрешение в настройках браузера; тогда приложение откроется на Бишкеке.</p>'],
    ['Google Maps и Places', `<p>Карты, список кофеен, фотографии, оценки и часы работы предоставляет Google Maps Platform. При их использовании ваш браузер обращается к Google и отправляет текст поиска и область карты. Google обрабатывает эти данные в соответствии с <a href="${GOOGLE_PP}">Политикой конфиденциальности Google</a>.</p>`],
    ['Хостинг', '<p>Сайт размещён на GitHub Pages. GitHub может записывать технические данные, например ваш IP-адрес, при посещении сайта — см. <a href="https://docs.github.com/site-policy/privacy-policies/github-general-privacy-statement">Заявление GitHub о конфиденциальности</a>.</p>'],
    ['Чего мы не делаем', '<p>Сейчас мы не используем рекламу, аналитику и отслеживающие cookie, а также не продаём и не передаём ваши данные. Если мы добавим отслеживание ошибок или аккаунты с хранением на сервере, мы сначала обновим эту страницу.</p>'],
    ['Дети', '<p>Brewmap не предназначен для детей младше 13 лет.</p>'],
    ['Изменения', '<p>Мы можем обновлять эту политику. Дата вверху страницы показывает последнюю версию.</p>'],
  ],
  ky: [
    ['', '<p>Brewmap Кыргызстандагы жакын жердеги кофейняларды табууга жардам берет. Бул бетте колдонмо кандай маалыматты колдонорун жана ал кайда барарын түшүндүрөбүз.</p>'],
    ['Түзмөгүңүздө эмне калат', '<p>Көрүнүүчү атыңыз, колдонуучу атыңыз, сакталган кофейняларыңыз, пикирлериңиз, тил жана жарык/караңгы тема тандооңуз браузериңизде (локалдык сактагычта) сакталат. Браузердин маалыматын тазаласаңыз же жөндөөлөрдөн «Аккаунтту өчүрүү» басканыңызда бул локалдык маалымат өчүрүлөт.</p>'],
    ['Аккаунттар', `<p>Brewmap\u2019ты аккаунтсуз колдонсо болот. Аккаунт түзсөңүз (email жана сырсөз менен же Google аркылуу), email дарегиңиз, көрүнүүчү атыңыз жана кирүү маалыматтарыңыз Google Firebase Authentication\u2019до (Google Cloud) сакталат. Сырсөздөр Google\u2019да корголгон түрдө сакталат; Brewmap аларды көрбөйт. Google аркылуу кирсеңиз, Google биз менен атыңызды жана email\u2019иңизди бөлүшөт. Email\u2019ди кирүү үчүн жана ырастоо же сырсөздү калыбына келтирүү каттарын жөнөтүү үчүн гана колдонобуз. Аккаунттар <a href="${GOOGLE_PP}">Google Купуялуулук саясатына</a> ылайык иштетилет. Аккаунтту өчүрүү үчүн кайрылуу түзүңүз («Байланыш» бөлүмүн караңыз); колдонмодо өчүрүү мүмкүнчүлүгү пландалган.</p>`],
    ['«Элдүүбү?» билдирүүлөрү', `<p>Кофейнянын картасында «Тынч», «Орточо» же «Толуп калган» дегенди басканыңызда, Brewmap бул билдирүүнү Google Firebase’де (Google Cloud, Европа) сактайт: кофейняны, жообуңузду, убакытты жана Firebase браузериңизге берген кокус аноним идентификаторду. Аты, email же жайгашкан жери кошулбайт. Билдирүүлөрдү колдонмонун бардык колдонуучулары көрөт, алар кофейнянын канчалык элдүү экенин көрсөтүү үчүн колдонулат. Аноним идентификатор ар бир келүүчүнү бир кофейняга саатына бир билдирүү менен чектөөгө мүмкүндүк берет; ал профилиңизге байланышпайт. Google бул маалыматты <a href="${GOOGLE_PP}">Google Купуялуулук саясатына</a> ылайык иштетет. Билдирүүлөрүңүздү өчүрүү үчүн кайрылуу түзүп («Байланыш» бөлүмүн караңыз), кофейняны жана убакытты жазыңыз.</p>`],
    ['Жайгашкан жер', '<p>Уруксат берсеңиз, браузер жайгашкан жериңизди колдонмого өткөрөт, ошондо карта сизге багытталып, аралыктарды көрсөтөт. Brewmap жайгашкан жериңизди сактабайт. Жакын жердеги кофейняларды табуу үчүн картада карап жаткан аймагыңыз Google’га жөнөтүлөт (төмөндү караңыз). Уруксатты браузердин жөндөөлөрүнөн четке кагып же артка ала аласыз; ошондо колдонмо Бишкектен ачылат.</p>'],
    ['Google Maps жана Places', `<p>Карталар, кофейнялардын тизмеси, сүрөттөр, баалар жана иштөө сааттары Google Maps Platform’тан келет. Аларды колдонгондо браузериңиз Google’га кайрылып, издөө текстин жана карта аймагын жөнөтөт. Google муну <a href="${GOOGLE_PP}">Google Купуялуулук саясатына</a> ылайык иштетет.</p>`],
    ['Хостинг', '<p>Сайт GitHub Pages’те жайгашкан. GitHub сайтка киргениңизде IP дарек сыяктуу техникалык маалыматты жазып алышы мүмкүн — <a href="https://docs.github.com/site-policy/privacy-policies/github-general-privacy-statement">GitHub купуялуулук билдирүүсүн</a> караңыз.</p>'],
    ['Биз эмнени кылбайбыз', '<p>Азырынча биз жарнама, аналитика жана көзөмөлдөөчү cookie колдонбойбуз, маалыматыңызды сатпайбыз жана бербейбиз. Каталарды көзөмөлдөөнү же серверде сакталган аккаунттарды кошсок, адегенде ушул бетти жаңыртабыз.</p>'],
    ['Балдар', '<p>Brewmap 13 жашка чейинки балдарга арналган эмес.</p>'],
    ['Өзгөртүүлөр', '<p>Бул саясатты жаңыртышыбыз мүмкүн. Беттин башындагы дата акыркы версияны көрсөтөт.</p>'],
  ],
};

const terms = {
  en: [
    ['', '<p>By using Brewmap you agree to these terms.</p>'],
    ['What Brewmap is', '<p>Brewmap is a free guide to coffee shops in Kyrgyzstan. Shop details such as opening hours, ratings and photos come from Google and from sample data and may be wrong or out of date. Check with the shop before you travel.</p>'],
    ['Your use', '<p>Be honest and respectful. Do not post spam, advertising, illegal or abusive content, and do not try to break or misuse the app or its Google Maps access. Reviews and busy reports you submit are your responsibility; please report only what you see. Busy reports come from other visitors and may be wrong.</p>'],
    ['Third-party services', '<p>Use of the map is also subject to the <a href="https://cloud.google.com/maps-platform/terms">Google Maps Platform Terms of Service</a>.</p>'],
    ['No warranty', '<p>Brewmap is provided "as is", without promises that it will always be available or error-free. To the extent the law allows, we are not liable for losses from using it, including from wrong shop information or closed shops.</p>'],
    ['Changes', '<p>We may change the app or these terms. Continuing to use Brewmap after a change means you accept it.</p>'],
  ],
  ru: [
    ['', '<p>Используя Brewmap, вы соглашаетесь с этими условиями.</p>'],
    ['Что такое Brewmap', '<p>Brewmap — бесплатный путеводитель по кофейням Кыргызстана. Сведения о кофейнях (часы работы, оценки, фотографии) поступают от Google и из демонстрационных данных и могут быть неточными или устаревшими. Уточняйте у кофейни перед поездкой.</p>'],
    ['Правила использования', '<p>Будьте честными и уважительными. Не публикуйте спам, рекламу, незаконный или оскорбительный контент и не пытайтесь нарушить работу приложения или его доступа к Google Maps. За отзывы и отчёты о загруженности, которые вы отправляете, отвечаете вы; сообщайте только то, что видите сами. Отчёты о загруженности поступают от других посетителей и могут быть неверными.</p>'],
    ['Сторонние сервисы', '<p>Использование карты также регулируется <a href="https://cloud.google.com/maps-platform/terms">Условиями использования Google Maps Platform</a>.</p>'],
    ['Отсутствие гарантий', '<p>Brewmap предоставляется «как есть», без обещаний бесперебойной и безошибочной работы. В пределах, допускаемых законом, мы не несём ответственности за убытки от использования приложения, в том числе из-за неверных сведений о кофейнях или закрытых заведений.</p>'],
    ['Изменения', '<p>Мы можем изменять приложение и эти условия. Продолжая пользоваться Brewmap после изменений, вы принимаете их.</p>'],
  ],
  ky: [
    ['', '<p>Brewmap’ты колдонуу менен сиз бул шарттарга макул болосуз.</p>'],
    ['Brewmap деген эмне', '<p>Brewmap — Кыргызстандагы кофейнялар боюнча акысыз жолбашчы. Кофейнялар жөнүндө маалымат (иштөө саатары, баалар, сүрөттөр) Google’дан жана үлгү маалыматтардан келет жана так эмес же эскирген болушу мүмкүн. Сапарга чыгаардан мурун кофейнядан тактап алыңыз.</p>'],
    ['Колдонуу эрежелери', '<p>Чынчыл жана сыпайы болуңуз. Спам, жарнама, мыйзамсыз же мазактоочу мазмун жарыялабаңыз, колдонмонун же анын Google Maps мүмкүнчүлүгүнүн иштешин бузууга аракет кылбаңыз. Жөнөткөн пикирлериңиз жана элдүүлүк билдирүүлөрүңүз үчүн өзүңүз жооптуусуз; өзүңүз көргөндү гана билдириңиз. Элдүүлүк билдирүүлөрү башка келүүчүлөрдөн келет жана туура эмес болушу мүмкүн.</p>'],
    ['Үчүнчү тараптын кызматтары', '<p>Картаны колдонууга <a href="https://cloud.google.com/maps-platform/terms">Google Maps Platform колдонуу шарттары</a> да колдонулат.</p>'],
    ['Кепилдиксиз', '<p>Brewmap «кандай болсо ошондой» берилет, ар дайым иштейт же катасыз болот деген убада жок. Мыйзам уруксат берген чекте, колдонмону колдонуудан келип чыккан зыяндар, анын ичинде кофейнялар жөнүндө туура эмес маалымат же жабык жайлар үчүн биз жооп бербейбиз.</p>'],
    ['Өзгөртүүлөр', '<p>Колдонмону жана бул шарттарды өзгөртүшүбүз мүмкүн. Өзгөртүүдөн кийин Brewmap’ты колдонууну улантсаңыз, аны кабыл алгандыгыңызды билдирет.</p>'],
  ],
};

const css = `*{box-sizing:border-box}body{margin:0;font:17px/1.65 system-ui,sans-serif;background:#F5EFE6;color:#2B211C}
main{max-width:720px;margin:0 auto;padding:28px 20px 60px}h1{font-size:28px;margin:.2em 0}h2{font-size:19px;margin:1.6em 0 .3em;color:#8A5A3C}
a{color:#8A5A3C}.meta{color:#5E4F46;font-size:14px}.top{display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;margin-bottom:12px}
.top a{text-decoration:none}.langs{display:flex;gap:6px}.langs button{font:inherit;font-size:14px;min-height:44px;min-width:44px;padding:0 12px;border-radius:999px;border:1px solid #8A5A3C;background:transparent;color:#8A5A3C;cursor:pointer}
.langs button[aria-pressed="true"]{background:#8A5A3C;color:#fff}[lang-block]{display:none}[lang-block].on{display:block}
footer{margin-top:2.5em;padding-top:1em;border-top:1px solid #8A5A3C33;font-size:15px}
@media(prefers-color-scheme:dark){body{background:#1E1B19;color:#EDE3D8}h2,a{color:#D9A066}.meta{color:#C9BBAE}.langs button{border-color:#D9A066;color:#D9A066}.langs button[aria-pressed="true"]{background:#D9A066;color:#1E1B19}footer{border-color:#D9A06633}}`;

const script = `(function(){var L=['en','ru','ky'],q=new URLSearchParams(location.search).get('lang'),s=null;try{s=localStorage.getItem('app_language')}catch(e){}
var nav=(navigator.language||'en').slice(0,2),lang=[q,s,nav].find(function(x){return L.indexOf(x)>-1})||'en';
function set(l){document.documentElement.lang=l;document.querySelectorAll('[lang-block]').forEach(function(b){b.classList.toggle('on',b.getAttribute('lang-block')===l)});
document.querySelectorAll('.langs button').forEach(function(b){b.setAttribute('aria-pressed',String(b.dataset.l===l))});var t=document.getElementById('t-'+l);if(t)document.title=t.textContent}
document.querySelectorAll('.langs button').forEach(function(b){b.addEventListener('click',function(){set(b.dataset.l)})});set(lang)})();`;

function page(kind, data) {
  const other = kind === 'privacy' ? 'terms' : 'privacy';
  const blocks = ['en', 'ru', 'ky'].map(l => {
    const ui = UI[l];
    const title = kind === 'privacy' ? ui.privacy : ui.terms;
    const otherTitle = kind === 'privacy' ? ui.terms : ui.privacy;
    const body = data[l].map(([h, html]) => (h ? `<h2>${h}</h2>` : '') + html).join('\n');
    return `<div lang-block="${l}" lang="${l}"><h1>${title}</h1><p class="meta">${ui.updated}: ${UPDATED[l]}</p>
${body}
<h2>${ui.contact}</h2><p>${ui.contactText}</p>
<footer><a href="${other}.html">${otherTitle}</a> · <a href="./">${ui.back}</a></footer></div><span id="t-${l}" hidden>${title} · Brewmap</span>`;
  }).join('\n');
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${kind === 'privacy' ? 'Privacy Policy' : 'Terms of Service'} · Brewmap</title><meta name="robots" content="index"><style>${css}</style></head><body><main>
<div class="top"><a href="./">${UI.en.back}</a><div class="langs" role="group" aria-label="Language"><button data-l="en">EN</button><button data-l="ru">РУ</button><button data-l="ky">КЫР</button></div></div>
${blocks}
</main><script>${script}</script></body></html>`;
}

fs.writeFileSync('public/privacy.html', page('privacy', privacy));
fs.writeFileSync('public/terms.html', page('terms', terms));
console.log('wrote public/privacy.html and public/terms.html');
