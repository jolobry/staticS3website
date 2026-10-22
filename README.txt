OLOBRY.NET — landing page

Pliki:
- index.html — struktura, treść, meta tagi (SEO, Open Graph) i dane strukturalne JSON-LD
- 404.html — strona błędu „Nie znaleziono strony” (noindex, ścieżki bezwzględne /style.css)
- style.css — układ, typografia i responsywność (wspólny dla obu stron)
- script.js — nagłówek (tło po przewinięciu), menu mobilne, podświetlanie bieżącej sekcji
- joga-hero.webp — zdjęcie w sekcji otwierającej (1672×941)
- favicon.svg — ikona strony
- robots.txt, sitemap.xml — dla wyszukiwarek

Uruchomienie lokalne:
1. Rozpakuj archiwum.
2. Otwórz index.html w przeglądarce.
   (404.html używa ścieżek od katalogu głównego, więc otwarta z dysku będzie bez stylów —
   to normalne; na serwerze wyświetla się poprawnie.)

Publikacja w AWS S3 + CloudFront:
1. Zrób kopię zapasową obecnej witryny.
2. Wgraj wszystkie pliki z listy powyżej do katalogu głównego bucketu (bez README.txt).
   Sprawdź typy MIME: favicon.svg → image/svg+xml, joga-hero.webp → image/webp,
   script.js → text/javascript, sitemap.xml → application/xml.
3. Odśwież cache CloudFront dla /*.
4. Przetestuj linki i wygląd na telefonie oraz komputerze.
5. Ustaw stałe przekierowanie 301 z olobry.net na https://www.olobry.net/
   (np. osobny bucket S3 „Redirect requests” albo funkcja CloudFront).
   Obecnie obie wersje adresu odpowiadają kodem 200, co dubluje stronę w Google.
6. Zgłoś https://www.olobry.net/sitemap.xml w Google Search Console.

Bezpieczeństwo — konfiguracja do wykonania w AWS i DNS
(stan sprawdzony 2026-10-22: HTTPS, TLS 1.2+, przekierowanie http→https i prywatny bucket są OK)

A. Strona błędu 404 (CloudFront → Distribution → Error pages → Create custom error response):
   - HTTP error code 403 → Response page path: /404.html, HTTP response code: 404
   - HTTP error code 404 → Response page path: /404.html, HTTP response code: 404
   (S3 przez OAC zwraca 403 dla nieistniejących plików, dlatego potrzebne są oba wpisy.)
   Error caching minimum TTL: np. 60 s.

B. Nagłówki bezpieczeństwa (CloudFront → Policies → Response headers → Create policy,
   potem przypisz politykę do zachowania Default (*) dystrybucji):
   Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
   Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src 'self' data:; connect-src 'none'; object-src 'none'; base-uri 'self'; form-action 'none'; frame-ancestors 'none'; upgrade-insecure-requests
   X-Content-Type-Options: nosniff
   Referrer-Policy: strict-origin-when-cross-origin
   Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()
   Uwagi:
   - „preload” w HSTS dodaj dopiero, gdy wszystkie subdomeny olobry.net działają po HTTPS.
   - Po wdrożeniu sprawdź konsolę przeglądarki (F12) — CSP pasuje do obecnego kodu, ale każdy
     nowy zewnętrzny skrypt, czcionka czy osadzenie (np. mapa, YouTube) wymaga dopisania do CSP.
   - Test: https://securityheaders.com oraz https://observatory.mozilla.org

C. DNS — ochrona przed podszywaniem się pod adresy e-mail:
   olobry.net nie wysyła poczty, więc blokujemy ją całkowicie:
     olobry.net          TXT  "v=spf1 -all"
     _dmarc.olobry.net   TXT  "v=DMARC1; p=reject; sp=reject; adkim=s; aspf=s"
   olobry.pl (poczta działa, SPF i DMARC są ustawione) — zaostrz ochronę subdomen:
     _dmarc.olobry.pl    zmień sp=none na sp=quarantine; docelowo p=reject po sprawdzeniu raportów
                         (rua=dmarc@olobry.pl), że poczta przechodzi poprawnie.

D. DNS — rekordy CAA (tylko Amazon może wystawiać certyfikaty):
     olobry.net   CAA  0 issue "amazon.com"
     olobry.pl    CAA  0 issue "amazon.com"
   Jeśli olobry.pl używa certyfikatu od innego wystawcy (np. Let's Encrypt u hostingu poczty),
   dopisz go: CAA 0 issue "letsencrypt.org".

E. Konto AWS:
   - S3: włączone „Block all public access”, dostęp do bucketu tylko przez CloudFront (OAC).
   - Konto root z MFA i nieużywane na co dzień.
   - Do wgrywania strony osobny użytkownik IAM z MFA i uprawnieniami tylko do tego bucketu
     (s3:PutObject, s3:DeleteObject, s3:ListBucket) oraz cloudfront:CreateInvalidation.

Uwagi:
- Strona jest opublikowana na www.olobry.net (stan z 2026-10-22 zgodny z tymi plikami,
  z wyjątkiem 404.html i zmian w style.css dodanych później — do wgrania).
- Górny pasek jest przezroczysty nad zdjęciem, a po przewinięciu dostaje jasne tło.
  Logo/baner celowo usunięty z paska (do zaprojektowania później); styl .brand w style.css czeka na użycie.
- Na ekranach do 900 px menu chowa się pod przyciskiem; bez JavaScriptu linki są widoczne bezpośrednio w pasku.
- Czcionki DM Sans i Playfair Display są ładowane z Google Fonts; bez internetu używane są czcionki zapasowe.
  Docelowo warto je hostować lokalnie (woff2), żeby nie przekazywać adresów IP odwiedzających do Google
  (wtedy w CSP style-src i font-src można zawęzić do 'self').
- og:image wskazuje na joga-hero.webp. Dla najszerszej zgodności (LinkedIn, starsze komunikatory)
  warto przygotować og-image.jpg 1200×630 i podmienić adres w index.html.
