export function EmptyState({
  title,
  description,
  action
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="construct-card construct-clip bg-white p-10 text-center">
      <div className="font-display text-6xl text-construct-black">∅</div>
      <h3 className="construct-heading mt-4 text-2xl text-construct-black">
        {title}
      </h3>
      <p className="mx-auto mt-3 max-w-md text-sm text-construct-muted">
        {description}
      </p>
      {action ? <div className="mt-6 flex justify-center">{action}</div> : null}
    </div>
  );
}
