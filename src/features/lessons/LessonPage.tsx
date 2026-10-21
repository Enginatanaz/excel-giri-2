/**
 * Interactive Lesson Classroom Page
 * Provides side-by-side or responsive split view with live synchronized spreadsheet simulator
 */

import { useState } from 'react';
import type { Lesson } from '../../modules/learning/lessonTypes.ts';
import { useSpreadsheet } from '../../hooks/useSpreadsheet.ts';
import { useLessonSession } from '../../hooks/useLessonSession.ts';
import { useResponsiveLayout } from '../../hooks/useResponsiveLayout.ts';
import { LessonHeader } from '../../components/lesson/LessonHeader.tsx';
import { LessonTabs } from '../../components/lesson/LessonTabs.tsx';
import { LessonContent } from '../../components/lesson/LessonContent.tsx';
import { LessonProgress } from '../../components/lesson/LessonProgress.tsx';
import { TaskInstruction } from '../../components/lesson/TaskInstruction.tsx';
import { TaskFeedback } from '../../components/lesson/TaskFeedback.tsx';
import { TeacherControls } from '../../components/lesson/TeacherControls.tsx';
import { ExcelToolbar } from '../../components/excel/ExcelToolbar.tsx';
import { FormulaBar } from '../../components/excel/FormulaBar.tsx';
import { SpreadsheetGrid } from '../../components/excel/SpreadsheetGrid.tsx';
import { SheetTabs } from '../../components/excel/SheetTabs.tsx';
import { CellContextMenu } from '../../components/excel/CellContextMenu.tsx';
import { Card } from '../../components/common/Card.tsx';
import { BookOpen, Table2 } from 'lucide-react';

interface LessonPageProps {
  lesson: Lesson;
  onBackToLessons: () => void;
}

