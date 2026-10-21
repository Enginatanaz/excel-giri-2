/**
 * Task validation service that inspects live spreadsheet state
 */

import type { Worksheet, CellCoordinate } from '../spreadsheet/types.ts';
import type { TaskValidationResult } from './lessonTypes.ts';
import { normalizeFormula, parseNumeric } from '../../utils/validation.ts';

export function validateCellSelection(
  activeCell: CellCoordinate,
  expectedCol: string,
  expectedRow: number,
  cellName: string = 'hedef hücre'
): TaskValidationResult {
  const isMatch =
    activeCell.col.toUpperCase() === expectedCol.toUpperCase() &&
    activeCell.row === expectedRow;

  if (isMatch) {
    return {
      isValid: true,
      message: `Harika! ${expectedCol}${expectedRow} hücresini başarıyla seçtiniz.`,
    };
  }

  return {
    isValid: false,
    message: `Şu anda ${activeCell.col}${activeCell.row} hücresindesiniz. Lütfen ${expectedCol}${expectedRow} (${cellName}) hücresine tıklayın.`,
    hint: `${expectedCol}${expectedRow} hücresi tablonun toplam satırındaki boş kutudur.`,
  };
}

export function validateFormulaInput(
  sheet: Worksheet,
  targetCellAddr: string,
  acceptedFormulas: string[]
): TaskValidationResult {
  const cell = sheet.cells[targetCellAddr];
  if (!cell || !cell.raw || cell.raw.trim() === '') {
    return {
      isValid: false,
      message: `${targetCellAddr} hücresine henüz bir formül girilmedi.`,
      hint: `Formül çubuğuna veya ${targetCellAddr} hücresine çift tıklayıp =TOPLA(B2:B6) yazın.`,
    };
  }

  const normalizedRaw = normalizeFormula(cell.raw);
  const normalizedAccepted = acceptedFormulas.map(normalizeFormula);

  const isFormulaMatch = normalizedAccepted.includes(normalizedRaw);

  if (isFormulaMatch) {
    return {
      isValid: true,
      message: `Tebrikler! ${targetCellAddr} hücresine doğru formül yazıldı: ${cell.raw}`,
    };
  }

  return {
    isValid: false,
    message: `${targetCellAddr} hücresindeki formül '${cell.raw}' beklenen formül ile eşleşmiyor.`,
    hint: `Beklenen formül: =TOPLA(B2:B6) veya =SUM(B2:B6). Büyük/küçük harf fark etmez.`,
    expectedValue: acceptedFormulas[0],
  };
}

export function validateCellNumericResult(
  sheet: Worksheet,
  targetCellAddr: string,
  expectedSum: number
): TaskValidationResult {
  const cell = sheet.cells[targetCellAddr];
  if (!cell || cell.computed === null || cell.computed === undefined || cell.computed === '') {
    return {
      isValid: false,
      message: `${targetCellAddr} hücresinde henüz bir sonuç hesaplanmadı. Formülü girip Enter'a basın.`,
      hint: `Enter tuşuna basarak formül girişini onaylayın.`,
    };
  }

  const computedNum = parseNumeric(cell.computed);

  if (Math.abs(computedNum - expectedSum) < 0.001) {
    return {
      isValid: true,
      message: `Mükemmel! Toplam sonuç tam olarak ${expectedSum} ₺ olarak hesaplandı.`,
      expectedValue: expectedSum,
    };
  }

  return {
    isValid: false,
    message: `Hesaplanan sonuç (${cell.computed}) beklenen değer (${expectedSum}) ile uyuşmuyor.`,
    hint: `Lütfen toplanan hücre aralığının B2:B6 olduğundan emin olun (B2+B3+B4+B5+B6 = 3050).`,
    expectedValue: expectedSum,
  };
}
