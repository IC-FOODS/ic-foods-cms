import { notFound } from "next/navigation";
import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { VideoThumbnail } from "@/components/ui/VideoThumbnail";
import { getConferenceByYear, getConferenceVideos } from "@/lib/content";

interface ConferenceVideosPageProps {
  params: Promise<{ year: string }>;
}

export async function generateStaticParams() {
  const { getConferences } = await import("@/lib/content");
  const conferences = getConferences();
  return conferences.map((conf) => ({
    year: conf.year.toString(),
  }));
}

function getYouTubeThumbnail(url: string): string {
  const videoId = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/
  )?.[1];
  if (videoId) {
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  }
  return "/assets/video-placeholder.jpg";
}

export default async function ConferenceVideosPage({
  params,
}: ConferenceVideosPageProps) {
  const { year } = await params;
  const yearNum = parseInt(year, 10);
  const conference = getConferenceByYear(yearNum);

  if (!conference) {
    notFound();
  }

  const videos = getConferenceVideos(yearNum);

  return (
    <Section title="Videos" eyebrow={`${conference.year} Conference`}>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {videos.map((video, index) => (
          <Card key={index} href={video.url}>
            <div className="aspect-video bg-surface-raised rounded-lg mb-4 overflow-hidden">
              <VideoThumbnail
                src={getYouTubeThumbnail(video.url)}
                alt={video.title}
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-lg font-semibold text-primary mb-2">
              {video.title}
            </h3>
            {video.speaker && (
              <p className="text-sm text-muted-text mb-2">{video.speaker}</p>
            )}
            {video.tags && video.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {video.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs border border-primary/20 text-primary px-2 py-1 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </Card>
        ))}
      </div>
    </Section>
  );
}
