import { notFound } from "next/navigation";
import { getResourceBySlug } from "@/lib/kit-resources";
import { KitViewer } from "./kit-viewer";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const resource = getResourceBySlug(slug);
  return { title: resource ? `${resource.name} — Kit Físico` : "Kit Físico" };
}

export default async function KitSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const resource = getResourceBySlug(slug);
  if (!resource) notFound();
  return <KitViewer resource={resource} />;
}