export function LessonPage({ lesson, onBackToLessons }: LessonPageProps) {
  const { isMobile } = useResponsiveLayout();
  // On mobile devices, allow quick tab switching between Lesson Guide and Live Excel Table
  const [mobileTab, setMobileTab] = useState<'instruction' | 'spreadsheet'>('instruction');

  // Spreadsheet state engine
  const spreadsheet = useSpreadsheet(lesson.initialWorkbookFactory);

  // Lesson state engine
  const session = useLessonSession(lesson);

  const {
    currentTaskIndex,
    currentTask,
    stepStatus,
    activeTab,
    setActiveTab,
    validationResult,
    completedTaskIds,
    isCompleted,
    validateCurrentTask,
    nextTask,
    retryTask,
    jumpToTask,
  } = session;

  const handleValidate = () => {
    validateCurrentTask(spreadsheet.activeSheet, spreadsheet.selection.activeCell);
  };

  return (
    <div className="space-y-4">
      {/* Lesson Header */}
      <LessonHeader
        lesson={lesson}
        isCompleted={isCompleted}
        onBackToLessons={onBackToLessons}
      />

      {/* Mobile Tab Switcher (< 1024px) */}
      <div className="lg:hidden flex items-center p-1 bg-slate-200/80 rounded-lg">
        <button
          onClick={() => setMobileTab('instruction')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
            mobileTab === 'instruction'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5 text-[#107c41]" />
          <span>Ders & Görevler</span>
        </button>

        <button
          onClick={() => setMobileTab('spreadsheet')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
            mobileTab === 'spreadsheet'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Table2 className="w-3.5 h-3.5 text-[#107c41]" />
          <span>Excel Çalışma Alanı</span>
        </button>
      </div>

      {/* Main Responsive Split Grid (Side-by-side on desktop, switched on mobile) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Lesson Guide & Tasks (Hidden on mobile if user toggles to spreadsheet) */}
        <div
          className={`lg:col-span-5 space-y-4 ${
            isMobile && mobileTab === 'spreadsheet' ? 'hidden' : 'block'
          }`}
        >
          {/* Sub Navigation: Anlatım, Örnek, Uygulama, Özet */}
          <LessonTabs
            activeTab={activeTab}
            onChangeTab={setActiveTab}
            tasksCompletedCount={completedTaskIds.length}
            totalTasksCount={lesson.tasks.length}
          />

          {/* Teacher Audio Bar */}
          <TeacherControls
            currentText={
              activeTab === 'uygulama'
                ? currentTask?.narrationText || lesson.description
                : lesson.explanationContent.overview
            }
          />

          {/* Tab Content */}
          <Card className="min-h-[380px]">
            {activeTab === 'uygulama' ? (
              <div className="space-y-4">
                {/* Step indicator */}
                <LessonProgress
                  tasks={lesson.tasks}
                  currentTaskIndex={currentTaskIndex}
                  completedTaskIds={completedTaskIds}
                  onSelectTask={jumpToTask}
                />

                <div className="h-px bg-slate-100" />

                {/* Active Task Instruction */}
                {currentTask && (
                  <TaskInstruction
                    task={currentTask}
                    totalTasks={lesson.tasks.length}
                  />
                )}

                {/* Validation Feedback & Next Step trigger */}
                <TaskFeedback
                  status={stepStatus}
                  validationResult={validationResult}
                  onValidate={handleValidate}
                  onNextTask={nextTask}
                  onRetry={retryTask}
                  isLastTask={currentTaskIndex === lesson.tasks.length - 1}
                />

                {/* Mobile helper button to quickly jump to the spreadsheet to perform task */}
                {isMobile && (
                  <div className="pt-2">
                    <button
                      onClick={() => setMobileTab('spreadsheet')}
                      className="w-full py-2 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 rounded-md text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Table2 className="w-3.5 h-3.5" />
                      <span>Excel Tablosuna Git ve Uygula</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <LessonContent lesson={lesson} activeTab={activeTab} />
            )}
          </Card>
        </div>

        {/* Right Column: Live Interactive Excel Simulator (Hidden on mobile if user is reading instruction) */}
        <div
          className={`lg:col-span-7 ${
            isMobile && mobileTab === 'instruction' ? 'hidden' : 'block'
          }`}
        >
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-xs">
            {/* Window title bar */}
            <div className="flex items-center justify-between px-3 py-1.5 bg-slate-800 text-white text-xs select-none">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="font-medium truncate">{spreadsheet.workbook.name}</span>
                <span className="text-slate-400 text-[11px] hidden sm:inline">- Excel Simülatörü</span>
              </div>
              <div className="text-[11px] text-slate-300 font-mono">
                Seçili: {spreadsheet.activeCellAddress}
              </div>
            </div>

            {/* Ribbon / Toolbar */}
            <ExcelToolbar
              activeCellStyle={spreadsheet.activeCellData?.style}
              onToggleBold={() =>
                spreadsheet.toggleStyle({
                  bold: !spreadsheet.activeCellData?.style?.bold,
                })
              }
              onToggleItalic={() =>
                spreadsheet.toggleStyle({
                  italic: !spreadsheet.activeCellData?.style?.italic,
                })
              }
              onSetAlignment={(align) => spreadsheet.toggleStyle({ align })}
              onToggleCurrency={() =>
                spreadsheet.toggleStyle({
                  format:
                    spreadsheet.activeCellData?.style?.format === 'currency'
                      ? 'general'
                      : 'currency',
                })
              }
              onAutoSum={() => spreadsheet.applyAutoSum()}
              onCopy={spreadsheet.copyCell}
              onCut={spreadsheet.cutCell}
              onPaste={spreadsheet.pasteCell}
              onClear={spreadsheet.clearCell}
              onReset={() => spreadsheet.resetWorkbook(lesson.initialWorkbookFactory)}
              hasClipboardData={!!spreadsheet.clipboard}
            />

            {/* Formula Bar */}
            <FormulaBar
              activeCellAddress={spreadsheet.activeCellAddress}
              rawValue={spreadsheet.activeCellData?.raw || ''}
              isEditing={spreadsheet.selection.isEditing}
              editValue={spreadsheet.selection.editValue}
              onStartEditing={spreadsheet.startEditing}
              onUpdateEditValue={spreadsheet.updateEditValue}
              onCommitEditing={spreadsheet.commitEditing}
              onCancelEditing={spreadsheet.cancelEditing}
            />

            {/* Grid */}
            <SpreadsheetGrid
              sheet={spreadsheet.activeSheet}
              selection={spreadsheet.selection}
              onSelectCell={spreadsheet.selectCell}
              onStartEditing={spreadsheet.startEditing}
              onUpdateEditValue={spreadsheet.updateEditValue}
              onCommitEditing={spreadsheet.commitEditing}
              onCancelEditing={spreadsheet.cancelEditing}
              onClearCell={spreadsheet.clearCell}
              onContextMenu={(e, cell) => spreadsheet.openContextMenu(e.clientX, e.clientY, cell)}
              onCopy={spreadsheet.copyCell}
              onCut={spreadsheet.cutCell}
              onPaste={spreadsheet.pasteCell}
            />

            {/* Sheet Tabs */}
            <SheetTabs
              sheets={spreadsheet.workbook.sheets}
              activeSheetId={spreadsheet.activeSheetId}
              onSwitchSheet={spreadsheet.switchSheet}
              onAddSheet={spreadsheet.addSheet}
            />
          </div>

          {/* Quick task verification shortcut under spreadsheet on mobile */}
          {isMobile && activeTab === 'uygulama' && (
            <div className="mt-3 p-3 bg-white border border-slate-200 rounded-lg flex items-center justify-between gap-2">
              <div className="text-xs text-slate-700">
                <span className="font-semibold block">Aktif Görev:</span>
                <span className="text-slate-500 truncate block max-w-[200px]">
                  {currentTask?.title}
                </span>
              </div>
              <button
                onClick={() => {
                  handleValidate();
                  setMobileTab('instruction');
                }}
                className="px-3 py-1.5 bg-[#107c41] text-white rounded text-xs font-semibold hover:bg-[#0b5a2f] cursor-pointer"
              >
                Görevi Kontrol Et
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Context Menu */}
      <CellContextMenu
        contextMenu={spreadsheet.contextMenu}
        onClose={spreadsheet.closeContextMenu}
        onEdit={() => spreadsheet.startEditing()}
        onCopy={spreadsheet.copyCell}
        onCut={spreadsheet.cutCell}
        onPaste={spreadsheet.pasteCell}
        onClear={spreadsheet.clearCell}
        hasClipboard={!!spreadsheet.clipboard}
      />
    </div>
  );
}
