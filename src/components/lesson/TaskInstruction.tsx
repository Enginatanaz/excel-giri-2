/**
 * Task instruction panel displaying active student directive and guidance
 */

import { Target } from 'lucide-react';
import type { TaskStep } from '../../modules/learning/lessonTypes.ts';

interface TaskInstructionProps {
  task: TaskStep;
  totalTasks: number;
}

export function TaskInstruction({ task, totalTasks }: TaskInstructionProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span className="font-semibold text-slate-800">
          Görev {task.taskNumber} / {totalTasks}
        </span>
        {task.targetCell && (
          <span className="flex items-center gap-1 font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
            <Target className="w-3 h-3 text-emerald-600" />
            Hedef: {task.targetCell}
          </span>
        )}
      </div>

      <div>
        <h3 className="text-base font-semibold text-slate-900 mb-1.5">{task.title}</h3>
        <p className="text-sm text-slate-700 leading-relaxed">{task.instruction}</p>
      </div>

      <div className="text-xs text-slate-500 bg-slate-50 p-2.5 rounded border border-slate-200/80">
        <span className="font-semibold text-slate-700">İpucu: </span>
        <span>{task.hint}</span>
      </div>
    </div>
  );
}
