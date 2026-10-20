import { NavigationHeader, IconButton, StarIcon, EditIcon } from '@silknet-ds/react';
import { Row } from './_components/Row';

export default { title: 'Navigation Header' };

const back = () => console.log('back');

export const Variants = () => (
  <div style={{ maxWidth: 560 }}>
    <h1 style={{ marginTop: 0 }}>Navigation Header</h1>
    <Row label="default">
      <div style={{ width: 390 }}>
        <NavigationHeader
          title="Header"
          onBack={back}
          actions={
            <IconButton variant="ghost" size="sm" aria-label="Favourite">
              <StarIcon />
            </IconButton>
          }
        />
      </div>
    </Row>
    <Row label="two actions">
      <div style={{ width: 390 }}>
        <NavigationHeader
          title="ძალიან გრძელი სათაური რომელიც არ ეტევა"
          onBack={back}
          actions={
            <>
              <IconButton variant="ghost" size="sm" aria-label="Edit">
                <EditIcon />
              </IconButton>
              <IconButton variant="ghost" size="sm" aria-label="Favourite">
                <StarIcon />
              </IconButton>
            </>
          }
        />
      </div>
    </Row>
    <Row label="search">
      <div style={{ width: 390 }}>
        <NavigationHeader onBack={back} onSearch={() => console.log('open search')} />
      </div>
    </Row>
  </div>
);
