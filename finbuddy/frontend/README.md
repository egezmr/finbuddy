# FiBuddy: Akıllı Kişisel Finans Asistanı

FiBuddy, açık bankacılık verisiyle çalışan, kullanıcıların harcama alışkanlıklarını analiz eden ve kişiselleştirilmiş tasarruf önerileri sunan modern bir finans asistanıdır. MCP (Multi-Channel Personalization) mimarisiyle hem bireysel hem de B2B (bankalar, fintech'ler) için uygundur.

## Özellikler
- **Akıllı Öneriler Paneli:** Dönemsel harcama, abonelik tespiti, erken rezervasyon ve fırsat hatırlatıcıları
- **Takvim ve Dashboard:** Harcama yapılan günler, kategoriye göre pie chart, toplam ve aylık harcama özetleri
- **Kullanıcı Etkileşimi:** Öneri kabul/ret, davranışsal profil takibi
- **Açık Bankacılık ve B2B:** Gerçek banka API'leriyle kolay entegrasyon, kurumlara özel kişiselleştirme
- **MCP:** Çoklu kanal ve kişiselleştirme desteği (web, mobil, API)

## Kurulum
### Backend (FastAPI)
```bash
cd finbuddy/backend/app
pip install -r ../requirements.txt
uvicorn main:app --reload
```

### Frontend (React)
```bash
cd finbuddy/frontend
npm install
npm run dev
```

## Kullanılan Teknolojiler
- Python, FastAPI, Pandas
- React, Vite, TailwindCSS, React Router, Recharts, React-Calendar

## Proje Mimarisi
- **Backend:** REST API, harcama analizi, öneri motoru, kullanıcı profili
- **Frontend:** Modern ve kullanıcı dostu arayüz, takvim ve grafiklerle görselleştirme
- **Veri:** Açık bankacılık CSV dosyası (örnek veriyle çalışır, gerçek banka API'leriyle kolayca entegre edilebilir)

## B2B ve Açık Bankacılık Katkısı
- Bankalar ve fintech'ler için beyaz etiketli (white-label) akıllı öneri altyapısı
- Açık bankacılık API'leriyle çoklu banka ve hesap desteği
- MCP ile farklı kanallardan (web, mobil, API) aynı kişiselleştirilmiş deneyim
- Müşteri memnuniyeti, segmentasyon ve veri odaklı kampanya fırsatları

## MCP Nedir?
Multi-Channel Personalization: Kullanıcıya, davranışına ve kanalına göre kişiselleştirilmiş öneriler sunan, esnek ve ölçeklenebilir mimari.

## Katkı ve Lisans
Katkıda bulunmak için fork'layın ve PR açın. Proje MIT lisansı ile sunulmaktadır.

## Demo ve Ekran Görüntüleri
- Akıllı öneriler paneli
- Takvim ve pie chart
- Kullanıcı etkileşimi (kabul/ret)

## İletişim
izmiregee@gmail.com