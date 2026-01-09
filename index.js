document.addEventListener('DOMContentLoaded', function () {
    const trackingInput = document.getElementById('trackingInput');
    const courierItems = document.querySelectorAll('.courier-item');
    const mainTrackBtn = document.getElementById('mainTrackBtn');

    let selectedCourierUrl = null;

    // ฟังก์ชันเมื่อคลิกเลือกขนส่ง
    courierItems.forEach(item => {
        item.addEventListener('click', function () {
            // ลบ class 'selected' ออกจากตัวอื่นทั้งหมด
            courierItems.forEach(i => i.classList.remove('selected'));

            // เพิ่ม class 'selected' ให้ตัวที่คลิก
            this.classList.add('selected');

            // เก็บ URL ของขนส่งที่เลือกไว้ในตัวแปร
            selectedCourierUrl = this.getAttribute('data-url');

            // เปิดใช้งานปุ่มถ้ามีการเลือกขนส่งแล้ว
            checkButtonState();
        });
    });

    // ฟังก์ชันตรวจสอบ Input เพื่อเปิด/ปิดปุ่ม
    if (trackingInput) trackingInput.addEventListener('input', checkButtonState);

    function checkButtonState() {
        // ปุ่มจะกดได้ก็ต่อเมื่อ 1.เลือกขนส่งแล้ว และ 2.ช่อง input ไม่ว่าง
        if (selectedCourierUrl && trackingInput && trackingInput.value.trim() !== "") {
            mainTrackBtn.disabled = false;
        } else {
            mainTrackBtn.disabled = true;
        }
    }

    // ฟังก์ชันเมื่อกดปุ่มค้นหา
    if (mainTrackBtn) mainTrackBtn.addEventListener('click', function () {
        const trackingNumber = trackingInput.value.trim();

        if (!trackingNumber || !selectedCourierUrl) {
            alert("กรุณากรอกเลขพัสดุและเลือกผู้ให้บริการขนส่ง");
            return;
        }

        // สร้าง URL ปลายทางโดยเอา URL ขนส่ง + เลขพัสดุ
        // encodeURIComponent ใช้เพื่อป้องกันอักขระพิเศษในเลขพัสดุทำให้ URL พัง
        const finalUrl = selectedCourierUrl + encodeURIComponent(trackingNumber);

        // เปิดหน้าต่างใหม่ไปยัง URL นั้น
        window.open(finalUrl, '_blank');
        // หรือถ้าอยากให้เปิดในหน้าเดิมให้ใช้: window.location.href = finalUrl;
    });

    // Initialize language from localStorage or default to Thai
    const initialLang = localStorage.getItem('lang') || 'th';
    setLanguage(initialLang);

    // --- Visitor Counter Logic (uses api.counterapi.dev) ---
    (function initVisitorCounter() {
        const visitorCountElement = document.getElementById('visitorCount');
        if (!visitorCountElement) return;

        const NAMESPACE = 'express-center-main';
        const KEY = 'visits';
        const DAY_KEY = 'express_center_last_visit_date';

        function setDisplay(value) {
            visitorCountElement.innerText = (typeof value === 'number') ? value.toLocaleString() : '—';
        }

        async function getCount() {
            try {
                const res = await fetch(`https://api.counterapi.dev/v1/${NAMESPACE}/${KEY}/`);
                if (!res.ok) throw new Error('Failed to fetch count');
                const data = await res.json();
                return (data && typeof data.count === 'number') ? data.count : 0;
            } catch (e) {
                console.error('Visitor Counter (get) error:', e);
                return null;
            }
        }

        async function hitCount() {
            try {
                const res = await fetch(`https://api.counterapi.dev/v1/${NAMESPACE}/${KEY}/up`);
                if (!res.ok) throw new Error('Failed to increment count');
                const data = await res.json();
                return (data && typeof data.count === 'number') ? data.count : null;
            } catch (e) {
                console.error('Visitor Counter (hit) error:', e);
                return null;
            }
        }

        (async function () {
            setDisplay('...');
            const today = new Date().toISOString().slice(0, 10);
            const lastVisit = localStorage.getItem(DAY_KEY);

            if (lastVisit !== today) {
                const newCount = await hitCount();
                if (newCount !== null) {
                    setDisplay(newCount);
                    localStorage.setItem(DAY_KEY, today);
                } else {
                    const current = await getCount();
                    setDisplay(current);
                }
            } else {
                const current = await getCount();
                setDisplay(current);
            }
        })();
    })();
});
document.addEventListener('DOMContentLoaded', function () {
    const termsToggle = document.getElementById('termsToggle');
    const termsMenu = document.getElementById('termsMenu');
    if (!termsToggle || !termsMenu) return;

    function closeMenu() {
        termsToggle.setAttribute('aria-expanded', 'false');
        termsMenu.style.display = '';
        termsToggle.parentElement.classList.remove('open');
    }

    termsToggle.addEventListener('click', function (e) {
        // Toggle menu display (works on mobile). On desktop hover handles it via CSS.
        const expanded = this.getAttribute('aria-expanded') === 'true';
        this.setAttribute('aria-expanded', String(!expanded));
        if (!expanded) {
            termsMenu.style.display = 'block';
            this.parentElement.classList.add('open');
        } else {
            closeMenu();
        }
        e.stopPropagation();
    });

    // Close when clicking outside
    document.addEventListener('click', function (e) {
        if (!termsToggle.parentElement.contains(e.target)) {
            closeMenu();
        }
    });

    // Close on Escape
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') closeMenu();
    });
});

