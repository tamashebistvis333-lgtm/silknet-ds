import { Container, Button, ListItem, AirplaneIcon, Divider } from '@silknet-ds/react';

export default { title: 'Container' };

const Placeholder = () => (
  <div style={{ height: 151, borderRadius: 16, background: 'var(--background-pink)' }} />
);

export const Variants = () => (
  <div style={{ maxWidth: 358, display: 'flex', flexDirection: 'column', gap: 32 }}>
    <h1 style={{ marginTop: 0 }}>Container</h1>
    <Container title="სათაური">
      <Placeholder />
    </Container>
    <Container title="სათაური" subtitle="ქვესათაური" action={<Button variant="link">Button</Button>}>
      <Placeholder />
    </Container>
    <Container title="სერვისები" action={<Button variant="link">ყველა</Button>}>
      <div style={{ background: 'var(--background-surface)', borderRadius: 16 }}>
        <ListItem inset leading={<AirplaneIcon />}>როუმინგი</ListItem>
        <Divider alignment="right" />
        <ListItem inset leading={<AirplaneIcon />}>საერთაშორისო ზარები</ListItem>
      </div>
    </Container>
  </div>
);
