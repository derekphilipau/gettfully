import { cookies } from 'next/headers';

import { accounts, mails } from '@/components/search/data';
import { SearchPanels } from '@/components/search/search-panels';

export default function MailPage() {
  const layout = cookies().get('react-resizable-panels:layout');
  const collapsed = cookies().get('react-resizable-panels:collapsed');

  const defaultLayout = layout ? JSON.parse(layout.value) : undefined;
  const defaultCollapsed = collapsed ? JSON.parse(collapsed.value) : undefined;

  return (
    <div className="hidden flex-col md:flex">
      <SearchPanels
        accounts={accounts}
        mails={mails}
        defaultLayout={defaultLayout}
        defaultCollapsed={defaultCollapsed}
        navCollapsedSize={4}
      />
    </div>
  );
}