// Translations map for UI strings
const translations = {
    th: {
        'meta.title': 'Express Center - ศูนย์รวมบริการขนส่งครบวงจร',
        'nav.home': 'หน้าแรก',
        'nav.services': 'บริการของเรา',
        'nav.features': 'จุดเด่น',
        'nav.contact': 'ติดต่อเรา',
        'nav.about': 'เกี่ยวกับเรา',
        'nav.terms': 'เงื่อนไขและข้อกำหนด',
        'hero.title': 'ศูนย์รวมบริการขนส่งครบวงจร     พร้อมดูแลพัสดุของคุณทุกขั้นตอน',
        'hero.desc': 'ศูนย์รวมบริการขนส่งครบวงจร พร้อมดูแลและประสานงานทุกขั้นตอน',
        'tracking.placeholder': 'กรุณากรอกเลขพัสดุของคุณที่นี่... (เช่น TH123456789)',
        'tracking.courierTitle': 'เลือกผู้ให้บริการขนส่ง (จำเป็น):',
        'tracking.button': 'ค้นหาพัสดุ',
        'direction.link': 'ขอเส้นทาง',
        'dropdown.privacy': 'นโยบายความเป็นส่วนตัว',
        'services.title': 'บริการของเรา',
        'services.desc': 'ตอบโจทย์ทุกความต้องการด้านการขนส่ง',
        'service.road.title': 'ขนส่งทางบกทั่วไทย',
        'service.road.desc': 'บริการ ส่งสินค้าทั่วทุกภาคของประเทศไทย รวดเร็ว ตรงเวลา',
        'service.air.title': 'ขนส่งระหว่างในประเทศ Cargo',
        'service.air.desc': 'บริการนำเข้า-ส่งออกทางอากาศ พร้อมบริการด้านพิธีการศุลกากร',
        'service.warehouse.title': 'ทางร้าน มีบริการแพ็คกิ้งและ อุปกรณ์ต่างๆ',
        'service.warehouse.desc': 'บริการจัดเก็บ แพ็ค และนำส่งสินค้า ด้วยระบบจัดการสินค้าที่ทันสมัย',
        'features.title': 'ทำไมต้องเลือกเรา',
        'feature.speed.title': 'รวดเร็ว ตรงเวลา',
        'feature.speed.desc': 'เราให้ความสำคัญกับเวลาของคุณ ด้วยการบริหารจัดการเส้นทางที่มีประสิทธิภาพ',
        'feature.safe.title': 'ปลอดภัยสูงสุด',
        'feature.safe.desc': 'มั่นใจได้ด้วยระบบติดตาม GPS และประกันสินค้าเสียหาย',
        'feature.support.title': 'บริการลูกค้า ในทุกขั้นตอน',
        'feature.support.desc': 'มีทีมงานซัพพอร์ตพร้อมช่วยเหลือและตอบคำถามของคุณตลอดเวลา',
        'packing.title': 'วิธีแพ็คพัสดุอย่างปลอดภัย',
        'packing.desc': '4 ขั้นตอนง่ายๆ เพื่อให้พัสดุของคุณถึงปลายทางอย่างปลอดภัย',
        'packing.step1.title': 'เลือกกล่องที่เหมาะสม',
        'packing.step1.desc': 'ใช้กล่องที่แข็งแรงและขนาดพอดีกับสินค้า ไม่ควรเหลือที่ว่างมากเกินไป',
        'packing.step2.title': 'ห่อหุ้มกันกระแทก',
        'packing.step2.desc': 'ห่อสินค้าด้วยบับเบิ้ลหรือวัสดุกันกระแทก โดยเฉพาะสินค้าแตกหักง่าย',
        'packing.step3.title': 'ปิดกล่องให้แน่นหนา',
        'packing.step3.desc': 'ปิดผนึกกล่องด้วยเทปกาวคุณภาพดี แปะให้เป็นรูปตัว H ทั้งด้านบนและล่าง',
        'packing.step4.title': 'จ่าหน้าชัดเจน',
        'packing.step4.desc': 'เขียนชื่อ-ที่อยู่ ผู้รับและผู้ส่งให้ชัดเจน พร้อมเบอร์โทรศัพท์ที่ติดต่อได้',
        'cta.title': 'พร้อมเริ่มส่งของกับเราหรือยัง?',
        'cta.desc': '',
        'cta.button': 'แอดไลน์สอบถามราคาแต่ละขนส่ง',
        'footer.visitors': 'ผู้เข้าชม:',
        'visitors.label': 'ผู้เข้าชมเว็บไซต์:',
        'disclaimer.logo': '“โลโก้เป็นเครื่องหมายการค้าของแต่ละบริษัท ใช้เพื่อการอ้างอิงเท่านั้น”',
        'disclaimer.owner': 'เว็บไซต์นี้เป็นศูนย์รวมบริการขนส่ง ไม่ได้เป็นเจ้าของหรือดำเนินงานโดยบริษัทขนส่งใดโดยตรง',
        'disclaimer.purpose': 'เว็บไซต์นี้ ทำมาเพื่อ อำนวยความสะดวกให้ลูกค้าเช็คเลขพัสดุ เท่านั้น.'
    },
    en: {
        'meta.title': 'Express Center - One-stop logistics services',
        'nav.home': 'Home',
        'nav.services': 'Services',
        'nav.features': 'Features',
        'nav.contact': 'Contact',
        'nav.about': 'About Us',
        'nav.terms': 'Terms & Conditions',
        'hero.title': 'One-stop logistics — we care for your packages every step of the way',
        'hero.desc': 'A one-stop logistics hub providing care and coordination at every step.',
        'tracking.placeholder': 'Enter your tracking number here... (e.g. TH123456789)',
        'tracking.courierTitle': 'Choose a courier (required):',
        'tracking.button': 'Track Package',
        'direction.link': 'Get directions',
        'dropdown.terms': 'Terms & Conditions',
        'dropdown.privacy': 'Privacy Policy',
        'services.title': 'Our Services',
        'services.desc': 'Solutions for all your shipping needs',
        'service.road.title': 'Domestic Road Transport',
        'service.road.desc': 'Delivering goods nationwide quickly and on time',
        'service.air.title': 'Domestic Cargo Air Transport',
        'service.air.desc': 'Import-export air services with customs support',
        'service.warehouse.title': 'Packing & Fulfillment',
        'service.warehouse.desc': 'Storage, packing and delivery with modern inventory management systems',
        'features.title': 'Why Choose Us',
        'feature.speed.title': 'Fast & On-time',
        'feature.speed.desc': 'We prioritize your time with efficient route management',
        'feature.safe.title': 'Maximum Security',
        'feature.safe.desc': '',
        'feature.support.title': 'Customer Support',
        'feature.support.desc': 'Our support team is ready to help and answer your questions',
        'cta.title': 'Ready to ship with us?',
        'cta.desc': 'Request a quote or consult our experts for free',
        'cta.button': 'Request a Quote',
        'footer.visitors': 'Visitors:',
        'visitors.label': 'Website visitors:',
        'disclaimer.logo': '"Logos are trademarks of their respective companies and are used for reference only."',
        'disclaimer.owner': 'This website aggregates shipping services and is not owned or operated by any carrier.',
        'disclaimer.purpose': 'This site is provided to help customers check tracking numbers only.'
    }
};

