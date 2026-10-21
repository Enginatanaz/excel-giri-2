/**
 * Rich Lesson Content display for Explanation, Solved Example, and Summary
 */

import { Check, Code2, AlertTriangle, Lightbulb } from 'lucide-react';
import type { Lesson } from '../../modules/learning/lessonTypes.ts';

interface LessonContentProps {
  lesson: Lesson;
  activeTab: 'anlatim' | 'ornek' | 'ozet';
}

export function LessonContent({ lesson, activeTab }: LessonContentProps) {
  if (activeTab === 'anlatim') {
    const { explanationContent } = lesson;
    return (
      <div className="space-y-5 text-xs sm:text-sm text-slate-700 leading-relaxed">
        <div>
          <h3 className="text-base font-semibold text-slate-900 mb-2">Genel Bakış</h3>
          <p>{explanationContent.overview}</p>
        </div>

        {/* Syntax block */}
        <div>
          <h4 className="text-xs font-semibold text-slate-900 mb-1.5 flex items-center gap-1.5">
            <Code2 className="w-3.5 h-3.5 text-[#107c41]" />
            Formül Sözdizimi (Syntax)
          </h4>
          <div className="bg-slate-900 text-emerald-400 font-mono p-3 rounded-md text-xs sm:text-sm overflow-x-auto">
            {explanationContent.syntax}
          </div>
        </div>

        {/* Parameters */}
        {explanationContent.parameters.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold text-slate-900 mb-1.5">Parametreler</h4>
            <div className="border border-slate-200 rounded-md overflow-hidden text-xs">
              {explanationContent.parameters.map((param, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-2.5 bg-white border-b border-slate-100 last:border-b-0"
                >
                  <span className="font-mono font-medium text-emerald-900 bg-emerald-50 px-2 py-0.5 rounded shrink-0">
                    {param.name}
                  </span>
                  <span className="text-slate-600">{param.description}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Best Practices */}
        <div>
          <h4 className="text-xs font-semibold text-slate-900 mb-1.5 flex items-center gap-1.5 text-emerald-800">
            <Lightbulb className="w-3.5 h-3.5 text-emerald-600" />
            İpuçları ve En İyi Uygulamalar
          </h4>
          <ul className="space-y-1.5 text-xs text-slate-600">
            {explanationContent.bestPractices.map((tip, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Common Mistakes */}
        <div>
          <h4 className="text-xs font-semibold text-amber-900 mb-1.5 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            Sık Yapılan Hatalar
          </h4>
          <ul className="space-y-1.5 text-xs text-slate-600">
            {explanationContent.commonMistakes.map((mistake, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-amber-600 font-bold">•</span>
                <span>{mistake}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  if (activeTab === 'ornek') {
    const { solvedExample } = lesson;
    return (
      <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
        <div>
          <h3 className="text-base font-semibold text-slate-900 mb-1">{solvedExample.title}</h3>
          <p className="text-slate-600">{solvedExample.scenario}</p>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-md p-3">
          <span className="text-xs font-semibold text-slate-700 block mb-2">Örnek Veri Seti:</span>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {solvedExample.dataSnippet.map((item, i) => (
              <div key={i} className="flex justify-between p-1.5 bg-white rounded border border-slate-200">
                <span className="text-slate-600">{item.label}</span>
                <span className="font-mono font-medium text-slate-900">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-1.5">
          <span className="text-xs font-semibold text-slate-700">Uygulanan Formül ve Sonuç:</span>
          <div className="flex items-center justify-between p-2.5 bg-slate-900 text-white rounded-md font-mono text-xs sm:text-sm">
            <span className="text-emerald-400">{solvedExample.formula}</span>
            <span className="text-slate-400">=</span>
            <span className="text-amber-400 font-semibold">{solvedExample.result}</span>
          </div>
          <p className="text-xs text-slate-500 pt-1">{solvedExample.explanation}</p>
        </div>

        <div>
          <span className="text-xs font-semibold text-slate-700 block mb-1.5">İzlenen Adımlar:</span>
          <ol className="space-y-1.5 text-xs text-slate-600 list-none pl-0">
            {solvedExample.steps.map((step, i) => (
              <li key={i} className="p-2 bg-white border border-slate-200 rounded">
                {step}
              </li>
            ))}
          </ol>
        </div>
      </div>
    );
  }

  // Summary tab
  return (
    <div className="space-y-4 text-xs sm:text-sm text-slate-700">
      <h3 className="text-base font-semibold text-slate-900 mb-2">Ders Özeti</h3>
      <ul className="space-y-2.5">
        {lesson.summary.map((point, i) => (
          <li key={i} className="flex items-start gap-2.5 p-2.5 bg-white border border-slate-200 rounded-md">
            <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span className="text-slate-700 leading-relaxed">{point}</span>
          </li>
        ))}
      </ul>
      <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-md text-xs text-emerald-900">
        Tebrikler! Bu dersi tamamladıktan sonra Excel Simülatöründe serbest alıştırma yapabilir veya Pratik sekmesindeki görevleri deneyebilirsiniz.
      </div>
    </div>
  );
}
