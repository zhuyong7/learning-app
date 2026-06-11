import { Link, useParams } from 'react-router-dom';
import { Bot, ChevronLeft, GraduationCap, SearchX } from 'lucide-react';
import { AudioPlayerMock } from '../components/works/AudioPlayerMock';
import { ReviewCard } from '../components/works/ReviewCard';
import { ScoreBreakdown } from '../components/works/ScoreBreakdown';
import { WorkDetailHeader } from '../components/works/WorkDetailHeader';
import { EmptyState } from '../components/ui/EmptyState';
import { localWorks } from '../data/localData';

export function WorkDetailPage() {
  const { workId } = useParams();
  const parsedWorkId = Number(workId);
  const work = Number.isFinite(parsedWorkId) ? localWorks.find((item) => item.id === parsedWorkId) : undefined;

  if (!work) {
    return (
      <EmptyState
        icon={<SearchX />}
        title="没有找到这个作品"
        description="这个作品可能不存在，或链接已经失效。返回成果库可以继续查看其他学习成果。"
        action={
          <Link
            to="/works"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-growth-primary px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-green-300/40 transition hover:-translate-y-0.5 hover:bg-green-400 focus:outline-none focus:ring-4 focus:ring-growth-primary/25"
          >
            返回成果库
          </Link>
        }
      />
    );
  }

  return (
    <div className="space-y-8">
      <Link
        to="/works"
        className="inline-flex items-center gap-2 text-sm font-black text-slate-500 transition hover:text-growth-secondary"
      >
        <ChevronLeft className="h-4 w-4" />
        返回成果库
      </Link>

      <WorkDetailHeader work={work} />
      <AudioPlayerMock work={work} />

      <div className="grid gap-6 lg:grid-cols-2">
        <ReviewCard title="AI 点评" icon={<Bot className="h-6 w-6" />} body={work.aiComment} />
        <ReviewCard title="老师点评" icon={<GraduationCap className="h-6 w-6" />} body={work.teacherComment} />
      </div>

      <ScoreBreakdown work={work} />
    </div>
  );
}