function setLanguage(lang) {
    // 1. Update body classes without overwriting other classes
    document.body.classList.remove('lang-th', 'lang-en');
    document.body.classList.add('lang-' + lang);

    // 2. Update html lang attribute
    document.documentElement.lang = lang;

    // 3. Update active buttons
    const btnTh = document.getElementById('btn-th');
    const btnEn = document.getElementById('btn-en');
    if (btnTh) btnTh.classList.toggle('active', lang === 'th');
    if (btnEn) btnEn.classList.toggle('active', lang === 'en');

    // 4. Update all translatable elements
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        const value = translations[lang] && translations[lang][key];
        if (value !== undefined) {
            el.innerText = value;
        }
    });

    // 5. Update placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        const value = translations[lang] && translations[lang][key];
        if (value !== undefined) el.placeholder = value;
    });

    // 6. Update document title if available
    if (translations[lang] && translations[lang]['meta.title']) {
        document.title = translations[lang]['meta.title'];
    }

    // persist
    try { localStorage.setItem('lang', lang); } catch (e) { }
}

// make available to inline onclick handlers
// make available to inline onclick handlers
window.setLanguage = setLanguage;

// --- Hero Slider Logic ---
document.addEventListener('DOMContentLoaded', function () {
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');
    const dotsContainer = document.querySelector('.dots-container');
    let currentSlide = 0;
    const slideInterval = 5000; // 5 seconds
    let slideTimer;

    if (slides.length > 0) {
        // Create dots if container exists
        if (dotsContainer) {
            slides.forEach((_, index) => {
                const dot = document.createElement('div');
                dot.classList.add('dot');
                if (index === 0) dot.classList.add('active');
                dot.addEventListener('click', () => {
                    showSlide(index);
                    resetTimer();
                });
                dotsContainer.appendChild(dot);
            });
        }

        // Ensure first slide is active initially
        slides[0].classList.add('active');

        function updateDots() {
            const dots = document.querySelectorAll('.dot');
            dots.forEach((dot, index) => {
                if (index === currentSlide) dot.classList.add('active');
                else dot.classList.remove('active');
            });
        }

        function showSlide(n) {
            slides[currentSlide].classList.remove('active');
            currentSlide = (n + slides.length) % slides.length;
            slides[currentSlide].classList.add('active');
            updateDots();
        }

        function nextSlide() {
            showSlide(currentSlide + 1);
        }

        function prevSlide() {
            showSlide(currentSlide - 1);
        }

        function startTimer() {
            slideTimer = setInterval(nextSlide, slideInterval);

        }

        function resetTimer() {
            clearInterval(slideTimer);
            startTimer();
        }

        // Event listeners
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                nextSlide();
                resetTimer();
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                prevSlide();
                resetTimer();
            });
        }

        // Start auto slide
        startTimer();
    }
});

// Mobile nav toggle for Terms page


document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.getElementById('hamburger-menu');
    const navLinks = document.querySelector('.nav-links');

    hamburger.addEventListener('click', () => {
        // สลับคลาส active เพื่อแสดง/ซ่อน เมนู
        navLinks.classList.toggle('active');

        // (ลูกเล่นเพิ่มเติม) เปลี่ยนไอคอนจาก ขีดๆ เป็น กากบาท (X)
        const icon = hamburger.querySelector('i');
        if (navLinks.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });

});
