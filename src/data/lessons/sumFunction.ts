/**
 * TOPLA (SUM) Fonksiyonu Dersi
 * Excel Akademi AI - Temel Formüller Seviyesi
 */

import type { Lesson } from '../../modules/learning/lessonTypes.ts';
import { createDefaultWorkbook } from '../../modules/spreadsheet/spreadsheetState.ts';
import {
  validateCellSelection,
  validateFormulaInput,
  validateCellNumericResult,
} from '../../modules/learning/taskValidator.ts';

export const sumFunctionLesson: Lesson = {
  id: 'sum_function',
  number: 2,
  title: 'TOPLA (SUM) Fonksiyonu',
  category: 'Temel Matematiksel Formüller',
  level: 'Başlangıç',
  estimatedMinutes: 8,
  description:
    'Belirli bir hücre aralığındaki sayısal değerleri hızlı ve hatasız biçimde toplamayı öğrenin.',
  learningObjective:
    'Excel’de TOPLA formülünün sözdizimini kavramak, aralık belirtmek ve satış tablosundaki ürün toplamını hesaplamak.',
  explanationContent: {
    overview:
      'Excel’de en sık kullanılan fonksiyon olan TOPLA, parametre olarak verilen hücrelerin veya hücre aralıklarının toplamını hesaplar. Manuel toplama işlemi yerine (=B2+B3+B4+...) TOPLA kullanmak onlarca veya yüzlerce satırı tek bir hamlede toplamanızı sağlar ve sonradan araya satır eklendiğinde formül otomatik genişler.',
    syntax: '=TOPLA(sayı1; [sayı2]; ...) veya =TOPLA(başlangıç_hücresi:bitiş_hücresi)',
    parameters: [
      {
        name: 'aralık (ör: B2:B6)',
        description: 'Toplanacak hücrelerin başlangıç ve bitiş adresleri. İki nokta üst üste (:) aralık belirtir.',
        required: true,
      },
    ],
    bestPractices: [
      'Toplanacak hücreler ardışık ise her hücreyi tek tek toplamak yerine daima B2:B6 gibi aralık gösterimi kullanın.',
      'Türkçe Excel’de =TOPLA(), İngilizce Excel’de ise =SUM() adıyla kullanılır.',
      'Sütun toplamı alırken toplam hücresini her zaman listenin hemen altına konumlandırın.',
    ],
    commonMistakes: [
      'Aralık yazarken iki nokta (:) yerine noktalı virgül (;) kullanmak: B2;B6 sadece B2 ve B6 hücrelerini toplar, aradakileri atlar!',
      'Hücrelerde metin formatında saklanan sayıların toplamı 0 çıkabilir.',
    ],
  },
  solvedExample: {
    title: 'Örnek Senaryo: Haftalık Mağaza Satışları',
    scenario:
      'Elektronik mağazasının 5 farklı ürün grubundan elde ettiği haftalık satış tutarlarını toplayarak genel ciroyu hesaplamak istiyoruz.',
    dataSnippet: [
      { label: 'Mouse (B2)', value: '350 ₺' },
      { label: 'Klavye (B3)', value: '450 ₺' },
      { label: 'Ekran (B4)', value: '1.200 ₺' },
      { label: 'Kamera (B5)', value: '650 ₺' },
      { label: 'Kulaklık (B6)', value: '400 ₺' },
    ],
    formula: '=TOPLA(B2:B6)',
    result: '3.050 ₺',
    explanation:
      'Formül B2’den B6’ya kadar olan tüm sayıları toplar: 350 + 450 + 1200 + 650 + 400 = 3050.',
    steps: [
      '1. Toplam sonucunu yazdırmak istediğiniz B7 hücresine tıklayın.',
      '2. Formül çubuğuna =TOPLA(B2:B6) yazın.',
      '3. Enter tuşuna basarak formülü hesaplatın.',
    ],
  },
  summary: [
    '=TOPLA(...) formülü ardışık veya ayrı hücrelerdeki sayıları toplar.',
    'B2:B6 ifadesindeki iki nokta üst üste, B2 ile B6 arasındaki tüm hücreleri kapsar.',
    'Formülü onaylamak için Enter tuşuna basılır.',
    'Excel Akademi simülatörü hem Türkçe (=TOPLA) hem de uluslararası (=SUM) formüllerini tanır.',
  ],
  tasks: [
    {
      id: 'sum_task_1',
      taskNumber: 1,
      title: 'Toplam Hücresini Seçme',
      instruction:
        'Tablodaki ürünlerin toplam satış tutarını hesaplamak için öncelikle sonuç hücresi olan B7 hücresine tıklayın.',
      hint: 'Tabloda "Toplam" etiketinin sağındaki boş hücre B7 hücresidir.',
      narrationText:
        'Merhaba! İlk görevimiz, toplam sonucunun yazılacağı hücreyi seçmek. Lütfen çalışma sayfasındaki B7 hücresine tıklayın.',
      targetCell: 'B7',
      validate: (sheet, activeCell) => validateCellSelection(activeCell, 'B', 7, 'Toplam'),
    },
    {
      id: 'sum_task_2',
      taskNumber: 2,
      title: 'TOPLA Formülünü Yazma',
      instruction:
        'B7 hücresi seçiliyken, üstteki formül çubuğuna veya doğrudan hücreye =TOPLA(B2:B6) formülünü yazın.',
      hint: 'Formülün başına eşittir (=) koymayı unutmayın. İsterseniz İngilizce =SUM(B2:B6) de yazabilirsiniz.',
      narrationText:
        'Şimdi formülü yazma zamanı. B7 hücresine =TOPLA(B2:B6) yazın.',
      targetCell: 'B7',
      validate: (sheet) =>
        validateFormulaInput(sheet, 'B7', [
          '=TOPLA(B2:B6)',
          '=SUM(B2:B6)',
          '=TOPLA(B2:B6);',
          '=SUM(B2:B6);',
        ]),
    },
    {
      id: 'sum_task_3',
      taskNumber: 3,
      title: 'Enter İle Hesaplatma ve Doğrulama',
      instruction:
        'Klavyenizden Enter tuşuna basarak formülü onaylayın ve B7 hücresindeki sonucun 3050 olarak hesaplandığını doğrulayın.',
      hint: 'Enter tuşuna bastığınızda simülatör formülü derler ve 350 + 450 + 1200 + 650 + 400 işleminin sonucunu gösterir.',
      narrationText:
        'Son olarak Enter tuşuna basın ve tablonun toplam tutarının 3050 olarak hesaplandığını gözlemleyin.',
      targetCell: 'B7',
      validate: (sheet) => validateCellNumericResult(sheet, 'B7', 3050),
    },
  ],
  initialWorkbookFactory: () => createDefaultWorkbook(),
};
