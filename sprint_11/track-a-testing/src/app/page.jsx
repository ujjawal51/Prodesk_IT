'use client';

import React, { useState } from 'react';
import Button from '../components/Button';
import Card from '../components/Card';
import Input from '../components/Input';
import Counter from '../components/Counter';
import AsyncDataList from '../components/AsyncDataList';

export default function Home() {
  const [inputValue, setInputValue] = useState('');

  return (
    <main style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 20px' }}>
      <header style={{ marginBottom: '40px', borderBottom: '1px solid #1f2937', paddingBottom: '20px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '800', margin: '0 0 8px 0', color: '#60a5fa' }}>
          Sprint 11 Track A: QA Automation Test Suite
        </h1>
        <p style={{ color: '#9ca3af', margin: 0 }}>
          Interactive Demonstration of Tested Next.js UI Components (Jest + RTL + jsdom)
        </p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        {/* Phase 1: Unit Tested Components */}
        <section style={{ background: '#111827', padding: '24px', borderRadius: '12px', border: '1px solid #1f2937' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px', color: '#f3f4f6' }}>
            Phase 1: Unit Components
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Card
              title="Verified Card Component"
              description="Renders text payloads passed via props and mounts without crashing."
              category="QA Verified"
              badge="Passed"
              onAction={() => alert('Card action triggered')}
              actionLabel="Verify Click"
            />
            <div style={{ display: 'flex', gap: '8px' }}>
              <Button variant="primary">Primary CTA</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="danger">Danger</Button>
            </div>
          </div>
        </section>

        {/* Phase 2: Interaction & Event Testing */}
        <section style={{ background: '#111827', padding: '24px', borderRadius: '12px', border: '1px solid #1f2937' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px', color: '#f3f4f6' }}>
            Phase 2: Event & State Testing
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <Input
              label="Simulated Keystroke Input"
              placeholder="Type to see live update..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            {inputValue && (
              <p style={{ fontSize: '13px', color: '#10b981' }}>
                Active State: <strong>{inputValue}</strong>
              </p>
            )}

            <Counter initialValue={0} step={1} min={0} max={50} />
          </div>
        </section>

        {/* Phase 3: Asynchronous Fetch & Network Layer */}
        <section style={{ background: '#111827', padding: '24px', borderRadius: '12px', border: '1px solid #1f2937', gridColumn: '1 / -1' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px', color: '#f3f4f6' }}>
            Phase 3: Network Mocking & Feed
          </h2>
          <AsyncDataList endpoint="https://jsonplaceholder.typicode.com/posts?_limit=3" />
        </section>
      </div>
    </main>
  );
}
