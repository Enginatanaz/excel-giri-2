/**
 * Lesson sub-navigation tabs (Konu Anlatımı, Çözümlü Örnek, Uygulama & Görevler, Özet)
 */

import { BookOpen, Lightbulb, PlayCircle, FileText } from 'lucide-react';

export type LessonTabType = 'anlatim' | 'ornek' | 'uygulama' | 'ozet';

interface LessonTabsProps {
  activeTab: LessonTabType;
  onChangeTab: (tab: LessonTabType) => void;
  tasksCompletedCount: number;
  totalTasksCount: number;
}

export function LessonTabs({
  activeTab,
  onChangeTab,
  tasksCompletedCount,
  totalTasksCount,
}: LessonTabsProps) {
  const tabs = [
    { id: 'anlatim' as LessonTabType, label: 'Konu Anlatımı', icon: BookOpen },
    { id: 'ornek' as LessonTabType, label: 'Çözümlü Örnek', icon: Lightbulb },
    {
      id: 'uygulama' as LessonTabType,
      label: `Uygulama (${tasksCompletedCount}/${totalTasksCount})`,
      icon: PlayCircle,
    },
    { id: 'ozet' as LessonTabType, label: 'Özet', icon: FileText },
  ];

  return (
    <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg overflow-x-auto select-none">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => onChangeTab(tab.id)}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap cursor-pointer ${
              isActive
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#107c41]' : 'text-slate-400'}`} />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
