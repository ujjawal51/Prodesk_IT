import { SkeletonGrid } from '../components/SkeletonGrid';

export default function Loading() {
  return (
    <div className="animate-fade-in" style={{ width: '100%' }}>
      <div className="skeleton" style={{ height: '380px', borderRadius: '18px', marginBottom: '2.5rem' }} />
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="skeleton" style={{ height: '34px', width: '100px', borderRadius: '20px' }} />
        ))}
      </div>
      <SkeletonGrid count={8} />
    </div>
  );
}
