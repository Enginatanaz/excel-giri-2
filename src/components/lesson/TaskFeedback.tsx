/**
 * Task validation feedback card linking to live spreadsheet state
 */

import { CheckCircle2, AlertCircle, ArrowRight, RotateCcw, Check } from 'lucide-react';
import type { TaskValidationResult, LessonStepStatus } from '../../modules/learning/lessonTypes.ts';
import { Button } from '../common/Button.tsx';

interface TaskFeedbackProps {
  status: LessonStepStatus;
  validationResult: TaskValidationResult | null;
  onValidate: () => void;
  onNextTask: () => void;
  onRetry: () => void;
  isLastTask: boolean;
}

export function TaskFeedback({
  status,
  validationResult,
  onValidate,
  onNextTask,
  onRetry,
  isLastTask,
}: TaskFeedbackProps) {
  const isSuccess = status === 'success' || validationResult?.isValid === true;
  const isRetry = status === 'retry' || (validationResult && !validationResult.isValid);

  return (
    <div className="pt-2">
      {/* Success State */}
      {isSuccess && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs space-y-3">
          <div className="flex items-start gap-2.5 text-emerald-900">
            <CheckCircle2 className="w-4 h-4 text-[#107c41] shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-emerald-900">Doğrulama Başarılı!</div>
              <div className="text-emerald-800 mt-0.5 leading-relaxed">
                {validationResult?.message || 'Bu adımı başarıyla gerçekleştirdiniz.'}
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <Button
              variant="primary"
              size="sm"
              onClick={onNextTask}
              icon={isLastTask ? <Check className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
              iconPosition="right"
            >
              {isLastTask ? 'Dersi Tamamla' : 'Sonraki Adıma Geç'}
            </Button>
          </div>
        </div>
      )}

      {/* Retry / Error State */}
      {isRetry && (
        <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-lg text-xs space-y-3">
          <div className="flex items-start gap-2.5 text-amber-900">
            <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-amber-900">Tekrar Kontrol Edin</div>
              <div className="text-amber-800 mt-0.5 leading-relaxed">
                {validationResult?.message}
              </div>
              {validationResult?.hint && (
                <div className="text-amber-700 mt-1 font-medium">
                  {validationResult.hint}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <Button
              variant="secondary"
              size="sm"
              onClick={onRetry}
              icon={<RotateCcw className="w-3 h-3" />}
            >
              Tekrar Dene
            </Button>
            <Button variant="primary" size="sm" onClick={onValidate}>
              Şimdi Kontrol Et
            </Button>
          </div>
        </div>
      )}

      {/* Default Instruction / Waiting State */}
      {!isSuccess && !isRetry && (
        <div className="flex items-center justify-between gap-3 pt-1">
          <span className="text-xs text-slate-500">
            İşlemi tabloda uyguladıktan sonra:
          </span>
          <Button variant="primary" size="sm" onClick={onValidate}>
            Görevi Kontrol Et
          </Button>
        </div>
      )}
    </div>
  );
}
